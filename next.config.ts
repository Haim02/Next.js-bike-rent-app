import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  experimental: {
    viewTransition: true
  },
  images: {
    domains: ['res.cloudinary.com'],
  },
};

export default nextConfig;
