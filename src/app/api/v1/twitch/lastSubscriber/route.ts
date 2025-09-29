import { NextRequest, NextResponse } from 'next/server';

interface LastSubscriber {
    username: string;
    timestamp: string;
}

// Stockage en mémoire simple (en production, utilisez une vraie base de données)
let lastSubscriberData: LastSubscriber | null = null;

export async function GET(): Promise<NextResponse> {
    return NextResponse.json({
        lastSubscriber: lastSubscriberData,
    });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
    try {
        const body = await request.json();
        const { username, timestamp } = body;

        if (!username || !timestamp) {
            return NextResponse.json(
                { error: 'Missing username or timestamp' },
                { status: 400 }
            );
        }

        lastSubscriberData = {
            username,
            timestamp,
        };

        console.log('New subscriber recorded:', lastSubscriberData);

        return NextResponse.json({
            success: true,
            lastSubscriber: lastSubscriberData,
        });
    } catch (error) {
        console.error('Error updating last subscriber:', error);
        return NextResponse.json(
            { error: 'Failed to update last subscriber' },
            { status: 500 }
        );
    }
}