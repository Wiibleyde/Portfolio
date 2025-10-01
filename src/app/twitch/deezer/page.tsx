'use client';
import { ScrollingText } from '@/components/UI/ScrollingText';
import useSWR from 'swr';
import TerminalHeaderPanel from '@/components/twitch/TerminalHeaderPanel';
import Image from 'next/image';

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
    const { data, error } = useSWR<ApiResponse>('https://eve-api.bonnell.fr/api/v1/music', fetcher, {
        refreshInterval: 1000,
    });

    return (
        <TerminalHeaderPanel
            title="wiibleyde@stream: deezer-now-playing"
            className="min-h-screen bg-black text-green-500 font-mono"
        >
            <div className="flex flex-col h-full">
                {/* Command execution line */}
                <div
                    className="bg-black/60 px-2 py-1 font-mono text-base text-gray-300 border-b border-gray-700 flex items-center gap-2 flex-shrink-0"
                    style={{ height: '40px', overflow: 'hidden' }}
                >
                    <span className="text-green-400">wiibleyde@stream</span>
                    <span className="text-white">$</span>
                    <span className="text-blue-400">sudo log music</span>
                </div>
                <div className="p-4 flex-1 overflow-y-auto hide-scrollbar">
                    {error && <div className="text-red-500">Failed to load music data.</div>}
                    {!data && !error && <div className="text-[2.5vw]">Loading...</div>}
                    {data && (
                        <div className="flex flex-col items-start">
                            <div className="flex items-center gap-4">
                                <Image
                                    src={data.currentlyPlaying.trackImageUrl}
                                    alt="Album Art"
                                    className="w-32 h-32 rounded"
                                    width={128}
                                    height={128}
                                    unoptimized
                                />
                                <div>
                                    <div className="text-[3vw] font-bold">Now Playing:</div>
                                    <ScrollingText
                                        text={data.currentlyPlaying.title}
                                        className="text-[2.5vw] font-semibold mt-2"
                                    />
                                    <ScrollingText
                                        text={`by ${data.currentlyPlaying.artist}`}
                                        className="text-[2vw] italic mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </TerminalHeaderPanel>
    );
}
