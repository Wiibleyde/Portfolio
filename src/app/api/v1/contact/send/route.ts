import { webhook } from "@/webhook";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest): Promise<NextResponse> {
    if (!request.body) {
        return NextResponse.json({ message: 'No body provided' }, { status: 400 });
    }

    const body = await request.json();
    const { name, email, message } = body;

    if (!name || !email || !message) {
        return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    webhook.send(name, email, message)

    return NextResponse.json({ message: 'Message sent' });
}