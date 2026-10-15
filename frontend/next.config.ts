import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'cms.nextph.example',
      },
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
      },
      {
        protocol: 'http',
        hostname: 'nextph-cms.local',
      },
      {
        protocol: 'https',
        hostname: 'nextph-cms.local',
      },
      {
        protocol: 'http',
        hostname: '*.local',
      },
      {
        protocol: 'https',
        hostname: '*.local',
      },
    ],
  },
};

export default nextConfig;
