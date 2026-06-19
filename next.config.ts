import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Configure base path for GitHub Pages deployment
  basePath: process.env.NODE_ENV === 'production' ? '/rhine-order-management' : '',
  assetPrefix: process.env.NODE_ENV === 'production' ? '/rhine-order-management' : '',
};

export default nextConfig;
