import type { NextConfig } from 'next';

const isDocker = process.env.IS_DOCKER === 'true';

const nextConfig: NextConfig = {
    output: isDocker ? 'standalone' : undefined,
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'static-cdn.jtvnw.net',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.frankerfacez.com',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'cdn.betterttv.net',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'nathan.bonnell.fr',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'media.discordapp.net',
                pathname: '/**',
            },
        ],
    },
};

export default nextConfig;
