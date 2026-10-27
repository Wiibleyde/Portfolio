'use client';
import { useCallback, useEffect, useState } from 'react';
import { ArrowRepeat, CheckCircle, Send } from 'react-bootstrap-icons';
import { SectionHeading } from './SectionHeading';

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
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [submitError, setSubmitError] = useState<string | null>(null);

    const [formData, setFormData] = useState<FormData>({
        name: '',
        email: '',
        subject: '',
        message: '',
    });

    const [errors, setErrors] = useState<FormErrors>({});

    // Validation
    const validateForm = useCallback((): boolean => {
        const newErrors: FormErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Le nom est requis';
        }

        if (!formData.email.trim()) {
            newErrors.email = "L'email est requis";
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            newErrors.email = "Format d'email invalide";
        }

        if (!formData.subject.trim()) {
            newErrors.subject = "L'objet est requis";
        }

        if (!formData.message.trim()) {
            newErrors.message = 'Le message est requis';
        } else if (formData.message.trim().length < 10) {
            newErrors.message = 'Le message doit contenir au moins 10 caractères';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [formData]);

    // Handle form submission
    const handleSubmit = useCallback(
        async (e: React.FormEvent) => {
            e.preventDefault();

            if (!validateForm()) return;

            setIsSubmitting(true);
            setSubmitError(null);

            try {
                const honeypot = new FormData(e.currentTarget as HTMLFormElement).get('website') ?? '';
                const response = await fetch('/api/contact', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ ...formData, website: honeypot }),
                });
                if (response.status === 429) {
                    setSubmitError('Trop de messages envoyés. Réessayez dans quelques minutes.');
                    return;
                }
                if (!response.ok) {
                    throw new Error(`Contact API responded ${response.status}`);
                }
                setIsSubmitted(true);
                setFormData({ name: '', email: '', subject: '', message: '' });
                setErrors({});
            } catch (error) {
                console.error('Error submitting form:', error);
                setSubmitError("Une erreur est survenue lors de l'envoi. Réessayez plus tard.");
            } finally {
                setIsSubmitting(false);
            }
        },
        [formData, validateForm],
    );

    // Handle input changes
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));

        // Clear error when user starts typing
        if (errors[name as keyof FormErrors]) {
            setErrors((prev) => ({ ...prev, [name]: undefined }));
        }
    };

    // Reset success message after 5 seconds
    useEffect(() => {
        if (isSubmitted) {
            const timer = setTimeout(() => {
                setIsSubmitted(false);
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [isSubmitted]);

    const field = (name: keyof FormData, label: string, placeholder: string, type = 'text') => (
        <div>
            <label htmlFor={name} className="mb-1.5 block text-sm text-zinc-300">
                {label}
            </label>
            {name === 'message' ? (
                <textarea
                    id={name}
                    name={name}
                    rows={5}
                    maxLength={4000}
                    value={formData[name]}
                    onChange={handleChange}
                    aria-invalid={!!errors[name]}
                    className={`input resize-none ${errors[name] ? 'border-red-500/60' : ''}`}
                    placeholder={placeholder}
                />
            ) : (
                <input
                    type={type}
                    id={name}
                    name={name}
                    value={formData[name]}
                    onChange={handleChange}
                    aria-invalid={!!errors[name]}
                    className={`input ${errors[name] ? 'border-red-500/60' : ''}`}
                    placeholder={placeholder}
                />
            )}
            {errors[name] && <p className="mt-1.5 text-red-400 text-sm">{errors[name]}</p>}
        </div>
    );

    return (
        <section id="contact" className="relative border-zinc-900 border-t py-24 md:py-32">
            <div className="mx-auto grid max-w-6xl gap-12 px-6 md:px-10 lg:grid-cols-[1fr_1.2fr]">
                <div>
                    <SectionHeading title="Contact">
                        Une idée, un projet, une question ? N&apos;hésitez pas à me contacter !
                    </SectionHeading>
                    <dl className="space-y-4 text-sm">
                        <div>
                            <dt className="eyebrow">Email</dt>
                            <dd className="mt-1">
                                <a href="mailto:nathan@bonnell.fr" className="text-zinc-200 hover:text-white">
                                    nathan@bonnell.fr
                                </a>
                            </dd>
                        </div>
                        <div>
                            <dt className="eyebrow">Localisation</dt>
                            <dd className="mt-1 text-zinc-200">Bordeaux, France</dd>
                        </div>
                    </dl>
                </div>

                <div className="card p-6 md:p-8">
                    {isSubmitted ? (
                        <div className="flex flex-col items-center py-12 text-center">
                            <CheckCircle className="h-10 w-10 text-emerald-400" />
                            <h3 className="mt-4 font-medium text-xl text-zinc-50">Message envoyé !</h3>
                            <p className="mt-2 text-zinc-400">Je vous répondrai dans les plus brefs délais.</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} noValidate className="space-y-5">
                            <div className="grid gap-5 sm:grid-cols-2">
                                {field('name', 'Nom & prénom', 'Votre nom complet')}
                                {field('email', 'Email', 'votre.email@exemple.com', 'email')}
                            </div>
                            {/* honeypot: invisible to people, bots fill it in */}
                            <input
                                type="text"
                                name="website"
                                tabIndex={-1}
                                autoComplete="off"
                                aria-hidden="true"
                                className="-left-[9999px] absolute h-px w-px opacity-0"
                            />
                            {field('subject', 'Objet', 'Sujet de votre message')}
                            {field('message', 'Message', 'Décrivez votre projet ou votre demande...')}

                            {submitError && (
                                <p role="alert" className="text-red-400 text-sm">
                                    {submitError}
                                </p>
                            )}

                            <button type="submit" disabled={isSubmitting} className="btn btn-primary w-full sm:w-auto">
                                {isSubmitting ? (
                                    <>
                                        <ArrowRepeat className="h-4 w-4 animate-spin" />
                                        Envoi en cours...
                                    </>
                                ) : (
                                    <>
                                        Envoyer le message
                                        <Send className="h-4 w-4" />
                                    </>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </section>
    );
}
