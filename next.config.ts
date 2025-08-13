import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel deployment için optimize edildi
  output: 'standalone',
  
  images: {
    domains: [
      'res.cloudinary.com', 
      'images.unsplash.com',
      'www.kultursanatis.com.tr',
      'www.birlesikkamuis.org.tr',
      'localhost'
    ],
    // Vercel'de image optimization
    unoptimized: false,
  },
  
  // Vercel'de build optimizasyonu
  experimental: {
    optimizePackageImports: ['lucide-react', '@radix-ui/react-icons'],
  },
  
  // TypeScript strict mode
  typescript: {
    ignoreBuildErrors: false,
  },
  
  // ESLint build sırasında kontrol et
  eslint: {
    ignoreDuringBuilds: false,
  },
};

export default nextConfig;
