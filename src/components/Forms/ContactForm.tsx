"use client"
import { useTranslations } from "next-intl";
import { useState } from "react";

export function ContactForm() {
    const t = useTranslations('ContactForm');
    const [sent, setSent] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const target = e.target;
        if (target.name === 'name') {
            setName(target.value);
        } else if (target.name === 'email') {
            setEmail(target.value);
        } else if (target.name === 'message') {
            setMessage(target.value);
        }
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setSent(false);
        setError('');
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        const response = await fetch('/api/v1/contact/send', {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (response.ok) {
            setSent(true);
            setSending(false);
            setName('');
            setEmail('');
            setMessage('');
        } else {
            const error = await response.json();
            setError(error.message);
            setSending(false);
        }
    }

    const handleInput = (e: React.FormEvent<HTMLTextAreaElement>) => {
        const target = e.currentTarget;
        target.style.height = 'auto';
        target.style.height = `${target.scrollHeight + 10}px`;
    }

    return (
        <form className='flex flex-col space-y-4 w-1/2' onSubmit={handleSubmit}>
            <label htmlFor='name' className='text-2xl font-bold'>{t('name')}</label>
            <input type='text' id='name' name='name' className='p-2 border-2 border-gray-800 text-black rounded-lg' onChange={handleChange} value={name} />
            <label htmlFor='email' className='text-2xl font-bold'>{t('email')}</label>
            <input type='email' id='email' name='email' className='p-2 border-2 border-gray-800 text-black rounded-lg' onChange={handleChange} value={email} />
            <label htmlFor='message' className='text-2xl font-bold'>{t('message')}</label>
            <textarea id='message' name='message' className='p-2 border-2 border-gray-800 text-black rounded-lg' onInput={handleInput} onChange={handleChange} value={message} />
            <button className='bg-red-600 text-white p-2 rounded-md'>{t('submit')}</button>
            {sending && <p className="text-red-600">{t('sending')}</p>}
            {sent && <p className="text-green-600">{t('sent')}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </form>
    )
}