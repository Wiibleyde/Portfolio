"use client";
import Link from "next/link";
import { useState, useEffect } from "react";

interface TokenHealth {
    status: string;
    message: string;
    token_info?: {
        expires_at: string;
        expires_in_minutes: number;
        scope: string[];
        has_refresh_token: boolean;
    };
    last_check?: string;
    action_required?: string;
}

export default function TwitchAdminPage() {
    const [health, setHealth] = useState<TokenHealth | null>(null);
    const [loading, setLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

    const fetchHealth = async () => {
        try {
            const response = await fetch('/api/v1/twitch/maintenance');
            const data = await response.json();
            setHealth(data);
            setLastUpdate(new Date());
        } catch (error) {
            console.error('Error fetching health:', error);
            setHealth({
                status: 'error',
                message: 'Erreur de connexion à l\'API'
            });
        } finally {
            setLoading(false);
        }
    };

    const performAction = async (action: string) => {
        setLoading(true);
        try {
            const response = await fetch(`/api/v1/twitch/maintenance?action=${action}`, {
                method: 'POST'
            });
            const data = await response.json();
            console.log(`Action ${action} result:`, data);
            
            // Rafraîchir les données après l'action
            await fetchHealth();
        } catch (error) {
            console.error(`Error performing ${action}:`, error);
        }
    };

    useEffect(() => {
        fetchHealth();
        
        // Vérifier toutes les 5 minutes
        const interval = setInterval(fetchHealth, 5 * 60 * 1000);
        return () => clearInterval(interval);
    }, []);

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'healthy': return 'text-green-500';
            case 'no_token': return 'text-yellow-500';
            case 'token_invalid': return 'text-red-500';
            case 'error': return 'text-red-500';
            default: return 'text-gray-500';
        }
    };

    const getStatusIcon = (status: string) => {
        switch (status) {
            case 'healthy': return '✅';
            case 'no_token': return '⚠️';
            case 'token_invalid': return '❌';
            case 'error': return '💥';
            default: return '❓';
        }
    };

    if (loading && !health) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-xl">Chargement...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <div className="max-w-4xl mx-auto">
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <div className="flex items-center justify-between mb-6">
                        <h1 className="text-3xl font-bold text-gray-800">
                            🔧 Administration Twitch
                        </h1>
                        <button
                            onClick={fetchHealth}
                            disabled={loading}
                            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                        >
                            {loading ? '🔄' : '🔄'} Actualiser
                        </button>
                    </div>

                    {health && (
                        <div className="space-y-6">
                            {/* Status Principal */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <div className="flex items-center space-x-3">
                                    <span className="text-2xl">{getStatusIcon(health.status)}</span>
                                    <div>
                                        <h2 className={`text-xl font-semibold ${getStatusColor(health.status)}`}>
                                            {health.status.toUpperCase().replace('_', ' ')}
                                        </h2>
                                        <p className="text-gray-600">{health.message}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Informations du Token */}
                            {health.token_info && (
                                <div className="bg-blue-50 rounded-lg p-4">
                                    <h3 className="text-lg font-semibold mb-3">📊 Informations du Token</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                        <div>
                                            <strong>Expire le:</strong> 
                                            <div className="text-sm">
                                                {new Date(health.token_info.expires_at).toLocaleString('fr-FR')}
                                            </div>
                                        </div>
                                        <div>
                                            <strong>Temps restant:</strong>
                                            <div className={`text-sm ${health.token_info.expires_in_minutes < 60 ? 'text-red-500' : health.token_info.expires_in_minutes < 240 ? 'text-yellow-500' : 'text-green-500'}`}>
                                                {health.token_info.expires_in_minutes} minutes
                                                ({Math.round(health.token_info.expires_in_minutes / 60)} heures)
                                            </div>
                                        </div>
                                        <div>
                                            <strong>Refresh Token:</strong>
                                            <div className={`text-sm ${health.token_info.has_refresh_token ? 'text-green-500' : 'text-red-500'}`}>
                                                {health.token_info.has_refresh_token ? '✅ Disponible' : '❌ Indisponible'}
                                            </div>
                                        </div>
                                        <div>
                                            <strong>Scopes:</strong>
                                            <div className="text-sm">
                                                {health.token_info.scope.join(', ')}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Actions */}
                            <div className="bg-gray-50 rounded-lg p-4">
                                <h3 className="text-lg font-semibold mb-3">⚡ Actions</h3>
                                <div className="flex flex-wrap gap-3">
                                    <button
                                        onClick={() => performAction('refresh')}
                                        disabled={loading}
                                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                                    >
                                        🔄 Rafraîchir Token
                                    </button>
                                    <button
                                        onClick={() => performAction('health-check')}
                                        disabled={loading}
                                        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                                    >
                                        🩺 Vérification Complète
                                    </button>
                                    <button
                                        onClick={() => {
                                            if (confirm('Êtes-vous sûr de vouloir supprimer le token ?')) {
                                                performAction('clear');
                                            }
                                        }}
                                        disabled={loading}
                                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
                                    >
                                        🗑️ Supprimer Token
                                    </button>
                                    <Link
                                        href="/api/v1/twitch/auth"
                                        className="bg-purple-500 hover:bg-purple-600 text-white px-4 py-2 rounded-lg inline-block"
                                    >
                                        🔐 Nouvelle Authentification
                                    </Link>
                                </div>
                            </div>

                            {/* Action Requise */}
                            {health.action_required && (
                                <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4">
                                    <div className="flex">
                                        <div className="flex-shrink-0">
                                            <span className="text-yellow-400 text-xl">⚠️</span>
                                        </div>
                                        <div className="ml-3">
                                            <h3 className="text-sm font-medium text-yellow-800">
                                                Action Requise
                                            </h3>
                                            <div className="mt-2 text-sm text-yellow-700">
                                                {health.action_required === 'authentication' && 
                                                    'Vous devez vous authentifier pour obtenir un token.'}
                                                {health.action_required === 'reauthentication' && 
                                                    'Le token ne peut pas être rafraîchi, une nouvelle authentification est nécessaire.'}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Dernière Mise à Jour */}
                            {lastUpdate && (
                                <div className="text-sm text-gray-500 text-center">
                                    Dernière mise à jour: {lastUpdate.toLocaleString('fr-FR')}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}