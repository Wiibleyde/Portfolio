"use client"
import { useTranslations } from "next-intl";
import { useState } from "react";
import { motion } from "framer-motion";

export function ContactForm() {
    const t = useTranslations('ContactForm');
    const [sent, setSent] = useState<boolean>(false);
    const [sending, setSending] = useState<boolean>(false);
    const [error, setError] = useState<string>('');

    const [name, setName] = useState<string>('');
    const [email, setEmail] = useState<string>('');
    const [message, setMessage] = useState<string>('');


    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setName(e.target.value);
    }
    const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setEmail(e.target.value);
    }
    const handleMessageChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setMessage(e.target.value);
    }

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setSending(true);
        setSent(false);
        setError('');
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());
        if (!data.name || !data.email || !data.message) {
            setError(t('error'));
            setSending(false);
            return;
        }
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
        <motion.form
            className='flex flex-col space-y-6 w-full max-w-lg mx-auto p-6 rounded-lg shadow-lg'
            onSubmit={handleSubmit}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
        >
            <motion.input
                type='text'
                id='name'
                name='name'
                className='bg-transparent p-4 border-b-2 border-gray-500 text-white outline-none focus:border-red-500 hover:border-red-500 transition-all duration-300'
                placeholder={t('name')}
                onChange={handleNameChange}
                value={name}
                whileFocus={{ scale: 1.05 }}
                whileHover={{ scale: 1.05 }}
                required
            />
            <motion.input
                type='email'
                id='email'
                name='email'
                className='bg-transparent p-4 border-b-2 border-gray-500 text-white outline-none focus:border-red-500 hover:border-red-500 transition-all duration-300'
                placeholder={t('email')}
                onChange={handleEmailChange}
                value={email}
                whileFocus={{ scale: 1.05 }}
                whileHover={{ scale: 1.05 }}
                required
            />
            <motion.textarea
                id='message'
                name='message'
                className='bg-transparent p-4 border-2 border-gray-500 text-white rounded-lg outline-none focus:border-red-500 hover:border-red-500 transition-all duration-300'
                onInput={handleInput}
                onChange={handleMessageChange}
                value={message}
                placeholder={t('message')}
                whileFocus={{ scale: 1.05 }}
                whileHover={{ scale: 1.05 }}
                required
            />
            <motion.button
                className='bg-red-500 text-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-300'
                whileHover={{ scale: 1.05 }}
                name='submit'
            >
                {t('submit')}
            </motion.button>
            {sending && <p className="text-red-600">{t('sending')}</p>}
            {sent && <p className="text-green-600">{t('sent')}</p>}
            {error && <p className="text-red-600">{error}</p>}
        </motion.form>
    )
}