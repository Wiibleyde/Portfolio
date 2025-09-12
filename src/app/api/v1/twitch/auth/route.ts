import { NextRequest, NextResponse } from 'next/server';
import TwitchTokenManager from '@/lib/twitchTokenManager';

interface TwitchTokenResponse {
    access_token: string;
    expires_in: number;
    token_type: string;
    refresh_token?: string;
    scope: string[];
}

export async function GET(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get('code');
    const state = searchParams.get('state');

    // Si pas de code, rediriger vers l'autorisation Twitch
    if (!code) {
        const clientId = process.env.TWITCH_CLIENT_ID;
        const redirectUri = process.env.TWITCH_REDIRECT_URI || 'http://localhost:3000/api/v1/twitch/auth';
        
        if (!clientId) {
            return NextResponse.json({ error: 'Twitch Client ID not configured' }, { status: 500 });
        }

        // Scopes nécessaires pour les subscribers et autres données
        const scopes = [
            'channel:read:subscriptions',
            'channel:read:hype_train',
            'moderation:read',
            'channel:moderate'
        ].join(' ');

        const authUrl = new URL('https://id.twitch.tv/oauth2/authorize');
        authUrl.searchParams.set('client_id', clientId);
        authUrl.searchParams.set('redirect_uri', redirectUri);
        authUrl.searchParams.set('response_type', 'code');
        authUrl.searchParams.set('scope', scopes);
        authUrl.searchParams.set('state', 'auth_request'); // Pour la sécurité

        return NextResponse.redirect(authUrl.toString());
    }

    // Si on a un code, échanger contre un token
    try {
        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;
        const redirectUri = process.env.TWITCH_REDIRECT_URI || 'http://localhost:3000/api/v1/twitch/auth';

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: 'Twitch credentials not configured' }, { status: 500 });
        }

        // Échanger le code contre un token
        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                code: code,
                grant_type: 'authorization_code',
                redirect_uri: redirectUri,
            }),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token exchange failed:', errorText);
            return NextResponse.json({ error: 'Failed to exchange code for token' }, { status: 400 });
        }

        const tokenData: TwitchTokenResponse = await tokenResponse.json();

        // Stocker le token via le gestionnaire
        const tokenManager = TwitchTokenManager.getInstance();
        await tokenManager.storeNewToken(tokenData);

        // Valider le token en récupérant les informations utilisateur
        const userResponse = await fetch('https://api.twitch.tv/helix/users', {
            headers: {
                Authorization: `Bearer ${tokenData.access_token}`,
                'Client-Id': clientId,
            },
        });

        if (!userResponse.ok) {
            return NextResponse.json({ error: 'Failed to validate token' }, { status: 400 });
        }

        const userData = await userResponse.json();

        // Créer une page HTML simple pour afficher le token
        const html = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Twitch OAuth Token</title>
            <style>
                body {
                    font-family: Arial, sans-serif;
                    max-width: 800px;
                    margin: 50px auto;
                    padding: 20px;
                    background-color: #f5f5f5;
                }
                .container {
                    background: white;
                    padding: 30px;
                    border-radius: 10px;
                    box-shadow: 0 2px 10px rgba(0,0,0,0.1);
                }
                .token-box {
                    background: #f8f9fa;
                    border: 1px solid #e9ecef;
                    border-radius: 5px;
                    padding: 15px;
                    margin: 20px 0;
                    font-family: monospace;
                    word-break: break-all;
                }
                .success {
                    color: #28a745;
                    font-weight: bold;
                }
                .warning {
                    color: #ffc107;
                    font-weight: bold;
                }
                .info {
                    background: #d1ecf1;
                    border: 1px solid #bee5eb;
                    border-radius: 5px;
                    padding: 15px;
                    margin: 20px 0;
                }
                button {
                    background: #007bff;
                    color: white;
                    border: none;
                    padding: 10px 20px;
                    border-radius: 5px;
                    cursor: pointer;
                    margin: 5px;
                }
                button:hover {
                    background: #0056b3;
                }
            </style>
        </head>
        <body>
            <div class="container">
                <h1>🎉 Autorisation Twitch réussie !</h1>
                
                <p class="success">✅ Token généré avec succès pour l'utilisateur: ${userData.data[0].display_name}</p>
                
                <h2>Token d'accès:</h2>
                <div class="token-box" id="accessToken">${tokenData.access_token}</div>
                <button onclick="copyToClipboard('accessToken')">📋 Copier le token</button>
                
                ${tokenData.refresh_token ? `
                <h2>Token de rafraîchissement:</h2>
                <div class="token-box" id="refreshToken">${tokenData.refresh_token}</div>
                <button onclick="copyToClipboard('refreshToken')">📋 Copier le refresh token</button>
                ` : ''}
                
                <h2>Informations:</h2>
                <ul>
                    <li><strong>Expire dans:</strong> ${tokenData.expires_in} secondes (${Math.round(tokenData.expires_in / 3600)} heures)</li>
                    <li><strong>Scopes autorisés:</strong> ${tokenData.scope.join(', ')}</li>
                    <li><strong>Type de token:</strong> ${tokenData.token_type}</li>
                </ul>
                
                <div class="info">
                    <h3>📝 Prochaines étapes:</h3>
                    <ol>
                        <li>✅ <strong>Token automatiquement sauvegardé et géré</strong></li>
                        <li>Le système rafraîchira automatiquement le token avant expiration</li>
                        <li>Surveillez l'état via <a href="/api/v1/twitch/maintenance" target="_blank">/api/v1/twitch/maintenance</a></li>
                        <li>⚠️ <span class="warning">Gardez ce token secret et ne le partagez jamais!</span></li>
                    </ol>
                </div>
                
                <div class="info">
                    <h3>🔄 Maintenance automatique:</h3>
                    <p>✅ Le token sera automatiquement rafraîchi ${Math.round((tokenData.expires_in - 300) / 3600)} heures. 
                    Plus besoin de vous en occuper ! Le système gère tout automatiquement.</p>
                </div>
            </div>
            
            <script>
                function copyToClipboard(elementId) {
                    const element = document.getElementById(elementId);
                    const text = element.textContent;
                    navigator.clipboard.writeText(text).then(() => {
                        alert('Token copié dans le presse-papiers!');
                    }).catch(() => {
                        // Fallback pour les navigateurs plus anciens
                        const textArea = document.createElement('textarea');
                        textArea.value = text;
                        document.body.appendChild(textArea);
                        textArea.focus();
                        textArea.select();
                        document.execCommand('copy');
                        document.body.removeChild(textArea);
                        alert('Token copié dans le presse-papiers!');
                    });
                }
            </script>
        </body>
        </html>
        `;

        return new NextResponse(html, {
            headers: {
                'Content-Type': 'text/html',
            },
        });

    } catch (error) {
        console.error('Error during OAuth flow:', error);
        return NextResponse.json({ error: 'OAuth flow failed' }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { refresh_token } = body;

        if (!refresh_token) {
            return NextResponse.json({ error: 'Refresh token required' }, { status: 400 });
        }

        const clientId = process.env.TWITCH_CLIENT_ID;
        const clientSecret = process.env.TWITCH_CLIENT_SECRET;

        if (!clientId || !clientSecret) {
            return NextResponse.json({ error: 'Twitch credentials not configured' }, { status: 500 });
        }

        // Rafraîchir le token
        const tokenResponse = await fetch('https://id.twitch.tv/oauth2/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: new URLSearchParams({
                client_id: clientId,
                client_secret: clientSecret,
                grant_type: 'refresh_token',
                refresh_token: refresh_token,
            }),
        });

        if (!tokenResponse.ok) {
            const errorText = await tokenResponse.text();
            console.error('Token refresh failed:', errorText);
            return NextResponse.json({ error: 'Failed to refresh token' }, { status: 400 });
        }

        const tokenData: TwitchTokenResponse = await tokenResponse.json();

        return NextResponse.json({
            access_token: tokenData.access_token,
            expires_in: tokenData.expires_in,
            refresh_token: tokenData.refresh_token,
            scope: tokenData.scope,
        });

    } catch (error) {
        console.error('Error refreshing token:', error);
        return NextResponse.json({ error: 'Token refresh failed' }, { status: 500 });
    }
}