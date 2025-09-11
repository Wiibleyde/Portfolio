'use client';

import { useState, useEffect, useCallback, useRef } from 'react';

export interface ChatMessage {
    id: string;
    username: string;
    displayName: string;
    message: string;
    timestamp: string;
    badges?: string[];
    color?: string;
    emotes?: { id: string; positions: [number, number][] }[];
}

interface UseTwitchChatClientOptions {
    channel: string;
    maxMessages?: number;
    autoConnect?: boolean;
}

interface UseTwitchChatClientReturn {
    messages: ChatMessage[];
    isConnected: boolean;
    isConnecting: boolean;
    error: string | null;
    connect: () => void;
    disconnect: () => void;
    clearMessages: () => void;
}

export function useTwitchChatClient(options: UseTwitchChatClientOptions): UseTwitchChatClientReturn {
    const { channel, maxMessages = 50, autoConnect = true } = options;
    
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [isConnected, setIsConnected] = useState(false);
    const [isConnecting, setIsConnecting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const wsRef = useRef<WebSocket | null>(null);


    const parseIrcMessage = useCallback((rawMessage: string): ChatMessage | null => {
        // Vérifier que c'est bien un message PRIVMSG
        if (!rawMessage.includes('PRIVMSG')) return null;

        console.log('Raw IRC message:', rawMessage); // Debug

        // Nettoyer le message des caractères de fin de ligne
        const cleanMessage = rawMessage.trim();

        // Format IRC Twitch: @badge-info=...;badges=...;color=...;display-name=...;emotes=... :username!username@username.tmi.twitch.tv PRIVMSG #channel :message text

        // Extraire les tags (partie avant " :username")
        const tagsMatch = cleanMessage.match(/^@([^]+?)\s:/);
        const tags: Record<string, string> = {};

        if (tagsMatch) {
            const tagString = tagsMatch[1].trim(); // Enlever les espaces
            console.log('Raw tag string:', tagString); // Debug
            tagString.split(';').forEach(tag => {
                const equalIndex = tag.indexOf('=');
                if (equalIndex !== -1) {
                    const key = tag.substring(0, equalIndex);
                    const value = tag.substring(equalIndex + 1);
                    if (key && value !== undefined) {
                        tags[key] = value;
                    }
                }
            });
        }

        // Extraire le nom d'utilisateur (après l'espace et les deux points)
        const userMatch = cleanMessage.match(/\s:(\w+)!\w+@\w+\.tmi\.twitch\.tv/);
        if (!userMatch) {
            return null;
        }

        // Approche plus simple pour le message : chercher PRIVMSG #channel : et prendre tout ce qui suit
        const privmsgIndex = cleanMessage.indexOf('PRIVMSG #');
        if (privmsgIndex === -1) {
            return null;
        }

        const afterPrivmsg = cleanMessage.substring(privmsgIndex);
        const colonIndex = afterPrivmsg.indexOf(' :');
        if (colonIndex === -1) {
            return null;
        }

        const message = afterPrivmsg.substring(colonIndex + 2); // +2 pour passer " :"

        if (!message) {
            return null;
        }

        const username = userMatch[1];
        const displayName = tags['display-name'] || username;
        const color = tags.color && tags.color !== '' ? tags.color : '#8A2BE2';
        const id = tags.id || `${Date.now()}-${Math.random()}`;

        // Parser les badges
        const badges: string[] = [];
        if (tags.badges && tags.badges !== '') {
            badges.push(...tags.badges.split(',').map(badge => badge.split('/')[0]).filter(Boolean));
        }

        // Parser les emotes
        let emotes: { id: string; positions: [number, number][] }[] = [];
        if (tags.emotes && tags.emotes !== '') {
            // Format: emote_id:start-end[,start-end]/emote_id2:start-end
            console.log('Tag emotes:', tags.emotes, 'Message:', message);
            console.log('Full tags object:', tags); // Debug supplémentaire
            emotes = tags.emotes.split('/').map(emote => {
                // Certains emotes n'ont pas de positions, on ignore
                if (!emote.includes(':')) return null;
                const [emoteId, positionsStr] = emote.split(':');
                if (!emoteId || !positionsStr) return null;
                // positionsStr peut contenir plusieurs positions séparées par des virgules
                const positions = positionsStr.split(',').map(pos => {
                    const [start, end] = pos.trim().split('-').map(Number);
                    if (isNaN(start) || isNaN(end)) return null;
                    return [start, end] as [number, number];
                }).filter(p => p !== null) as [number, number][];
                // Accepte les ids alphanumériques (emotesv2_...)
                return { id: emoteId.trim(), positions };
            }).filter(e => e !== null && e.positions.length > 0) as { id: string; positions: [number, number][] }[];
            console.log('Parsed emotes:', emotes);
        }

        //console.log('Parsed message:', { username, displayName, message, color, badges, emotes }); // Debug

        return {
            id,
            username,
            displayName,
            message,
            timestamp: new Date().toISOString(),
            badges,
            color: color || '#8A2BE2',
            emotes
        };
    }, []);

    const connect = useCallback(() => {
        if (wsRef.current?.readyState === WebSocket.OPEN) return;
        
        setIsConnecting(true);
        setError(null);

        try {
            const ws = new WebSocket('wss://irc-ws.chat.twitch.tv:443');
            wsRef.current = ws;

            ws.onopen = () => {
                console.log('Connected to Twitch IRC');
                // Connexion anonyme au chat Twitch
                ws.send('PASS SCHMOOPIIE'); // Mot de passe anonyme
                ws.send('NICK justinfan12345'); // Nom d'utilisateur anonyme
                ws.send(`JOIN #${channel.toLowerCase()}`);
                ws.send('CAP REQ :twitch.tv/tags'); // Demander les métadonnées (badges, couleurs, etc.)
            };

            ws.onmessage = (event) => {
                const rawMessage = event.data;
                
                // Répondre aux pings pour maintenir la connexion
                if (rawMessage.startsWith('PING')) {
                    ws.send('PONG :tmi.twitch.tv');
                    return;
                }

                // Confirmer la connexion
                if (rawMessage.includes('001')) {
                    setIsConnected(true);
                    setIsConnecting(false);
                    setError(null);
                    console.log(`Joined channel #${channel}`);
                    return;
                }

                // Parser les messages de chat
                if (rawMessage.includes('PRIVMSG')) {
                    const parsedMessage = parseIrcMessage(rawMessage);
                    if (parsedMessage) {
                        setMessages(prev => {
                            const newMessages = [parsedMessage, ...prev];
                            return newMessages.slice(0, maxMessages);
                        });
                    } else {
                        console.log('Failed to parse message');
                    }
                }
            };

            ws.onclose = () => {
                console.log('Disconnected from Twitch IRC');
                setIsConnected(false);
                setIsConnecting(false);
                wsRef.current = null;
            };

            ws.onerror = (error) => {
                console.error('WebSocket error:', error);
                setError('Erreur de connexion au chat');
                setIsConnecting(false);
                setIsConnected(false);
            };

        } catch (err) {
            console.error('Failed to connect:', err);
            setError('Impossible de se connecter au chat');
            setIsConnecting(false);
        }
    }, [channel, maxMessages, parseIrcMessage]);

    const disconnect = useCallback(() => {
        if (wsRef.current) {
            wsRef.current.close();
            wsRef.current = null;
        }
        setIsConnected(false);
        setIsConnecting(false);
    }, []);

    const clearMessages = useCallback(() => {
        setMessages([]);
    }, []);

    useEffect(() => {
        if (autoConnect) {
            connect();
        }

        return () => {
            disconnect();
        };
    }, [autoConnect, connect, disconnect]);

    return {
        messages,
        isConnected,
        isConnecting,
        error,
        connect,
        disconnect,
        clearMessages
    };
}