import { Link } from "@/i18n/routing";
import Image, { StaticImageData } from "next/image";

export function NetworkCard({ title, url, icon }: { title: string, url: string, icon: StaticImageData }) {
    return (
        <div className='flex flex-col items-center transition-all duration-300 hover:scale-105 my-5'>
            <Link href={url} target="_blank" className='flex flex-col items-center space-y-3' aria-label={title}>
                <Image src={icon.src} alt={title + " button"} height={40} width={40} aria-label={title + " button"} />
                <h2 className='font-bold text-lg text-white truncate'>{title}</h2>
            </Link>
        </div>
    )
}