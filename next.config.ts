import type { NextConfig } from "next";

const isDocker = process.env.IS_DOCKER === 'true';

const nextConfig: NextConfig = {
  output: isDocker ? 'standalone' : undefined,
};

export default nextConfig;
