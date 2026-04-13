export async function verifyCaptchaToken(token: string): Promise<boolean> {
    const secret = process.env.RECAPTCHA_SECRET_KEY;
    if (!secret) {
        console.error('RECAPTCHA_SECRET_KEY is not set');
        return false;
    }

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: new URLSearchParams({ secret, response: token }),
    });

    const data = await res.json();
    return data.success === true && data.score > 0.5;
}
