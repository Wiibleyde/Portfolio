'use client';

import './SimpleTwitchChatScrollbar.css';

import React, { useRef, useEffect } from 'react';
import { useTwitchChatClient, ChatMessage } from '@/hooks/useTwitchChatClient';
import Image from 'next/image';

interface SimpleTwitchChatProps {
    channel: string;
    className?: string;
    width?: string;
    height?: string;
}

const SimpleTwitchChat: React.FC<SimpleTwitchChatProps> = ({
    channel,
    className = '',
    width = '600px',
    height = '400px',
}) => {
    const { messages } = useTwitchChatClient({
        channel,
    });

    const messagesEndRef = useRef<HTMLDivElement>(null);

    // Auto-scroll vers le bas quand de nouveaux messages arrivent
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const processBadges = (badges: string[] | undefined) => {
        if (!badges) return null;
        switch (badges[0]) {
            case 'broadcaster':
                return <span className="text-red-500 font-bold mr-1">[B]</span>;
            case 'moderator':
                return <span className="text-green-500 font-bold mr-1">[M]</span>;
            case 'vip':
                return <span className="text-yellow-500 font-bold mr-1">[V]</span>;
            case 'subscriber':
                return <span className="text-blue-500 font-bold mr-1">[S]</span>;
            default:
                return null;
        }
    };

    const renderMessage = (message: ChatMessage) => {
        // Fonction pour remplacer les emotes dans le texte par des images
        const renderWithEmotes = (text: string, emotes?: { id: string; positions: [number, number][] }[]) => {
            if (!emotes || emotes.length === 0) return text;

            // Créer un tableau de segments avec les emotes
            const segments: Array<{ type: 'text' | 'emote'; content: string; emoteId?: string }> = [];
            let lastIndex = 0;

            // Collecter toutes les positions d'emotes et les trier
            const allPositions: Array<{ start: number; end: number; emoteId: string }> = [];
            emotes.forEach((emote) => {
                emote.positions.forEach(([start, end]) => {
                    allPositions.push({ start, end, emoteId: emote.id });
                });
            });

            // Trier par position de début
            allPositions.sort((a, b) => a.start - b.start);

            // Construire les segments
            allPositions.forEach(({ start, end, emoteId }) => {
                // Ajouter le texte avant l'emote
                if (start > lastIndex) {
                    segments.push({
                        type: 'text',
                        content: text.slice(lastIndex, start),
                    });
                }

                // Ajouter l'emote
                segments.push({
                    type: 'emote',
                    content: text.slice(start, end + 1),
                    emoteId,
                });

                lastIndex = end + 1;
            });

            // Ajouter le texte restant
            if (lastIndex < text.length) {
                segments.push({
                    type: 'text',
                    content: text.slice(lastIndex),
                });
            }

            // Rendre les segments
            return (
                <span className="text-lg">
                    {segments.map((segment, index) => {
                        if (segment.type === 'emote' && segment.emoteId) {
                            const animatedUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${segment.emoteId}/animated/light/3.0`;
                            const staticUrl = `https://static-cdn.jtvnw.net/emoticons/v2/${segment.emoteId}/static/light/3.0`;
                            return (
                                <Image
                                    key={index}
                                    src={animatedUrl}
                                    alt={segment.content}
                                    title={segment.content}
                                    className="inline w-6 h-6 align-middle"
                                    width={24}
                                    height={24}
                                    unoptimized
                                    onError={(e) => {
                                        const target = e.currentTarget;
                                        if (target.src !== staticUrl) {
                                            target.src = staticUrl;
                                        }
                                    }}
                                />
                            );
                        }
                        return <span key={index}>{segment.content}</span>;
                    })}
                </span>
            );
        };

        return (
            <div key={message.id} className="mb-1 group px-1 py-0.5 rounded-lg">
                <div className="flex flex-row gap-1">
                    <div className="flex items-start text-base shrink-0 pt-0.5">
                        {/* Prompt style terminal */}
                        <span className="text-green-400 font-mono">
                            {(message.displayName || message.username).toLowerCase()}@wiibleyde-stream
                        </span>
                        <span className="ml-1">{processBadges(message.badges)}</span>
                        <span className="text-blue-400 font-mono">:</span>
                        <span className="text-blue-400 font-mono">~</span>
                        <span className="text-white font-mono">$</span>
                        <span className="text-white font-mono ml-1">echo</span>
                    </div>
                    {/* Message avec guillemets pour simuler une commande echo, avec emotes */}
                    <div className="break-words text-gray-300 font-mono flex-1 min-w-0">
                        <span className="text-yellow-300">&quot;</span>
                        <span className="break-all">{renderWithEmotes(message.message, message.emotes)}</span>
                        <span className="text-yellow-300">&quot;</span>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div
            className={`${className} bg-black/80 border border-gray-700 rounded-xl shadow-lg`}
            style={{ width, height }}
        >
            {/* Terminal header */}
            <div className="bg-gray-800 px-4 py-2 border-b border-gray-700 rounded-t-md">
                <div className="flex items-center gap-2">
                    <div className="flex gap-1.5">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    </div>
                    <span className="text-gray-300 text-sm font-mono ml-4">wiibleyde@stream: twitch-chat</span>
                </div>
            </div>

            {/* Messages */}
            <div className="overflow-y-auto p-2 flex-1 hide-scrollbar" style={{ height: 'calc(100% - 50px)' }}>
                {/* Liste des messages */}
                <div className="font-mono">
                    {[...messages].reverse().map(renderMessage)}
                    <div ref={messagesEndRef} />
                </div>
            </div>
        </div>
    );
};

export default SimpleTwitchChat;
