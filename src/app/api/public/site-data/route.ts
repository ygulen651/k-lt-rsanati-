import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import SiteData, { defaultSiteData } from '@/models/SiteData'

export async function GET(request: NextRequest) {
  try {
    // MongoDB'ye bağlan
    await connectDB()
    
    // Tüm site data'yı getir
    const siteDataSections = await SiteData.find({}).lean()
    
    // Default data ile birleştir
    let siteData = { ...defaultSiteData }
    
    // MongoDB'den gelen verileri merge et
    siteDataSections.forEach((section: Record<string, any>) => {
      if (section.section && section.data) {
        (siteData as Record<string, any>)[section.section] = section.data
      }
    })
    
    console.log('✅ Public Site data başarıyla yüklendi:', Object.keys(siteData).length, 'bölüm')
    
    return NextResponse.json({ 
      success: true, 
      data: siteData,
      source: 'mongodb'
    })
    
  } catch (error: any) {
    console.error('❌ Public Site data error:', error)
    
    // Hata durumunda default data döndür
    return NextResponse.json({ 
      success: true, 
      data: defaultSiteData,
      source: 'default',
      warning: 'MongoDB bağlantısı başarısız, default veriler kullanılıyor'
    })
  }
}
