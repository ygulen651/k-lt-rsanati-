// Sadece server-side'da cloudinary import et
let cloudinary: any = null

if (typeof window === 'undefined') {
  // Server-side'da çalışıyoruz
  try {
    const { v2 } = require('cloudinary')
    cloudinary = v2
    
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    })
  } catch (error) {
    console.warn('Cloudinary server konfigürasyonu yüklenemedi:', error)
  }
}

export const CLOUDINARY_CONFIG = {
  cloudName: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || '',
  uploadPreset: process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || 'union_public',
  folder: 'sendika',
}

export interface CloudinaryUploadResult {
  public_id: string
  secure_url: string
  url: string
  format: string
  width: number
  height: number
  bytes: number
  created_at: string
}

export function getCloudinaryUrl(
  publicId: string,
  options: {
    width?: number
    height?: number
    crop?: 'fill' | 'fit' | 'scale' | 'crop'
    quality?: 'auto' | number
    format?: 'auto' | 'webp' | 'jpg' | 'png'
  } = {}
): string {
  const {
    width,
    height,
    crop = 'fill',
    quality = 'auto',
    format = 'auto',
  } = options

  let transformation = `q_${quality},f_${format}`
  
  if (width || height) {
    transformation += `,c_${crop}`
    if (width) transformation += `,w_${width}`
    if (height) transformation += `,h_${height}`
  }

  return `https://res.cloudinary.com/${CLOUDINARY_CONFIG.cloudName}/image/upload/${transformation}/${publicId}`
}

export function getOptimizedImageUrl(
  url: string,
  options: {
    width?: number
    height?: number
    quality?: number
  } = {}
): string {
  if (!url.includes('cloudinary.com')) {
    return url
  }

  const { width = 800, height, quality = 80 } = options
  
  // URL'den public_id'yi çıkar
  const urlParts = url.split('/')
  const uploadIndex = urlParts.findIndex(part => part === 'upload')
  
  if (uploadIndex === -1) return url
  
  const publicIdParts = urlParts.slice(uploadIndex + 1)
  const publicId = publicIdParts.join('/')
  
  return getCloudinaryUrl(publicId, {
    width,
    height,
    quality,
    format: 'auto',
  })
}

export default cloudinary
