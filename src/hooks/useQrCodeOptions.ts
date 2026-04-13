import { useState } from 'react';

export interface QrCodeOptions {
    logo: string;
    dotType: string;
    cornerType: string;
    dotColor: string;
    cornerColor: string;
    lightColor: string;
}

export interface UseQrCodeOptionsReturn extends QrCodeOptions {
    setLogo: (v: string) => void;
    setDotType: (v: string) => void;
    setCornerType: (v: string) => void;
    setDotColor: (v: string) => void;
    setCornerColor: (v: string) => void;
    setLightColor: (v: string) => void;
    handleLogoChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

interface UseQrCodeOptionsInit {
    dotType?: string;
    cornerType?: string;
    dotColor?: string;
    cornerColor?: string;
}

export function useQrCodeOptions(init: UseQrCodeOptionsInit = {}): UseQrCodeOptionsReturn {
    const [logo, setLogo] = useState('');
    const [dotType, setDotType] = useState(init.dotType ?? 'rounded');
    const [cornerType, setCornerType] = useState(init.cornerType ?? 'rounded');
    const [dotColor, setDotColor] = useState(init.dotColor ?? '#1e40af');
    const [cornerColor, setCornerColor] = useState(init.cornerColor ?? '#1e40af');
    const [lightColor, setLightColor] = useState('#FFFFFF');

    const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => setLogo(reader.result as string);
        reader.readAsDataURL(file);
    };

    return {
        logo,
        dotType,
        cornerType,
        dotColor,
        cornerColor,
        lightColor,
        setLogo,
        setDotType,
        setCornerType,
        setDotColor,
        setCornerColor,
        setLightColor,
        handleLogoChange,
    };
}
