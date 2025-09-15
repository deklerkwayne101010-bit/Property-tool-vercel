import type { NextConfig } from "next";
import path from "path";

const nextConfig: NextConfig = {
  outputFileTracingRoot: path.join(process.cwd()),
  webpack: (config, { buildId, dev, isServer, defaultLoaders, webpack }) => {
    // Handle long file paths on Windows
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        fs: false,
      };
    }

    // Fix Windows file system issues
    if (process.platform === 'win32') {
      config.watchOptions = {
        ...config.watchOptions,
        ignored: /node_modules/,
      };
    }

    return config;
  },
};

export default nextConfig;
