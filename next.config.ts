import type { NextConfig } from "next";

const nextConfig: NextConfig = {
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

  // Webpack configuration to handle Node.js modules in browser
  webpack: (config, { isServer }) => {
    // Provide empty implementations for Node.js core modules
    // that are referenced by dotenv and other libraries
    if (!isServer) {
      config.node = {
        ...config.node,
        fs: 'empty',
        child_process: 'empty',
        net: 'empty',
        tls: 'empty',
        dns: 'empty',
      };
    }

    return config;
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
