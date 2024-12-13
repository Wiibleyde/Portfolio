"use client"
import { motion } from 'framer-motion'
import { useTranslations } from 'next-intl'

export default function Loading() {
    const t = useTranslations('Loading')

    return (
        <div className="fixed z-[50] w-full h-screen bg-black left-0 top-0 flex flex-col justify-center items-center">
            <motion.div
                className="fixed z-[60] w-full h-screen bg-background left-0 top-0 flex flex-col justify-center items-center"
                initial={{ opacity: 1 }}
                animate={{ opacity: [1, 0.5, 1] }}
                transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
            >
                <motion.div
                    className="w-16 h-16 border-4 border-t-transparent border-primary rounded-full"
                    initial={{ rotate: 0 }}
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, times: [0, 0.5, 1], ease: ['easeInOut', 'linear', 'easeInOut'] }}
                />
                <motion.div
                    className="mt-4 text-white text-lg"
                    initial={{ opacity: 1 }}
                    animate={{ opacity: [1, 0.5, 1] }}
                    transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
                >
                    {t('loading')}
                </motion.div>
            </motion.div>
        </div>
    )
}
