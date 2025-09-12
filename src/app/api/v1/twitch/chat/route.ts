import { NextRequest, NextResponse } from 'next/server';
import WebSocket from 'ws';

interface ChatMessage {
    id: string;
    username: string;
    displayName: string;
    message: string;
    timestamp: string;
    badges?: string[];
    color?: string;
}

interface ChatResponse {
    messages: ChatMessage[];
    isConnected: boolean;
    error?: string;
}

interface WebSocketMessage {
    metadata: {
        message_type: string;
        subscription_type?: string;
    };
    payload: {
        session?: {
            id: string;
        };
        event?: {
            broadcaster_user_login: string;
            chatter_user_login: string;
            chatter_user_name: string;
            message: {
                text: string;
            };
            message_id: string;
            color?: string;
            badges?: Array<{
                set_id: string;
                id: string;
                info: string;
            }>;
        };
    };
}

// Configuration
const EVENTSUB_WEBSOCKET_URL = 'wss://eventsub.wss.twitch.tv/ws';
const CHAT_CHANNEL_USERNAME = 'wiibleyde'; // Username du canal à écouter

// Cache pour les messages en mémoire
let chatMessages: ChatMessage[] = [];
let websocketClient: WebSocket | null = null;
let websocketSessionID: string | null = null;
let isConnected = false;
const MAX_MESSAGES = 50; // Limite du nombre de messages en cache

async function validateToken(token: string): Promise<boolean> {
    try {
        const response = await fetch('https://id.twitch.tv/oauth2/validate', {
            method: 'GET',
            headers: {
                Authorization: 'OAuth ' + token,
            },
        });
        return response.status === 200;
    } catch (error) {
        console.error('Error validating token:', error);
        return false;
    }
}

async function getUserId(username: string, clientId: string, token: string): Promise<string | null> {
    try {
        const response = await fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
            headers: {
                Authorization: 'Bearer ' + token,
                'Client-Id': clientId,
            },
        });

        if (response.ok) {
            const data = await response.json();
            return data.data[0]?.id || null;
        }
        return null;
    } catch (error) {
        console.error('Error getting user ID:', error);
        return null;
    }
}

function handleWebSocketMessage(data: WebSocketMessage) {
    switch (data.metadata.message_type) {
        case 'session_welcome':
            websocketSessionID = data.payload.session?.id || null;
            if (websocketSessionID) {
                registerEventSubListeners();
            }
            break;
        case 'notification':
            if (data.metadata.subscription_type === 'channel.chat.message' && data.payload.event) {
                const event = data.payload.event;
                const newMessage: ChatMessage = {
                    id: event.message_id,
                    username: event.chatter_user_login,
                    displayName: event.chatter_user_name,
                    message: event.message.text,
                    timestamp: new Date().toISOString(),
                    color: event.color,
                    badges: event.badges?.map((badge) => badge.set_id) || [],
                };

                // Ajouter le message au cache
                chatMessages.unshift(newMessage);

                // Limiter le nombre de messages
                if (chatMessages.length > MAX_MESSAGES) {
                    chatMessages = chatMessages.slice(0, MAX_MESSAGES);
                }

                console.log(`Chat message: <${event.chatter_user_login}> ${event.message.text}`);
            }
            break;
    }
}

async function registerEventSubListeners() {
    const oauthToken = process.env.TWITCH_OAUTH_TOKEN;
    const clientId = process.env.TWITCH_CLIENT_ID;
    const botUserId = process.env.TWITCH_BOT_USER_ID;

    if (!oauthToken || !clientId || !botUserId || !websocketSessionID) {
        console.error('Missing configuration for EventSub registration');
        return;
    }

    // Obtenir l'ID du canal
    const channelUserId = await getUserId(CHAT_CHANNEL_USERNAME, clientId, oauthToken);
    if (!channelUserId) {
        console.error('Could not get channel user ID');
        return;
    }

    try {
        const response = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + oauthToken,
                'Client-Id': clientId,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                type: 'channel.chat.message',
                version: '1',
                condition: {
                    broadcaster_user_id: channelUserId,
                    user_id: botUserId,
                },
                transport: {
                    method: 'websocket',
                    session_id: websocketSessionID,
                },
            }),
        });

        if (response.status === 202) {
            const data = await response.json();
            console.log(`Subscribed to channel.chat.message [${data.data[0].id}]`);
            isConnected = true;
        } else {
            const data = await response.json();
            console.error('Failed to subscribe to channel.chat.message. Status:', response.status);
            console.error(data);
        }
    } catch (error) {
        console.error('Error registering EventSub listeners:', error);
    }
}

