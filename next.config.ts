import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Configure external packages for server components
  serverExternalPackages: ['mongoose'],

  // Disable static optimization for API routes to prevent File object issues
  experimental: {
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

  // Webpack configuration to handle File object in server environment
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Provide a fallback for File object in server environment
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
        path: false,
      };

      // Add global polyfill for File and other browser APIs
      const webpack = require('webpack');
      config.plugins.push(
        new webpack.DefinePlugin({
          'global.File': 'undefined',
          'global.FileReader': 'undefined',
          'global.Blob': 'undefined',
          'global.FormData': 'undefined',
          'File': 'undefined',
          'FileReader': 'undefined',
          'Blob': 'undefined',
          'FormData': 'undefined',
        })
      );

      // Add rule to ignore File-related modules
      config.module.rules.push({
        test: /node_modules\/.*\.(js|ts|tsx)$/,
        use: {
          loader: 'string-replace-loader',
          options: {
            search: /\b(File|FileReader|Blob|FormData)\b/g,
            replace: 'undefined',
            flags: 'g'
          }
        }
      });
    }

    return config;
  },
};

export default nextConfig;
