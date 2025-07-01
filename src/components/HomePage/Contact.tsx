"use client"
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { useGoogleReCaptcha } from 'react-google-recaptcha-v3';
import { verifyCaptchaAction } from '@/captcha';

interface FormData {
    name: string;
    email: string;
    subject: string;
    message: string;
}

interface FormErrors {
    name?: string;
    email?: string;
    subject?: string;
    message?: string;
}

export function Contact() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    const { executeRecaptcha } = useGoogleReCaptcha();


    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: ''
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validation
    const validateForm = (): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = 'L\'email est requis';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = 'Format d\'email invalide';
        }

        if (!formData.subject.trim()) {
            newErrors.subject = 'L\'objet est requis';
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Le message est requis';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Le message doit contenir au moins 10 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    // Handle form submission
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        if (!executeRecaptcha) {
            return
        }
        const token = await executeRecaptcha("onSubmit")
        const verified = await verifyCaptchaAction(token)

        if (!verified) {
            setIsSubmitting(false);
            setErrors(prev => ({ ...prev, captcha: 'Vérification CAPTCHA échouée. Veuillez réessayer.' }));
            console.error('CAPTCHA verification failed');
            return
        }


        try {
            // Send to /api/v1/contact/send
            const response = await fetch('/api/v1/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Erreur lors de l\'envoi du message');
            }
            setIsSubmitted(true);
            setFormData({ name: '', email: '', subject: '', message: '' }); // Reset form
            setErrors({}); // Clear errors
        } catch (error) {
            console.error('Error submitting form:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    // Animation on scroll
    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting && !isVisible) {
                        setIsVisible(true);

                        const tl = gsap.timeline({ delay: 0.2 });

                        tl.to(titleRef.current, {
                            opacity: 1,
                            y: 0,
                            duration: 0.8,
                            ease: "power2.out"
                        })
                            .to(formRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: "power2.out"
                            }, "-=0.4");
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => {
            observer.disconnect();
        };
    }, [isVisible]);

    // Set initial state
    useEffect(() => {
        gsap.set([titleRef.current, formRef.current], {
            opacity: 0,
            y: 50
        });
    }, []);

    // Reset success message after 5 seconds
    useEffect(() => {
        if (isSubmitted) {
            const timer = setTimeout(() => {
                setIsSubmitted(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isSubmitted]);

    return (
        <div className="snap-start min-h-screen relative bg-gradient-to-br from-slate-900 via-blue-900/20 to-purple-900/30 py-12" id="contact">
            {/* Background pattern */}
            <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #3b82f6 0%, transparent 50%), 
                                     radial-gradient(circle at 75% 75%, #8b5cf6 0%, transparent 50%)`
                }}></div>
            </div>

            <div ref={containerRef} className="relative z-10 px-10 max-w-4xl mx-auto">
                {/* Title Section */}
                <div ref={titleRef} className="text-center mb-8">
                    <h2 className="text-3xl md:text-4xl font-bold text-white mb-3">
                        Contactez-moi
                    </h2>
                    <div className="w-20 h-1 bg-gradient-to-r from-blue-500 to-purple-600 mx-auto rounded-full mb-3"></div>
                    <p className="text-gray-300 text-lg">
                        Une idée, un projet, une question ? N&apos;hésitez pas à me contacter !
                    </p>
                </div>

                {/* Form Section */}
                <div className="bg-gradient-to-br from-white/10 via-white/8 to-white/5 backdrop-blur-md rounded-3xl p-6 md:p-8 border border-white/20 shadow-2xl">
                    {isSubmitted ? (
                        <div className="text-center py-8">
                            <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                                <svg className="w-8 h-8 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">Message envoyé !</h3>
                            <p className="text-gray-300">Je vous répondrai dans les plus brefs délais.</p>
                        </div>
                    ) : (
                        <form ref={formRef} onSubmit={handleSubmit} className="space-y-5">
                            {/* Name Field */}
                            <div>
                                <label htmlFor="name" className="block text-sm font-medium text-gray-200 mb-2">
                                    NOM & Prénom *
                                </label>
                                <input
                                    type="text"
                                    id="name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-white/10 border ${errors.name ? 'border-red-400' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors`}
                                    placeholder="Votre nom complet"
                                />
                                {errors.name && (
                                    <p className="mt-1 text-sm text-red-400">{errors.name}</p>
                                )}
                            </div>

                            {/* Email Field */}
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-200 mb-2">
                                    Email *
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-white/10 border ${errors.email ? 'border-red-400' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors`}
                                    placeholder="votre.email@exemple.com"
                                />
                                {errors.email && (
                                    <p className="mt-1 text-sm text-red-400">{errors.email}</p>
                                )}
                            </div>

                            {/* Subject Field */}
                            <div>
                                <label htmlFor="subject" className="block text-sm font-medium text-gray-200 mb-2">
                                    Objet *
                                </label>
                                <input
                                    type="text"
                                    id="subject"
                                    name="subject"
                                    value={formData.subject}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-white/10 border ${errors.subject ? 'border-red-400' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors`}
                                    placeholder="Sujet de votre message"
                                />
                                {errors.subject && (
                                    <p className="mt-1 text-sm text-red-400">{errors.subject}</p>
                                )}
                            </div>

                            {/* Message Field */}
                            <div>
                                <label htmlFor="message" className="block text-sm font-medium text-gray-200 mb-2">
                                    Message *
                                </label>
                                <textarea
                                    id="message"
                                    name="message"
                                    rows={5}
                                    value={formData.message}
                                    onChange={handleChange}
                                    className={`w-full px-4 py-3 bg-white/10 border ${errors.message ? 'border-red-400' : 'border-white/20'} rounded-xl text-white placeholder-gray-400 focus:outline-none focus:border-blue-400 focus:ring-1 focus:ring-blue-400 transition-colors resize-none`}
                                    placeholder="Décrivez votre projet ou votre demande..."
                                />
                                {errors.message && (
                                    <p className="mt-1 text-sm text-red-400">{errors.message}</p>
                                )}
                            </div>

                            {/* Submit Button */}
                            <div className="flex justify-center pt-2">
                                <button
                                    type="submit"
                                    disabled={isSubmitting}
                                    aria-label="Envoyer le message"
                                    className="group relative bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 disabled:from-gray-600 disabled:to-gray-700 text-white font-semibold py-3 px-6 rounded-2xl transition-all duration-300 flex items-center gap-3 shadow-xl hover:shadow-blue-500/25 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 rounded-2xl blur opacity-0 group-hover:opacity-30 transition-opacity duration-300"></div>

                                    {isSubmitting ? (
                                        <>
                                            <svg className="w-5 h-5 relative z-10 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            <span className="relative z-10">Envoi en cours...</span>
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-5 h-5 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                            </svg>
                                            <span className="relative z-10">Envoyer le message</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
}