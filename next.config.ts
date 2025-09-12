import type { NextConfig } from 'next';

const isDocker = process.env.IS_DOCKER === 'true';

const nextConfig: NextConfig = {
    output: isDocker ? 'standalone' : undefined,
    images: {
        domains: ['static-cdn.jtvnw.net', 'cdn.frankerfacez.com', 'cdn.betterttv.net', 'nathan.bonnell.fr'],
    },
};

export default nextConfig;
