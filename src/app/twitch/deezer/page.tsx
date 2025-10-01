'use client';
import { ScrollingText } from '@/components/UI/ScrollingText';
import Image from 'next/image';
import { useState, useCallback } from 'react';
import useSWR from 'swr';

interface NowPlayingMusic {
    title: string;
    artist: string;
    trackImageUrl: string;
}

interface ApiResponse {
    currentlyPlaying: NowPlayingMusic;
}
const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function DeezerPage() {
    const [nowPlayingMusic, setNowPlayingMusic] = useState<NowPlayingMusic | null>(null);
    const [dominantColor, setDominantColor] = useState<string>('rgba(255, 255, 255, 0.3)');

    const extractDominantColor = useCallback((img: HTMLImageElement) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) return;

        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;

        let r = 0,
            g = 0,
            b = 0;
        let pixelCount = 0;

        // Sample every 10th pixel for performance
        for (let i = 0; i < data.length; i += 40) {
            r += data[i];
            g += data[i + 1];
            b += data[i + 2];
            pixelCount++;
        }

        r = Math.floor(r / pixelCount);
        g = Math.floor(g / pixelCount);
        b = Math.floor(b / pixelCount);

        setDominantColor(`rgba(${r}, ${g}, ${b}, 0.6)`);
    }, []);

    // Extract host from URL parameters
    const host = 'https://eve-api.bonnell.fr';
    const apiUrl = `${host}/api/v1/music`;

    const { data, error } = useSWR<ApiResponse>(apiUrl, fetcher, {
        refreshInterval: 1000,
        onSuccess: (data) => {
            const musicData = data.currentlyPlaying;
            setNowPlayingMusic({
                title: musicData.title,
                artist: musicData.artist,
                trackImageUrl: musicData.trackImageUrl,
            });
        },
    });

    return (
        <>
            <div className="w-screen h-screen flex items-start justify-start p-0 bg-transparent box-border">
                {!data && !error && <div className="text-white text-[2.5vw]">Loading...</div>}
                {nowPlayingMusic && (
                    <div className="flex items-center bg-black backdrop-blur-sm rounded-[20px] p-[4%] w-full h-full box-border overflow-hidden">
                        <Image
                            src={nowPlayingMusic.trackImageUrl}
                            alt="Album Art"
                            className="w-[23%] aspect-square rounded-[15px] mr-[4%] flex-shrink-0 object-cover block"
                            style={{
                                boxShadow: `
                  0 0 40px 10px ${dominantColor.replace('0.6', '1')},
                  0 0 80px 30px ${dominantColor.replace('0.6', '0.8')},
                  0 0 120px 50px ${dominantColor.replace('0.6', '0.4')},
                  0 0 160px 70px ${dominantColor.replace('0.6', '0.2')}
                `,
                            }}
                            width={500}
                            height={500}
                            onLoad={(e) => {
                                const img = e.target as HTMLImageElement;
                                img.crossOrigin = 'anonymous';
                                extractDominantColor(img);
                            }}
                            crossOrigin="anonymous"
                        />
                        <div className="flex flex-col justify-center overflow-hidden">
                            <ScrollingText
                                text={nowPlayingMusic.title}
                                className="text-white text-[20vh] font-semibold m-0 whitespace-nowrap"
                            />
                            <ScrollingText
                                text={nowPlayingMusic.artist}
                                className="text-gray-300 text-[16vh] italic m-0 whitespace-nowrap"
                            />
                        </div>
                    </div>
                )}
            </div>
        </>
    );
}
