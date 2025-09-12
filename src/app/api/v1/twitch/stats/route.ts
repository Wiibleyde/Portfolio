import { NextResponse } from 'next/server';
import TwitchTokenManager from '@/lib/twitchTokenManager';

interface IStatsResponse {
    followers: number;
    subscribers: number;
    lastSubscriber?: {
        username: string;
        subscribeDate: string;
    };
    error?: string;
    cached?: boolean;
    cacheTimestamp?: number;
}

interface CacheEntry {
    data: IStatsResponse;
    timestamp: number;
    expiresAt: number;
}

interface TwitchTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

interface TwitchUserResponse {
    data: Array<{
        id: string;
        login: string;
        display_name: string;
        type: string;
        broadcaster_type: string;
        description: string;
        profile_image_url: string;
        offline_image_url: string;
        view_count: number;
        created_at: string;
    }>;
}

interface TwitchFollowersResponse {
    total: number;
    data: Array<{
        from_id: string;
        from_login: string;
        from_name: string;
        to_id: string;
        to_login: string;
        to_name: string;
        followed_at: string;
    }>;
    pagination?: {
        cursor?: string;
    };
}

interface TwitchSubscribersResponse {
    data: Array<{
        broadcaster_id: string;
        broadcaster_login: string;
        broadcaster_name: string;
        gifter_id: string;
        gifter_login: string;
        gifter_name: string;
        is_gift: boolean;
        plan_name: string;
        tier: string;
        user_id: string;
        user_name: string;
        user_login: string;
    }>;
    pagination?: {
        cursor?: string;
    };
    total: number;
    points: number;
}

// Cache en mémoire pour stocker les données Twitch
const cache = new Map<string, CacheEntry>();

// Configuration du cache
const CACHE_CONFIG = {
    STATS_TTL: 5 * 60 * 1000, // 5 minutes pour les stats (moins fréquent que les viewers)
    ERROR_TTL: 60 * 1000, // 1 minute en cas d'erreur
    MAX_CACHE_SIZE: 10, // Taille maximale du cache
};

function getCacheKey(username: string): string {
    return `twitch_stats_${username}`;
}

function isValidCache(entry: CacheEntry): boolean {
    return Date.now() < entry.expiresAt;
}

function getCachedData(username: string): IStatsResponse | null {
    const cacheKey = getCacheKey(username);
    const entry = cache.get(cacheKey);

    if (entry && isValidCache(entry)) {
        return {
            ...entry.data,
            cached: true,
            cacheTimestamp: entry.timestamp,
        };
    }

    // Supprimer l'entrée expirée
    if (entry) {
        cache.delete(cacheKey);
    }

    return null;
}

function setCacheData(username: string, data: IStatsResponse): void {
    const cacheKey = getCacheKey(username);
    const now = Date.now();

    // Déterminer la durée de vie du cache selon le contexte
    const ttl = data.error ? CACHE_CONFIG.ERROR_TTL : CACHE_CONFIG.STATS_TTL;

    // Nettoyer le cache si il devient trop grand
    if (cache.size >= CACHE_CONFIG.MAX_CACHE_SIZE) {
        // Supprimer l'entrée la plus ancienne
        const oldestKey = Array.from(cache.keys())[0];
        cache.delete(oldestKey);
    }

    cache.set(cacheKey, {
        data: { ...data, cached: false },
        timestamp: now,
        expiresAt: now + ttl,
    });
}

export async function GET(): Promise<NextResponse> {
    const username = 'wiibleyde'; // Nom d'utilisateur Twitch

    try {
        // Vérifier le cache en premier
        const cachedData = getCachedData(username);
        if (cachedData) {
            console.log(`Cache hit for stats ${username} - Age: ${Date.now() - (cachedData.cacheTimestamp || 0)}ms`);
            return NextResponse.json(cachedData);
        }

        console.log(`Cache miss for stats ${username} - Fetching fresh data`);

        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            const errorResponse: IStatsResponse = {
                followers: 0,
                subscribers: 0,
                error: 'Twitch API credentials not configured',
            };
            setCacheData(username, errorResponse);
            return NextResponse.json(errorResponse, { status: 500 });
        }

        // Étape 1: Obtenir un token d'accès
        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'client_credentials',
            }),
        });

        if (!tokenResponse.ok) {
            throw new Error('Failed to get Twitch access token');
        }

        const tokenData: TwitchTokenResponse = await tokenResponse.json();

        // Étape 2: Récupérer l'ID utilisateur
        const userResponse = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                'Client-Id': clientId,
            },
        });

        if (!userResponse.ok) {
            throw new Error('Failed to fetch user data');
        }

        const userData: TwitchUserResponse = await userResponse.json();

        if (userData.data.length === 0) {
            throw new Error('User not found');
        }

        const userId = userData.data[0].id;

        // Étape 3: Récupérer le nombre de followers
        const followersResponse = await fetch(`https://api.twitch.tv/helix/channels/followers?broadcaster_id=${userId}`, {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                'Client-Id': clientId,
            },
        });

        let followersCount = 0;
        if (followersResponse.ok) {
            const followersData: TwitchFollowersResponse = await followersResponse.json();
            followersCount = followersData.total;
        }

        // Étape 4: Récupérer les informations des subscribers
        let subscribersCount = 0;
        let lastSubscriber = undefined;

        // Utiliser le gestionnaire de token automatique
        const tokenManager = TwitchTokenManager.getInstance();
        const userToken = await tokenManager.getValidToken();
        
        if (userToken) {
            try {
                console.log('Using managed token for subscribers data');
                // Récupérer les subscribers avec le token utilisateur
                const subscribersResponse = await fetch(`https://api.twitch.tv/helix/subscriptions?broadcaster_id=${userId}&first=100`, {
                    headers: {
                        Authorization: `Bearer ${userToken}`,
                        'Client-Id': clientId,
                    },
                });

                if (subscribersResponse.ok) {
                    const subscribersData: TwitchSubscribersResponse = await subscribersResponse.json();
                    subscribersCount = subscribersData.total;

                    // Trouver le dernier subscriber (le plus récent)
                    if (subscribersData.data.length > 0) {
                        // Les données sont triées par date, le premier est le plus récent
                        const recent = subscribersData.data[0];
                        lastSubscriber = {
                            username: recent.user_name,
                            subscribeDate: new Date().toISOString(), // L'API ne fournit pas la date d'abonnement
                        };
                    }
                } else {
                    const errorText = await subscribersResponse.text();
                    console.error('Failed to fetch subscribers:', errorText);
                }
            } catch (error) {
                console.error('Error fetching subscribers:', error);
            }
        } else {
            console.log('No valid token available for subscribers data');
        }

        const responseData: IStatsResponse = {
            followers: followersCount,
            subscribers: subscribersCount, // 0 pour l'instant car nécessite un token utilisateur
            lastSubscriber,
        };

        // Mettre en cache la réponse
        setCacheData(username, responseData);

        console.log(
            `Fresh stats fetched for ${username} - Followers: ${responseData.followers}, Subscribers: ${responseData.subscribers}`
        );

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Error fetching Twitch stats:', error);
        const errorResponse: IStatsResponse = {
            followers: 0,
            subscribers: 0,
            error: 'Failed to fetch Twitch stats',
        };

        // Mettre en cache l'erreur pour éviter de répéter les requêtes qui échouent
        setCacheData(username, errorResponse);

        return NextResponse.json(errorResponse, { status: 500 });
    }
}