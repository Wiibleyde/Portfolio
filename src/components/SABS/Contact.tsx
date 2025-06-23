"use client";
import { Be_Vietnam_Pro } from "next/font/google";
import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

const BeVietnam = Be_Vietnam_Pro({
    subsets: ["latin"],
    weight: ["400", "500", "600", "700"],
});

interface FormData {
    nom: string;
    prenom: string;
    email: string;
    typeEvent: string;
    objet: string;
    message: string;
}

export function Contact() {
    const containerRef = useRef<HTMLDivElement>(null);
    const titleRef = useRef<HTMLHeadingElement>(null);
    const dividerRef = useRef<HTMLDivElement>(null);
    const formRef = useRef<HTMLFormElement>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');

    const [formData, setFormData] = useState<FormData>({
        nom: '',
        prenom: '',
        email: '',
        typeEvent: '',
        objet: '',
        message: ''
    });

    const eventTypes = [
        'Concert',
        'Podcast',
        'Émission',
        'Événement sportif',
        'Conférence',
        // 'Mariage',
        'Événement corporate',
        'Festival',
        // 'Théâtre',
        'Autre'
    ];

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
                            .to(dividerRef.current, {
                                opacity: 1,
                                scaleX: 1,
                                duration: 0.6,
                                ease: "power2.out"
                            }, "-=0.4")
                            .to(formRef.current, {
                                opacity: 1,
                                y: 0,
                                duration: 0.8,
                                ease: "power2.out"
                            }, "-=0.2");
                    }
                });
            },
            { threshold: 0.3, rootMargin: '0px 0px -100px 0px' }
        );

        if (containerRef.current) {
            observer.observe(containerRef.current);
        }

        return () => observer.disconnect();
    }, [isVisible]);

    useEffect(() => {
        gsap.set([titleRef.current, formRef.current], {
            opacity: 0,
            y: 50
        });

        gsap.set(dividerRef.current, {
            opacity: 1,
            scaleX: 0,
            transformOrigin: "center"
        });
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        setSubmitStatus('idle');

        try {
            const response = await fetch('/api/v1/sabs/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (response.ok) {
                setSubmitStatus('success');
                setFormData({
                    nom: '',
                    prenom: '',
                    email: '',
                    typeEvent: '',
                    objet: '',
                    message: ''
                });
            } else {
                setSubmitStatus('error');
            }
        } catch {
            setSubmitStatus('error');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="snap-start h-screen relative bg-gradient-to-br from-gray-50 via-white to-gray-100 py-8" style={{ fontFamily: BeVietnam.style.fontFamily }}>
            {/* Subtle background pattern */}
            <div className="absolute inset-0 opacity-[0.02]">
                <div className="absolute inset-0" style={{
                    backgroundImage: `radial-gradient(circle at 25% 25%, #7373B4 0%, transparent 70%), 
                                     radial-gradient(circle at 75% 75%, #85527E 0%, transparent 70%)`
                }}></div>
            </div>

            <div ref={containerRef} className="relative z-10 container mx-auto px-8 h-full flex items-center">
                <div className="max-w-4xl mx-auto w-full">
                    <div className="text-center mb-8">
                        <h2 ref={titleRef} className="text-3xl md:text-5xl font-thin text-gray-900 mb-4 tracking-[-0.02em]">
                            Contactez <span className="text-sabs-primary font-medium">SABS</span>
                        </h2>
                        <div ref={dividerRef} className="w-24 h-[2px] bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary mx-auto mb-6 rounded-full"></div>
                        <p className="text-lg text-gray-600 max-w-2xl mx-auto font-light leading-relaxed">
                            Prêt à transformer votre événement ? Contactez-nous pour discuter de votre projet.
                        </p>
                    </div>

                    <form ref={formRef} onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-2xl rounded-[1.5rem] p-6 border border-gray-200/50 shadow-[0_20px_40px_0_rgba(31,38,135,0.1)]">
                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="prenom" className="block text-gray-700 font-medium mb-2 text-sm tracking-wide">Prénom *</label>
                                <input
                                    type="text"
                                    id="prenom"
                                    name="prenom"
                                    value={formData.prenom}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 text-sm font-light"
                                    placeholder="Votre prénom"
                                />
                            </div>
                            <div>
                                <label htmlFor="nom" className="block text-gray-700 font-medium mb-2 text-sm tracking-wide">Nom *</label>
                                <input
                                    type="text"
                                    id="nom"
                                    name="nom"
                                    value={formData.nom}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 text-sm font-light"
                                    placeholder="Votre nom"
                                />
                            </div>
                        </div>

                        <div className="grid md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <label htmlFor="email" className="block text-gray-700 font-medium mb-2 text-sm tracking-wide">Email *</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 text-sm font-light"
                                    placeholder="votre@email.com"
                                />
                            </div>
                            <div>
                                <label htmlFor="typeEvent" className="block text-gray-700 font-medium mb-2 text-sm tracking-wide">Type d&apos;événement *</label>
                                <select
                                    id="typeEvent"
                                    name="typeEvent"
                                    value={formData.typeEvent}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 text-sm font-light appearance-none cursor-pointer"
                                >
                                    <option value="" className="bg-white">Sélectionnez un type</option>
                                    {eventTypes.map((type) => (
                                        <option key={type} value={type} className="bg-white">{type}</option>
                                    ))}
                                </select>
                            </div>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="objet" className="block text-gray-700 font-medium mb-2 text-sm tracking-wide">Objet *</label>
                            <input
                                type="text"
                                id="objet"
                                name="objet"
                                value={formData.objet}
                                onChange={handleInputChange}
                                required
                                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 text-sm font-light"
                                placeholder="Objet de votre demande"
                            />
                        </div>

                        <div className="mb-6">
                            <label htmlFor="message" className="block text-gray-700 font-medium mb-2 text-sm tracking-wide">Message *</label>
                            <textarea
                                id="message"
                                name="message"
                                value={formData.message}
                                onChange={handleInputChange}
                                required
                                rows={3}
                                className="w-full px-4 py-3 bg-gray-50/80 border border-gray-200 rounded-xl text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-sabs-primary/30 focus:border-sabs-primary/50 transition-all duration-300 resize-none text-sm font-light leading-relaxed"
                                placeholder="Décrivez votre projet en détail..."
                            />
                        </div>

                        {submitStatus === 'success' && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-xl text-green-700 text-sm flex items-center gap-2">
                                <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                Message envoyé avec succès ! Nous vous recontacterons bientôt.
                            </div>
                        )}

                        {submitStatus === 'error' && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center gap-2">
                                <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0">
                                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                    </svg>
                                </div>
                                Une erreur s&apos;est produite. Veuillez réessayer.
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full bg-gradient-to-r from-sabs-gradient-1 via-sabs-gradient-2 to-sabs-primary hover:shadow-[0_10px_30px_0_rgba(115,115,180,0.3)] text-white font-medium py-4 px-6 rounded-xl transition-all duration-500 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none active:scale-[0.98] will-change-transform text-base tracking-wide"
                        >
                            {isSubmitting ? (
                                <span className="flex items-center justify-center gap-2">
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                                    Envoi en cours...
                                </span>
                            ) : (
                                'Envoyer le message'
                            )}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}