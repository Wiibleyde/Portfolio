import { type NextRequest, NextResponse } from 'next/server';
import { verifyCaptchaToken } from '@/captcha';

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (!request.body) {
        return NextResponse.json({ message: 'No body provided' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, subject, message, captchaToken } = body;

    if (!name || !email || !subject || !message) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
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
        embeds: [
            {
                title: `📬 ${subject}`,
                color: 0x5865f2,
                fields: [
                    {
                        name: '👤 Name',
                        value: name,
                        inline: true,
                    },
                    {
                        name: '📧 Email',
                        value: email,
                        inline: true,
                    },
                    {
                        name: '💬 Message',
                        value: message,
                    },
                ],
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
