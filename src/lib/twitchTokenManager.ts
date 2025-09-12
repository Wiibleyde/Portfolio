import fs from 'fs/promises';
import path from 'path';

interface TokenData {
    access_token: string;
    refresh_token?: string;
    expires_at: number; // Timestamp Unix
    created_at: number;
    scope: string[];
}

interface TwitchTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token?: string;
    scope: string[];
}

class TwitchTokenManager {
    private static instance: TwitchTokenManager;
    private tokenPath: string;
    private currentToken: TokenData | null = null;
    private refreshPromise: Promise<string> | null = null;

    private constructor() {
        // Stocker le token dans un fichier JSON sécurisé
        this.tokenPath = path.join(process.cwd(), '.twitch-token.json');
    }

    public static getInstance(): TwitchTokenManager {
        if (!TwitchTokenManager.instance) {
            TwitchTokenManager.instance = new TwitchTokenManager();
        }
        return TwitchTokenManager.instance;
    }

    private async loadTokenFromFile(): Promise<TokenData | null> {
        try {
            const data = await fs.readFile(this.tokenPath, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // Fichier n'existe pas ou erreur de lecture
            return null;
        }
    }

    private async saveTokenToFile(token: TokenData): Promise<void> {
        try {
            await fs.writeFile(this.tokenPath, JSON.stringify(token, null, 2));
            console.log('Token saved to file');
        } catch (error) {
            console.error('Failed to save token to file:', error);
        }
    }

    private async loadTokenFromEnv(): Promise<TokenData | null> {
        const accessToken = process.env.TWITCH_USER_TOKEN;
        const refreshToken = process.env.TWITCH_REFRESH_TOKEN;

        if (!accessToken) {
            return null;
        }

        // Si on n'a que le token sans refresh, on ne peut pas déterminer l'expiration
        return {
            access_token: accessToken,
            refresh_token: refreshToken,
            expires_at: Date.now() + (4 * 60 * 60 * 1000), // 4h par défaut
            created_at: Date.now(),
            scope: ['channel:read:subscriptions'], // Scope par défaut
        };
    }

    private async refreshToken(refreshToken: string): Promise<TokenData> {
        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            throw new Error('Twitch credentials not configured');
        }

        console.log('Refreshing Twitch token...');

        const response = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            }),
        });

        if (!response.ok) {
            const errorText = await response.text();
            console.error('Token refresh failed:', errorText);
            throw new Error('Failed to refresh token');
        }

        const tokenData: TwitchTokenResponse = await response.json();
        const now = Date.now();

        const newToken: TokenData = {
            access_token: tokenData.access_token,
            refresh_token: tokenData.refresh_token || refreshToken,
            expires_at: now + (tokenData.expires_in * 1000),
            created_at: now,
            scope: tokenData.scope,
        };

        // Sauvegarder le nouveau token
        await this.saveTokenToFile(newToken);
        this.currentToken = newToken;

        console.log(`Token refreshed successfully, expires in ${Math.round(tokenData.expires_in / 3600)} hours`);
        return newToken;
    }

    private async validateToken(token: string): Promise<boolean> {
        const clientId = process.env.TWITCH_CLIENT_ID;
        if (!clientId) return false;

        try {
            const response = await fetch('https://id.twitch.tv/oauth2/validate', {
                headers: {
                    Authorization: `OAuth ${token}`,
                },
            });

            return response.ok;
        } catch {
            return false;
        }
    }

    public async getValidToken(): Promise<string | null> {
        // Si on a déjà un processus de refresh en cours, attendre
        if (this.refreshPromise) {
            try {
                return await this.refreshPromise;
            } catch (error) {
                this.refreshPromise = null;
                throw error;
            }
        }

        // Charger le token depuis le fichier ou l'env
        if (!this.currentToken) {
            this.currentToken = await this.loadTokenFromFile() || await this.loadTokenFromEnv();
        }

        if (!this.currentToken) {
            console.log('No token available, need to authenticate first');
            return null;
        }

        const now = Date.now();
        const timeUntilExpiry = this.currentToken.expires_at - now;
        const fiveMinutes = 5 * 60 * 1000;

        // Si le token expire dans moins de 5 minutes, le rafraîchir
        if (timeUntilExpiry < fiveMinutes) {
            if (!this.currentToken.refresh_token) {
                console.log('Token expiring soon but no refresh token available');
                return null;
            }

            // Éviter les refreshs multiples simultanés
            this.refreshPromise = (async () => {
                try {
                    const newToken = await this.refreshToken(this.currentToken!.refresh_token!);
                    return newToken.access_token;
                } finally {
                    this.refreshPromise = null;
                }
            })();

            return await this.refreshPromise;
        }

        // Valider que le token fonctionne encore
        const isValid = await this.validateToken(this.currentToken.access_token);
        if (!isValid) {
            if (this.currentToken.refresh_token) {
                console.log('Token invalid, attempting refresh...');
                this.refreshPromise = (async () => {
                    try {
                        const newToken = await this.refreshToken(this.currentToken!.refresh_token!);
                        return newToken.access_token;
                    } finally {
                        this.refreshPromise = null;
                    }
                })();
                return await this.refreshPromise;
            } else {
                console.log('Token invalid and no refresh token available');
                this.currentToken = null;
                return null;
            }
        }

        return this.currentToken.access_token;
    }

    public async storeNewToken(tokenResponse: TwitchTokenResponse): Promise<void> {
        const now = Date.now();
        const tokenData: TokenData = {
            access_token: tokenResponse.access_token,
            refresh_token: tokenResponse.refresh_token,
            expires_at: now + (tokenResponse.expires_in * 1000),
            created_at: now,
            scope: tokenResponse.scope,
        };

        this.currentToken = tokenData;
        await this.saveTokenToFile(tokenData);
        console.log('New token stored successfully');
    }

    public getTokenInfo(): { 
        hasToken: boolean; 
        expiresAt?: Date; 
        expiresInMinutes?: number; 
        scope?: string[];
        hasRefreshToken: boolean;
    } {
        if (!this.currentToken) {
            return { hasToken: false, hasRefreshToken: false };
        }

        const expiresAt = new Date(this.currentToken.expires_at);
        const expiresInMinutes = Math.max(0, Math.round((this.currentToken.expires_at - Date.now()) / (60 * 1000)));

        return {
            hasToken: true,
            expiresAt,
            expiresInMinutes,
            scope: this.currentToken.scope,
            hasRefreshToken: !!this.currentToken.refresh_token,
        };
    }

    public async clearToken(): Promise<void> {
        this.currentToken = null;
        try {
            await fs.unlink(this.tokenPath);
        } catch (error) {
            // Fichier n'existe peut-être pas
        }
    }
}

export default TwitchTokenManager;