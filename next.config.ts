import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    domains: [
      'res.cloudinary.com', 
      'images.unsplash.com',
      'www.kultursanatis.com.tr',
      'www.birlesikkamuis.org.tr',
      'localhost'
    ],
    unoptimized: process.env.NODE_ENV === 'development',
  },
};

export default nextConfig;
