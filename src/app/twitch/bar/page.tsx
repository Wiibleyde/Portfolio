"use client";
import { Twitch } from 'react-bootstrap-icons';
import useSWR from 'swr';

interface ViewerData {
    viewers: number;
    isLive: boolean;
    error?: string;
}

interface StatsData {
    followers: number;
    subscribers: number;
    lastSubscriber?: {
        username: string;
        subscribeDate: string;
    };
    error?: string;
}

// Fonctions fetcher pour SWR
const fetcher = (url: string) => fetch(url).then(res => res.json());

// Page for /twitch/bar used in my OBS scenes
export default function BarPage() {
    // Utilisation de useSWR pour récupérer les données des viewers
    const { data: viewerData, error: viewerError, isLoading: viewerLoading } = useSWR<ViewerData>(
        '/api/v1/twitch/viewers',
        fetcher,
        {
            refreshInterval: 30000, // Rafraîchir toutes les 30 secondes
            revalidateOnFocus: false,
        }
    );

    // Utilisation de useSWR pour récupérer les statistiques
    const { data: statsData, error: statsError, isLoading: statsLoading } = useSWR<StatsData>(
        '/api/v1/twitch/stats',
        fetcher,
        {
            refreshInterval: 300000, // Rafraîchir toutes les 5 minutes
            revalidateOnFocus: false,
        }
    );

    // Extraction des données ou valeurs par défaut
    const viewerCount = viewerData?.viewers || 0;
    const isLive = viewerData?.isLive || false;
    const followerCount = statsData?.followers || 0;
    const subscriberCount = statsData?.subscribers || 0;
    const lastSubscriber = statsData?.lastSubscriber?.username;

    // État de chargement global
    const loading = viewerLoading || statsLoading;

    if (loading) {
        return (
            <div className="w-full h-8 bg-gray-800/80 backdrop-blur-md text-white text-base font-medium">
                <div className="text-xl">Chargement...</div>
            </div>
        );
    }

    // Gestion des erreurs
    if (viewerError || statsError) {
        console.error('SWR errors:', { viewerError, statsError });
    }

    return (
        <div className="w-full h-8 bg-gray-800/80 backdrop-blur-md text-white text-base font-medium">
            <div className="flex items-center justify-between h-full px-2">
                
                {/* Menu gauche (style Apple menu) */}
                <div className="flex items-center space-x-8">
                    {/* Logo Apple / Stream */}
                    <div className="flex items-center space-x-3 hover:bg-white/10 px-2 py-1 rounded cursor-pointer">
                        <span className="text-white text-lg">🍎</span>
                        <span className="text-white/90 text-sm">Wiibleyde</span>
                    </div>

                    {/* Menu items */}
                    <div className="flex items-center space-x-6">
                        <span className="hover:bg-white/10 px-3 py-1 rounded cursor-pointer text-white/90 text-sm">
                            Fichier
                        </span>
                        <span className="hover:bg-white/10 px-3 py-1 rounded cursor-pointer text-white/90 text-sm">
                            Édition
                        </span>
                        <span className="hover:bg-white/10 px-3 py-1 rounded cursor-pointer text-white/90 text-sm">
                            Affichage
                        </span>
                        <span className="hover:bg-white/10 px-3 py-1 rounded cursor-pointer text-white/90 text-sm">
                            Fenêtre
                        </span>
                        <span className="hover:bg-white/10 px-3 py-1 rounded cursor-pointer text-white/90 text-sm">
                            Aide
                        </span>
                    </div>
                </div>

                {/* Barre de statut droite */}
                <div className="flex items-center space-x-5">

                    {/* Stats compactes */}
                    <div className="flex items-center space-x-5 text-sm text-white/80">
                        <span className="flex items-center space-x-2">
                            <span className="text-base"><Twitch className='text-purple-500' /></span>
                            <span>{viewerCount}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                            <span className="text-base">🤍</span>
                            <span>{followerCount}</span>
                        </span>
                        <span className="flex items-center space-x-2">
                            <span className="text-base">⭐</span>
                            <span>{subscriberCount}</span>
                        </span>
                        {lastSubscriber && (
                            <span className="flex items-center space-x-2 text-green-300">
                                <span className="text-base">🎉</span>
                                <span>{lastSubscriber}</span>
                            </span>
                        )}
                    </div>

                    {/* Icônes système */}
                    {/* <div className="flex items-center space-x-2 text-white/70">
                        <span className="hover:text-white cursor-pointer">🔋</span>
                        <span className="hover:text-white cursor-pointer">📶</span>
                        <span className="hover:text-white cursor-pointer">🔊</span>
                    </div> */}

                    {/* Heure et date */}
                    <div className="text-white/90 text-sm">
                        <div className="text-right flex flex-row space-x-3">
                            <div>{new Date().toLocaleDateString('fr-FR', { 
                                weekday: 'short',
                                day: 'numeric',
                                month: 'short'
                            })}</div>
                            <div>{new Date().toLocaleTimeString('fr-FR', { 
                                hour: '2-digit', 
                                minute: '2-digit' 
                            })}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}