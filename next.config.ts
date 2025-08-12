import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: [
      'res.cloudinary.com', 
      'images.unsplash.com',
      'www.kultursanatis.com.tr',
      'www.birlesikkamuis.org.tr'
    ],
  },
};

export default nextConfig;
