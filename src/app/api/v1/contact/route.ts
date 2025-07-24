import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (!request.body) {
        return NextResponse.json({ message: 'No body provided' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !subject || !message) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    const username = process.env.NEXT_PUBLIC_BURNER_USERNAME;
    // Remplace : "||" by "$" because of the way the password is stored in the environment variable
    const password = process.env.BURNER_PASSWORD?.replace(/\|\|/g, '$');
    const myEmail = process.env.NEXT_PUBLIC_PERSONAL_EMAIL;

    const transporter = nodemailer.createTransport({
        host: 'ssl0.ovh.net',
        port: 587,
        secure: false,
        authMethod: 'LOGIN',
        auth: {
            user: username,
            pass: password,
        },
    });

    try {
        const data = {
            name: name,
            from: email,
            subject: subject,
            message: message,
        };

        await transporter.sendMail({
            from: username,
            to: myEmail,
            replyTo: data.from,
            subject: 'Portfolio : ' + data.subject,
            text: data.message,
        });
    } catch (error) {
        console.error('Error sending email:', error);
        return NextResponse.json({ message: 'Error sending message' }, { status: 500 });
    }

    return NextResponse.json({ message: 'Message sent' });
}
