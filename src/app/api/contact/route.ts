import { type NextRequest, NextResponse } from 'next/server';
import { verifyCaptchaToken } from '@/captcha';

const asText = (value: unknown) => (typeof value === 'string' ? value.trim() : '');

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
    const captchaToken = asText(body.captchaToken);

    if (!name || !email || !subject || !message) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    if (message.length > 4000) {
        return NextResponse.json({ message: 'Message too long' }, { status: 400 });
    }

    if (!captchaToken || !(await verifyCaptchaToken(captchaToken))) {
        return NextResponse.json({ message: 'CAPTCHA verification failed' }, { status: 403 });
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
