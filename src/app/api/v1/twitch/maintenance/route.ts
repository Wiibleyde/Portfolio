import { NextRequest, NextResponse } from 'next/server';
import TwitchTokenManager from '@/lib/twitchTokenManager';

export async function GET(): Promise<NextResponse> {
    const tokenManager = TwitchTokenManager.getInstance();
    
    try {
        // Obtenir les informations sur le token actuel
        const tokenInfo = tokenManager.getTokenInfo();
        
        if (!tokenInfo.hasToken) {
            return NextResponse.json({
                status: 'no_token',
                message: 'Aucun token disponible. Veuillez vous authentifier via /api/v1/twitch/auth',
                action_required: 'authentication'
            });
        }

        // Vérifier si le token est encore valide
        const validToken = await tokenManager.getValidToken();
        
        if (!validToken) {
            return NextResponse.json({
                status: 'token_invalid',
                message: 'Le token est invalide et ne peut pas être rafraîchi',
                action_required: 'reauthentication',
                token_info: tokenInfo
            });
        }

        // Token valide ou rafraîchi avec succès
        const updatedInfo = tokenManager.getTokenInfo();
        
        return NextResponse.json({
            status: 'healthy',
            message: 'Token opérationnel',
            token_info: {
                expires_at: updatedInfo.expiresAt,
                expires_in_minutes: updatedInfo.expiresInMinutes,
                scope: updatedInfo.scope,
                has_refresh_token: updatedInfo.hasRefreshToken
            },
            last_check: new Date().toISOString()
        });

    } catch (error) {
        console.error('Token maintenance error:', error);
        return NextResponse.json({
            status: 'error',
            message: 'Erreur lors de la maintenance du token',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');
    const tokenManager = TwitchTokenManager.getInstance();

    try {
        switch (action) {
            case 'refresh':
                console.log('Manual token refresh requested');
                const token = await tokenManager.getValidToken();
                if (!token) {
                    return NextResponse.json({
                        success: false,
                        message: 'Impossible de rafraîchir le token'
                    }, { status: 400 });
                }
                
                return NextResponse.json({
                    success: true,
                    message: 'Token rafraîchi avec succès',
                    token_info: tokenManager.getTokenInfo()
                });

            case 'clear':
                console.log('Manual token clear requested');
                await tokenManager.clearToken();
                return NextResponse.json({
                    success: true,
                    message: 'Token supprimé avec succès'
                });

            case 'health-check':
                // Vérification complète de santé
                const healthToken = await tokenManager.getValidToken();
                const healthInfo = tokenManager.getTokenInfo();
                
                return NextResponse.json({
                    success: true,
                    health: {
                        token_valid: !!healthToken,
                        ...healthInfo,
                        system_time: new Date().toISOString()
                    }
                });

            default:
                return NextResponse.json({
                    success: false,
                    message: 'Action non reconnue',
                    available_actions: ['refresh', 'clear', 'health-check']
                }, { status: 400 });
        }

    } catch (error) {
        console.error('Token action error:', error);
        return NextResponse.json({
            success: false,
            message: 'Erreur lors de l\'exécution de l\'action',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}