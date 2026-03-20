'use server';

export async function verifyCaptchaAction(token: string) {
    const res = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
        {
            method: 'POST',
        },
    );
    const data = await res.json();
    return data.score > 0.5;
}
