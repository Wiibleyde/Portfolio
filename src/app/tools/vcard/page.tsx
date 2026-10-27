'use client';
import { useState } from 'react';
import { QrCodeCanvasPreview } from '@/components/tools/QrCodeCanvasPreview';
import { QrCodeOptionsPanel } from '@/components/tools/QrCodeOptionsPanel';
import { ToolPageLayout } from '@/components/tools/ToolPageLayout';
import { useQrCodeOptions } from '@/hooks/useQrCodeOptions';
import { renderQrCodeToCanvas } from '@/lib/qrcode';

interface VCardData {
    firstName: string;
    lastName: string;
    organization: string;
    title: string;
    phone: string;
    email: string;
    website: string;
    address: string;
    city: string;
    postalCode: string;
    country: string;
}

const CANVAS_ID = 'vcardCanvas';

const FIELDS: { name: keyof VCardData; label: string; type: string; placeholder: string; wide?: boolean }[] = [
    { name: 'firstName', label: 'Prénom *', type: 'text', placeholder: 'Camille' },
    { name: 'lastName', label: 'Nom *', type: 'text', placeholder: 'Durand' },
    { name: 'organization', label: 'Entreprise', type: 'text', placeholder: 'Nom de l’entreprise' },
    { name: 'title', label: 'Poste', type: 'text', placeholder: 'Développeuse' },
    { name: 'phone', label: 'Téléphone', type: 'tel', placeholder: '+33 6 12 34 56 78' },
    { name: 'email', label: 'Email', type: 'email', placeholder: 'camille.durand@exemple.fr' },
    { name: 'website', label: 'Site web', type: 'url', placeholder: 'https://exemple.fr', wide: true },
    { name: 'address', label: 'Adresse', type: 'text', placeholder: '12 rue Sainte-Catherine', wide: true },
    { name: 'city', label: 'Ville', type: 'text', placeholder: 'Bordeaux' },
    { name: 'postalCode', label: 'Code postal', type: 'text', placeholder: '33000' },
    { name: 'country', label: 'Pays', type: 'text', placeholder: 'France', wide: true },
];

// RFC 6350: escape backslash, comma, semicolon and newlines in property values
const esc = (value: string) =>
    value
        .trim()
        .replace(/[\\,;]/g, '\\$&')
        .replace(/\r?\n/g, '\\n');

function generateVCardString(data: VCardData): string {
    const lines = ['BEGIN:VCARD', 'VERSION:3.0'];
    if (data.firstName || data.lastName) {
        lines.push(`FN:${esc(`${data.firstName} ${data.lastName}`)}`);
        lines.push(`N:${esc(data.lastName)};${esc(data.firstName)};;;`);
    }
    if (data.organization) lines.push(`ORG:${esc(data.organization)}`);
    if (data.title) lines.push(`TITLE:${esc(data.title)}`);
    if (data.phone) lines.push(`TEL:${esc(data.phone)}`);
    if (data.email) lines.push(`EMAIL:${esc(data.email)}`);
    if (data.website) lines.push(`URL:${esc(data.website)}`);
    if (data.address || data.city || data.postalCode || data.country) {
        lines.push(`ADR:;;${esc(data.address)};${esc(data.city)};;${esc(data.postalCode)};${esc(data.country)}`);
    }
    lines.push('END:VCARD');
    return lines.join('\r\n');
}

export default function VCardPage() {
    const [isGenerating, setIsGenerating] = useState(false);
    const [hasGenerated, setHasGenerated] = useState(false);
    const [vCardData, setVCardData] = useState<VCardData>({
        firstName: '',
        lastName: '',
        organization: '',
        title: '',
        phone: '',
        email: '',
        website: '',
        address: '',
        city: '',
        postalCode: '',
        country: '',
    });

    const qrOptions = useQrCodeOptions({
        dotType: 'rounded',
        cornerType: 'rounded',
        dotColor: '#18181b',
        cornerColor: '#18181b',
    });

    const isFormValid = !!(vCardData.firstName.trim() || vCardData.lastName.trim());

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setVCardData((prev) => ({ ...prev, [name]: value }));
    };

    const handleGenerateVCard = async () => {
        if (!isFormValid) return;
        setIsGenerating(true);
        try {
            const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
            await renderQrCodeToCanvas(canvas, generateVCardString(vCardData), qrOptions);
            setHasGenerated(true);
        } catch (error) {
            console.error('Error generating VCard QR code:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadVCard = () => {
        const canvas = document.getElementById(CANVAS_ID) as HTMLCanvasElement;
        if (!canvas || !hasGenerated) return;
        const link = document.createElement('a');
        link.download = 'vcard-qrcode.png';
        link.href = canvas.toDataURL();
        link.click();
    };

    return (
        <ToolPageLayout
            title="Générateur de vCard"
            description="Créez un QR code de carte de visite numérique, à scanner pour ajouter un contact."
        >
            <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-2">
                <form
                    className="card space-y-5 p-6 md:p-8"
                    onSubmit={(e) => {
                        e.preventDefault();
                        handleGenerateVCard();
                    }}
                >
                    <h2 className="font-medium text-lg text-zinc-50">Informations</h2>
                    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                        {FIELDS.map(({ name, label, type, placeholder, wide }) => (
                            <div key={name} className={wide ? 'sm:col-span-2' : undefined}>
                                <label htmlFor={name} className="mb-1.5 block text-sm text-zinc-300">
                                    {label}
                                </label>
                                <input
                                    type={type}
                                    id={name}
                                    name={name}
                                    value={vCardData[name]}
                                    onChange={handleInputChange}
                                    className="input"
                                    placeholder={placeholder}
                                />
                            </div>
                        ))}
                    </div>

                    <h2 className="pt-4 font-medium text-lg text-zinc-50">Style du QR code</h2>
                    <QrCodeOptionsPanel options={qrOptions} />

                    <button type="submit" disabled={!isFormValid || isGenerating} className="btn btn-primary w-full">
                        {isGenerating ? 'Génération...' : 'Générer la vCard'}
                    </button>
                </form>

                <QrCodeCanvasPreview
                    canvasId={CANVAS_ID}
                    hasGenerated={hasGenerated}
                    isGenerating={isGenerating}
                    onDownload={handleDownloadVCard}
                    emptyHint="Renseignez au moins un prénom ou un nom pour générer la vCard."
                />
            </div>
        </ToolPageLayout>
    );
}
