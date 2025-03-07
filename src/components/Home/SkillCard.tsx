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
            <div className='flex flex-col items-center space-y-3 my-5'>
                <Image src={image.src} alt={title + " SVG logo not clickable"} className='lg:w-20 lg:h-20 w-10 h-10 bg-gray-900/30 p-2 rounded-xl dark:p-0 dark:bg-transparent' width={80} height={80} />
                <p className='dark:text-gray-100 lg:text-lg text-sm font-light'>{title}</p>
            </div>
        )
    }
    return (
        <Link href={url || "#"} target='_blank' rel='noreferrer' className='flex flex-col items-center space-y-3 transition-all duration-300 hover:scale-105 my-5' aria-label={"Link to " + title}>
            <Image src={image.src} alt={title + " SVG logo clickable"} className='lg:w-20 lg:h-20 w-10 h-10 bg-gray-900/30 p-2 rounded-xl dark:p-0 dark:bg-transparent' width={80} height={80} />
            <p className='dark:text-gray-100 lg:text-lg text-sm font-light'>{title}</p>
        </Link>
    )
}