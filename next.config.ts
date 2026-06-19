import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  basePath: 'rhine-order-management', // Set the base path to the repository name for GitHub Pages deployment
};

export default nextConfig;
