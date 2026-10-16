import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    dangerouslyAllowSVG: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'secure.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '*.gravatar.com',
      },
      {
        protocol: 'https',
        hostname: 'gravatar.com',
      },
      {
        protocol: 'https',
        hostname: '*.wp.com',
      },
      {
        protocol: 'https',
        hostname: '*.wordpress.com',
      },
      {
        protocol: 'https',
        hostname: 's.w.org',
      },
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
        hostname: 'whatsnextph.local',
      },
      {
        protocol: 'https',
        hostname: 'whatsnextph.local',
      },
      {
        protocol: 'http',
        hostname: 'whatsnextph',
      },
      {
        protocol: 'https',
        hostname: 'whatsnextph',
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
  async rewrites() {
    return [
      {
        source: '/wp-content/:path*',
        destination: 'http://whatsnextph.local/wp-content/:path*',
      },
    ];
  },
};

export default nextConfig;
