'use client';

import React from 'react';
import SimpleTwitchChat from '@/components/twitch/SimpleTwitchChat';

export default function TwitchChatPage() {
    return (
        <div className="min-h-screen p-0 bg-transparent overflow-hidden">
            <SimpleTwitchChat
                channel="wiibleyde"
                className="max-w-full max-h-full"
                width="100%"
                height="100vh"
            />
        </div>
    );
}