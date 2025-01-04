import { Link } from "@/i18n/routing";
import Image, { StaticImageData } from "next/image";

export function NetworkCard({ title, url, icon }: { title: string, url: string, icon: StaticImageData }) {
    return (
        <Link href={url} target="_blank" className='flex flex-row items-center bg-black p-2 rounded-lg shadow-lg shadow-white border-white border-2 transition-all duration-300 hover:border-green-500 hover:shadow-green-500'>
            <Image src={icon.src} alt={title} height={40} width={40} />
            <h2 className='font-bold text-xl mb-2 text-white ml-2 my-auto'>{title}</h2>
        </Link>
    )
}