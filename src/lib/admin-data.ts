// Admin panel veri yönetimi
import { writeFileSync, readFileSync, existsSync } from 'fs'
import { join } from 'path'

const DATA_DIR = join(process.cwd(), 'data')

// Veri tiplerini tanımla
export interface SiteData {
  hero: {
    title: string
    subtitle: string
    description: string
    slides: Array<{
      id: string
      title: string
      subtitle: string
      description: string
      image: string
      date: string
      category: string
      link: string
      featured: boolean
    }>
  }
  mission: {
    mission: string
    vision: string
    values: string
  }
  seo: {
    siteTitle: string
    siteDescription: string
    keywords: string
    author: string
    robots: string
    canonicalUrl: string
    ogTitle: string
    ogDescription: string
    ogImage: string
    twitterCard: string
    twitterSite: string
    googleAnalytics: string
    googleSearchConsole: string
    structuredData: boolean
    sitemap: boolean
    robotsTxt: boolean
  }
  socialMedia: Array<{
    id: string
    platform: string
    username: string
    url: string
    followers: number
    isActive: boolean
  }>
  theme: {
    primaryColor: string
    secondaryColor: string
    accentColor: string
    backgroundColor: string
    textColor: string
    fontFamily: string
    logoUrl: string
  }
}

// Varsayılan veri
const defaultSiteData: SiteData = {
  hero: {
    title: "MADİMAK'ın 32. YILINDA AYDINLIĞA YÖNELİK SALDIRILAR SÜRÜYOR",
    subtitle: "unutMADİMAKlımaa",
    description: "Aydınlığın Yakıldığı Yer... 2 TEMMUZ 1993",
    slides: [
      {
        id: "madimak",
        title: "MADİMAK'ın 32. YILINDA AYDINLIĞA YÖNELİK SALDIRILAR SÜRÜYOR",
        subtitle: "unutMADİMAKlımaa",
        description: "Aydınlığın Yakıldığı Yer... 2 TEMMUZ 1993",
        image: "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1920&h=1080&fit=crop",
        date: "2025-07-02",
        category: "Anma",
        link: "/duyurular",
        featured: true
      },
      {
        id: "1-mayis",
        title: "1 Mayıs İşçi Bayramı Kutlu Olsun",
        subtitle: "Emek ve Dayanışma Günü",
        description: "Tüm işçilerin 1 Mayıs Emek ve Dayanışma Günü kutlu olsun. Birlik ve mücadele ruhuyla...",
        image: "https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=1920&h=1080&fit=crop",
        date: "2025-05-01",
        category: "Kutlama",
        link: "/etkinlikler",
        featured: true
      }
    ]
  },
  mission: {
    mission: "Kamu çalışanlarının haklarını korumak, sosyal ve ekonomik durumlarını iyileştirmek, demokratik ve laik cumhuriyeti desteklemek.",
    vision: "Türkiye'nin en güçlü ve etkili kamu sendikası olmak, çalışanların sesini en yüksek perdeden duyurmak.",
    values: "Adalet, eşitlik, dayanışma, şeffaflık ve demokratik katılım ilkelerimizle hareket ediyoruz."
  },
  seo: {
    siteTitle: 'Kültür Sanat İş | Kamu Çalışanları Sendikası',
    siteDescription: 'Kamu çalışanlarının haklarını korumak, sosyal ve ekonomik durumlarını iyileştirmek için çalışan sendika.',
    keywords: 'sendika, kamu çalışanları, işçi hakları, toplu sözleşme, sosyal haklar',
    author: 'Kültür Sanat İş',
    robots: 'index, follow',
    canonicalUrl: 'https://kultursanatis.org',
    ogTitle: 'Kültür Sanat İş | Kamu Çalışanları Sendikası',
    ogDescription: 'Kamu çalışanlarının haklarını korumak için çalışan sendika.',
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image',
    twitterSite: '@kultursanatis',
    googleAnalytics: 'G-XXXXXXXXXX',
    googleSearchConsole: 'verification-code',
    structuredData: true,
    sitemap: true,
    robotsTxt: true
  },
  socialMedia: [
    {
      id: '1',
      platform: 'Facebook',
      username: '@kultursanatis',
      url: 'https://facebook.com/kultursanatis',
      followers: 12500,
      isActive: true
    },
    {
      id: '2',
      platform: 'Twitter',
      username: '@kultursanatis',
      url: 'https://twitter.com/kultursanatis',
      followers: 8300,
      isActive: true
    }
  ],
  theme: {
    primaryColor: '#dc2626',
    secondaryColor: '#2563eb',
    accentColor: '#7c3aed',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    logoUrl: '/Logo-png-beyaz.png'
  }
}

// Veri okuma fonksiyonu
export function getSiteData(): SiteData {
  try {
    const filePath = join(DATA_DIR, 'site-data.json')
    if (existsSync(filePath)) {
      const data = readFileSync(filePath, 'utf-8')
      return JSON.parse(data)
    }
    return defaultSiteData
  } catch (error) {
    console.error('Veri okuma hatası:', error)
    return defaultSiteData
  }
}

// Veri kaydetme fonksiyonu
export function saveSiteData(data: Partial<SiteData>): boolean {
  try {
    const currentData = getSiteData()
    const updatedData = { ...currentData, ...data }
    
    const filePath = join(DATA_DIR, 'site-data.json')
    writeFileSync(filePath, JSON.stringify(updatedData, null, 2))
    
    return true
  } catch (error) {
    console.error('Veri kaydetme hatası:', error)
    return false
  }
}

// Belirli bir bölümü güncelleme
export function updateSiteSection(section: keyof SiteData, data: any): boolean {
  try {
    const currentData = getSiteData()
    currentData[section] = { ...currentData[section], ...data }
    
    const filePath = join(DATA_DIR, 'site-data.json')
    writeFileSync(filePath, JSON.stringify(currentData, null, 2))
    
    return true
  } catch (error) {
    console.error('Bölüm güncelleme hatası:', error)
    return false
  }
}



