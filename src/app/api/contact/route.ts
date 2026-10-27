import { type NextRequest, NextResponse } from 'next/server';

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

const RATE_LIMIT = 5;
const RATE_WINDOW_MS = 10 * 60 * 1000;
// shortcut: in-memory, per server instance; move to a shared store (Redis…) if the site ever runs on several instances
const recentSubmissions = new Map<string, number[]>();

function isRateLimited(ip: string, now = Date.now()): boolean {
    const recent = (recentSubmissions.get(ip) ?? []).filter((time) => now - time < RATE_WINDOW_MS);
    if (recent.length >= RATE_LIMIT) {
        recentSubmissions.set(ip, recent);
        return true;
    }
    recent.push(now);
    recentSubmissions.set(ip, recent);
    return false;
}

// Discord rejects embeds above these limits
const truncate = (value: string, max: number) => (value.length > max ? `${value.slice(0, max - 1)}…` : value);

export async function POST(request: NextRequest): Promise<NextResponse> {
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== 'object') {
        return NextResponse.json({ message: 'Invalid body' }, { status: 400 });
    }

    const name = asText(body.name);
    const email = asText(body.email);
    const subject = asText(body.subject);
    const message = asText(body.message);

    // honeypot: hidden field only bots fill in; pretend success so they don't retry
    if (asText(body.website)) {
        return NextResponse.json({ message: 'Message sent' });
    }

    if (!name || !email || !subject || !message) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (message.length > 4000) {
        return NextResponse.json({ message: 'Message too long' }, { status: 400 });
    }

    const ip = request.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
    if (isRateLimited(ip)) {
        return NextResponse.json({ message: 'Too many requests' }, { status: 429 });
    }

    const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
    if (!webhookUrl) {
        console.error('DISCORD_WEBHOOK_URL is not set');
        return NextResponse.json({ message: 'Server misconfiguration' }, { status: 500 });
    }

    const payload = {
        allowed_mentions: { parse: [] },
        embeds: [
            {
                title: truncate(`📬 ${subject}`, 256),
                color: 0x5865f2,
                fields: [
                    {
                        name: '👤 Name',
                        value: truncate(name, 1024),
                        inline: true,
                    },
                    {
                        name: '📧 Email',
                        value: truncate(email, 1024),
                        inline: true,
                    },
                ],
                description: message,
                footer: {
                    text: 'Portfolio Contact Form',
                },
                timestamp: new Date().toISOString(),
            },
        ],
    };

    try {
        const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
        });

        if (!response.ok) {
            console.error('Discord webhook error:', response.status, await response.text());
            return NextResponse.json({ message: 'Error sending message' }, { status: 500 });
        }
    } catch (error) {
        console.error('Error sending Discord webhook:', error);
        return NextResponse.json({ message: 'Error sending message' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent' });
}
