import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure external packages for server components
  serverExternalPackages: ['mongoose'],

  // Disable static optimization for API routes to prevent File object issues
  experimental: {
    serverComponentsExternalPackages: ['mongoose'],
    // Disable static generation for API routes
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },

  // Configure for Netlify deployment
  output: 'standalone',

  // Image optimization settings
  images: {
    unoptimized: true, // Required for Netlify
  },

  // Environment variables
  env: {
    NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  },

  // Headers for security
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Frame-Options',
            value: 'DENY',
          },
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
