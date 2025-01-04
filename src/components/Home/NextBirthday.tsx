"use client"
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function NextBirthday({ bithdate }: { bithdate: Date }) {
    const t = useTranslations('NextBirthday');

    const [time, setTime] = useState(new Date());
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        const interval = setInterval(() => {
            setTime(new Date());
        }, 1000);
        return () => clearInterval(interval);
    }, []);

    if (!mounted) {
        return null;
    }

    const today = new Date();
    const nextBirthday = new Date(today.getFullYear(), bithdate.getMonth(), bithdate.getDate());
    if (today > nextBirthday) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const diff = nextBirthday.getTime() - time.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const nextAge = nextBirthday.getFullYear() - bithdate.getFullYear();

    return (
        <div className='flex flex-col'>
            <span>{nextAge} {t('years')}</span>
            <span className="text-gray-300 text-sm">{days}{t('days')} {hours}{t('hours')} {minutes}{t('minutes')} {seconds}{t('seconds')}</span>
        </div>
    );
}