import { NextResponse } from 'next/server';

interface IReponse {
    viewers: number;
    isLive: boolean;
    error?: string;
    cached?: boolean;
    cacheTimestamp?: number;
}

interface CacheEntry {
    data: IReponse;
    timestamp: number;
    expiresAt: number;
}

interface TwitchTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
}

interface TwitchStreamResponse {
    data: Array<{
        id: string;
        user_id: string;
        user_login: string;
        user_name: string;
        game_id: string;
        game_name: string;
        type: string;
        title: string;
        viewer_count: number;
        started_at: string;
        language: string;
        thumbnail_url: string;
        tag_ids: string[];
        is_mature: boolean;
    }>;
}

// Cache en mémoire pour stocker les données Twitch
const cache = new Map<string, CacheEntry>();

// Configuration du cache
const CACHE_CONFIG = {
    LIVE_STREAM_TTL: 30 * 1000, // 30 secondes si le stream est en ligne
    OFFLINE_STREAM_TTL: 5 * 60 * 1000, // 5 minutes si le stream est hors ligne
    ERROR_TTL: 60 * 1000, // 1 minute en cas d'erreur
    MAX_CACHE_SIZE: 10, // Taille maximale du cache
};

function getCacheKey(username: string): string {
    return `twitch_viewers_${username}`;
}

function isValidCache(entry: CacheEntry): boolean {
    return Date.now() < entry.expiresAt;
}

function getCachedData(username: string): IReponse | null {
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

function setCacheData(username: string, data: IReponse): void {
    const cacheKey = getCacheKey(username);
    const now = Date.now();

    // Déterminer la durée de vie du cache selon le contexte
    let ttl: number;
    if (data.error) {
        ttl = CACHE_CONFIG.ERROR_TTL;
    } else if (data.isLive) {
        ttl = CACHE_CONFIG.LIVE_STREAM_TTL;
    } else {
        ttl = CACHE_CONFIG.OFFLINE_STREAM_TTL;
    }

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
            console.log(`Cache hit for ${username} - Age: ${Date.now() - (cachedData.cacheTimestamp || 0)}ms`);
            return NextResponse.json(cachedData);
        }

        console.log(`Cache miss for ${username} - Fetching fresh data`);

        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            const errorResponse: IReponse = {
                viewers: 0,
                isLive: false,
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

        // Étape 2: Récupérer les informations du stream
        const streamResponse = await fetch(`https://api.twitch.tv/helix/streams?user_login=${username}`, {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                'Client-Id': clientId,
            },
        });

        if (!streamResponse.ok) {
            throw new Error('Failed to fetch stream data');
        }

        const streamData: TwitchStreamResponse = await streamResponse.json();

        let responseData: IReponse;

        // Si le stream est en ligne, retourner le nombre de viewers
        if (streamData.data.length > 0) {
            responseData = {
                viewers: streamData.data[0].viewer_count,
                isLive: true,
            };
        } else {
            // Le stream n'est pas en ligne
            responseData = {
                viewers: 0,
                isLive: false,
            };
        }

        // Mettre en cache la réponse
        setCacheData(username, responseData);

        console.log(
            `Fresh data fetched for ${username} - Live: ${responseData.isLive}, Viewers: ${responseData.viewers}`
        );

        return NextResponse.json(responseData);
    } catch (error) {
        console.error('Error fetching Twitch viewers:', error);
        const errorResponse: IReponse = {
            viewers: 0,
            isLive: false,
            error: 'Failed to fetch Twitch data',
        };

        // Mettre en cache l'erreur pour éviter de répéter les requêtes qui échouent
        setCacheData(username, errorResponse);

        return NextResponse.json(errorResponse, { status: 500 });
    }
}
