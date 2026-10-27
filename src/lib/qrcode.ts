import QrCodeWithLogo from 'qrcode-with-logos';
import type { CornerType, DotType } from 'qrcode-with-logos/types/core/types';
import type { QrCodeOptions } from '@/hooks/useQrCodeOptions';

export const DOT_TYPES: DotType[] = [
    'dot',
    'dot-small',
    'tile',
    'rounded',
    'square',
    'diamond',
    'star',
    'fluid',
    'fluid-line',
    'stripe',
    'stripe-row',
    'stripe-column',
];

export const CORNER_TYPES: CornerType[] = [
    'square',
    'rounded',
    'circle',
    'rounded-circle',
    'circle-rounded',
    'circle-star',
    'circle-diamond',
];

/** Renders a styled QR code for `content` into `canvas` (500x500). */
export async function renderQrCodeToCanvas(
    canvas: HTMLCanvasElement,
    content: string,
    style: QrCodeOptions,
): Promise<void> {
    const qrCode = new QrCodeWithLogo({
        content,
        width: 900,
        nodeQrCodeOptions: { color: { light: style.lightColor } },
        dotsOptions: { type: style.dotType as DotType, color: style.dotColor },
        cornersOptions: { type: style.cornerType as CornerType, color: style.cornerColor },
        logo: style.logo ? { src: style.logo, logoRadius: 1 } : undefined,
    });
    const img = await qrCode.getImage();
    await img.decode();

    canvas.width = 500;
    canvas.height = 500;
    canvas.getContext('2d')?.drawImage(img, 0, 0, 500, 500);
}
