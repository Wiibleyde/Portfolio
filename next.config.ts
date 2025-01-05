import { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin();

const isDocker = process.env.IS_DOCKER === 'true';


const nextConfig: NextConfig = {
    output: isDocker ? 'standalone' : undefined,
};

export default withNextIntl(nextConfig);
