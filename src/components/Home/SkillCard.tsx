import { Link } from "@/i18n/routing";
import Image, { StaticImageData } from "next/image";

export interface SkillProps {
    title: string;
    image: StaticImageData;
    url?: string;
}

export function SkillCard({ title, image, url }: SkillProps) {
    if(!url) {
        return (
            <div className='flex flex-col items-center space-y-3'>
                <Image src={image.src} alt={title + " SVG logo not clickable"} className='w-20 h-20' width={80} height={80} />
                <p className='text-gray-100 text-lg font-semibold'>{title}</p>
            </div>
        )
    }
    return (
        <Link href={url || "#"} target='_blank' rel='noreferrer' className='flex flex-col items-center space-y-3 transition-all duration-300 hover:scale-105'>
            <Image src={image.src} alt={title + " SVG logo clickable"} className='w-20 h-20' width={80} height={80} />
            <p className='text-gray-100 text-lg font-semibold'>{title}</p>
        </Link>
    )
}