'use server';

export async function verifyCaptchaAction(token: string) {
    const res = await fetch(
        `https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`,
        {
            method: 'POST',
        }
    );
    const data = await res.json();
    console.log(data);
    if (data.score > 0.5) {
        return true;
    } else {
        return false;
    }
}
