'use client';

import './SimpleTwitchChatScrollbar.css';

import React, { useRef, useEffect } from 'react';
import { useTwitchChatClient, ChatMessage } from '@/hooks/useTwitchChatClient';
import Image from 'next/image';
import TerminalHeaderPanel from './TerminalHeaderPanel';

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

    // Fonction pour remplacer les emotes dans le texte par des images
    const renderWithEmotes = (text: string, emotes?: { id: string; positions: [number, number][] }[]) => {
        if (!emotes || emotes.length === 0) return text;
        const segments: Array<{ type: 'text' | 'emote'; content: string; emoteId?: string }> = [];
        let lastIndex = 0;
        const allPositions: Array<{ start: number; end: number; emoteId: string }> = [];
        emotes.forEach((emote) => {
            emote.positions.forEach(([start, end]) => {
                allPositions.push({ start, end, emoteId: emote.id });
            });
        });
        allPositions.sort((a, b) => a.start - b.start);
        allPositions.forEach(({ start, end, emoteId }) => {
            if (start > lastIndex) {
                segments.push({
                    type: 'text',
                    content: text.slice(lastIndex, start),
                });
            }
            segments.push({
                type: 'emote',
                content: text.slice(start, end + 1),
                emoteId,
            });
            lastIndex = end + 1;
        });
        if (lastIndex < text.length) {
            segments.push({
                type: 'text',
                content: text.slice(lastIndex),
            });
        }
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
                                className="inline w-7 h-7 align-middle"
                                width={32}
                                height={32}
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

    // Affichage façon log journalctl
    const renderLogMessage = (message: ChatMessage) => {
        // Format date façon log
        const date = new Date(message.timestamp || Date.now());
        const formattedDate = date.toISOString().replace('T', ' ').replace('Z', '');
        // Niveau de log selon badge
        let level = 'INFO';
        if (message.badges?.includes('broadcaster')) level = 'STREAMER';
        else if (message.badges?.includes('moderator')) level = 'MOD';
        else if (message.badges?.includes('vip')) level = 'VIP';
        else if (message.badges?.includes('subscriber')) level = 'SUB';
        else if (message.badges?.includes('artist-badge')) level = 'ARTIST';
        else level = 'VIEWER';
        // Couleur du niveau
        const levelColor = {
            'STREAMER': 'text-red-500',
            'MOD': 'text-green-400',
            'VIP': 'text-yellow-500',
            'SUB': 'text-blue-400',
            'VIEWER': 'text-gray-400',
            'ARTIST': 'text-purple-400',
        }[level];
        return (
            <div key={message.id} className="mb-1 px-2 py-1 rounded flex flex-row gap-2 items-center">
                <span className="text-gray-400 font-mono text-base">{formattedDate}</span>
                <span className={`font-mono text-base font-bold ${levelColor}`}>{level}</span>
                <span className="text-green-400 font-mono text-base">{(message.displayName || message.username).toLowerCase()}</span>
                <span className="text-gray-400 font-mono text-base">:</span>
                <span className="text-gray-200 font-mono text-base break-all">{renderWithEmotes(message.message, message.emotes)}</span>
            </div>
        );
    };

    return (
        <TerminalHeaderPanel
            title="wiibleyde@stream: twitch-chat"
            className={className}
            style={{ width, height }}
        >
            <div className="flex flex-col h-full">
                {/* Ligne d'exécution de la commande journalctl */}
                <div
                    className="bg-black/60 px-2 py-1 font-mono text-base text-gray-300 border-b border-gray-700 flex items-center gap-2 flex-shrink-0"
                    style={{ height: '40px', overflow: 'hidden' }}
                >
                    <span className="text-green-400">wiibleyde@stream</span>
                    <span className="text-white">$</span>
                    <span className="text-blue-400">journalctl -f</span>
                </div>
                <div
                    className="overflow-y-auto p-2 flex-1 hide-scrollbar"
                    style={{ minHeight: 0 }}
                >
                    <div className="font-mono">
                        {[...messages].reverse().map(renderLogMessage)}
                        <div ref={messagesEndRef} />
                    </div>
                </div>
            </div>
        </TerminalHeaderPanel>
    );
};

export default SimpleTwitchChat;