function startWebSocketClient(): WebSocket | null {
    try {
        const client = new WebSocket(EVENTSUB_WEBSOCKET_URL);

        client.on('error', (error: Error) => {
            console.error('WebSocket error:', error);
            isConnected = false;
        });

        client.on('open', () => {
            console.log('WebSocket connection opened to ' + EVENTSUB_WEBSOCKET_URL);
        });

        client.on('message', (data: WebSocket.Data) => {
            try {
                const parsedData = JSON.parse(data.toString()) as WebSocketMessage;
                handleWebSocketMessage(parsedData);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        });

        client.on('close', () => {
            console.log('WebSocket connection closed');
            isConnected = false;
            websocketClient = null;
            websocketSessionID = null;
        });

        return client;
    } catch (error) {
        console.error('Error creating WebSocket client:', error);
        return null;
    }
}

async function initializeChatConnection(): Promise<boolean> {
    const oauthToken = process.env.TWITCH_OAUTH_TOKEN;
    const clientId = process.env.TWITCH_CLIENT_ID;
    const botUserId = process.env.TWITCH_BOT_USER_ID;

    if (!oauthToken || !clientId || !botUserId) {
        console.error('Missing Twitch configuration for chat');
        return false;
    }

    // Valider le token
    const isTokenValid = await validateToken(oauthToken);
    if (!isTokenValid) {
        console.error('Invalid Twitch OAuth token');
        return false;
    }

    // Démarrer la connexion WebSocket si elle n'existe pas
    if (!websocketClient || websocketClient.readyState !== WebSocket.OPEN) {
        websocketClient = startWebSocketClient();
        return websocketClient !== null;
    }

    return true;
}

export async function GET(): Promise<NextResponse> {
    try {
        // Initialiser la connexion si nécessaire
        if (!isConnected && (!websocketClient || websocketClient.readyState !== WebSocket.OPEN)) {
            await initializeChatConnection();
        }

        const response: ChatResponse = {
            messages: chatMessages,
            isConnected: isConnected && websocketClient?.readyState === WebSocket.OPEN,
        };

        return NextResponse.json(response);
    } catch (error) {
        console.error('Error in chat API:', error);
        const errorResponse: ChatResponse = {
            messages: [],
            isConnected: false,
            error: 'Failed to fetch chat data',
        };
        return NextResponse.json(errorResponse, { status: 500 });
    }
}

// Endpoint pour envoyer un message (optionnel)
export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const { message } = await request.json();

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const oauthToken = process.env.TWITCH_OAUTH_TOKEN;
        const clientId = process.env.TWITCH_CLIENT_ID;
        const botUserId = process.env.TWITCH_BOT_USER_ID;

        if (!oauthToken || !clientId || !botUserId) {
            return NextResponse.json({ error: 'Chat configuration missing' }, { status: 500 });
        }

        // Obtenir l'ID du canal
        const channelUserId = await getUserId(CHAT_CHANNEL_USERNAME, clientId, oauthToken);
        if (!channelUserId) {
            return NextResponse.json({ error: 'Could not get channel user ID' }, { status: 500 });
        }

        const response = await fetch('https://api.twitch.tv/helix/chat/messages', {
            method: 'POST',
            headers: {
                Authorization: 'Bearer ' + oauthToken,
                'Client-Id': clientId,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                broadcaster_id: channelUserId,
                sender_id: botUserId,
                message: message,
            }),
        });

        if (response.ok) {
            return NextResponse.json({ success: true, message: 'Message sent' });
        } else {
            const data = await response.json();
            console.error('Failed to send chat message:', data);
            return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error sending chat message:', error);
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}
