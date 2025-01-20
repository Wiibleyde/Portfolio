"use client"
import { useTranslations } from "next-intl";
import { useEffect, useState } from "react";

export function NextBirthday({ birthdate }: { birthdate: Date }) {
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
    const nextBirthday = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());
    if (today > nextBirthday) {
        nextBirthday.setFullYear(nextBirthday.getFullYear() + 1);
    }
    const diff = nextBirthday.getTime() - time.getTime();
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);

    const nextAge = nextBirthday.getFullYear() - birthdate.getFullYear();

    const startOfYear = new Date(today.getFullYear(), birthdate.getMonth(), birthdate.getDate());
    if (today > startOfYear) {
        startOfYear.setFullYear(startOfYear.getFullYear() - 1);
    }
    const totalDiff = 365 * 24 * 60 * 60 * 1000; // Total milliseconds in a year
    const progress = ((totalDiff - diff) / totalDiff) * 100;

    return (
        <div className='flex flex-col'>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700 my-2">
                <div className="bg-green-500 h-2.5 rounded-full transition-all duration-100" style={{ width: `${progress}%` }}></div>
            </div>
            <span className="text-xs text-gray-700 dark:text-gray-300">{progress.toFixed(5)}% {t('until')} {nextAge} {t('yearsOnly')}</span>
            <span className="text-gray-300 text-sm my-2 transition-all duration-500">{days}{t('days')} {hours}{t('hours')} {minutes}{t('minutes')} {seconds}{t('seconds')}</span>
        </div>
    );
}