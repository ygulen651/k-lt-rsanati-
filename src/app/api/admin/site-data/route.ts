import { NextRequest, NextResponse } from 'next/server'
import { authenticate, requireEditor } from '@/lib/auth'
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
    
    return NextResponse.json({ 
      success: true, 
      data: siteData,
      source: 'mongodb'
    })
    
  } catch (error: any) {
    console.error('❌ Site data error:', error)
    
    // Hata durumunda default data döndür
    return NextResponse.json({ 
      success: true, 
      data: defaultSiteData,
      source: 'default',
      warning: 'MongoDB bağlantısı başarısız, default veriler kullanılıyor'
    })
  }
}

export async function PUT(request: NextRequest) {
  try {
    // Kimlik doğrulama
    const user = await authenticate(request)
    if (!user || !requireEditor(user)) {
      console.log('❌ Yetkisiz erişim denemesi')
      return NextResponse.json(
        { success: false, message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }
    
    const body = await request.json() as {
      section: 'hero' | 'mission' | 'settings' | 'theme' | 'menu' | 'socials' | 'seo' | 'contact' | 'analytics'
      data: Record<string, any>
    }
    
    console.log('📝 PUT request - section:', body.section)
    console.log('📝 PUT request - data:', body.data)
    
    // MongoDB'ye bağlan
    await connectDB()
    
    // Upsert operation - section yoksa oluştur, varsa güncelle
    const result = await SiteData.findOneAndUpdate(
      { section: body.section },
      { 
        section: body.section,
        data: body.data,
        updatedBy: user.id,
        updatedAt: new Date()
      },
      { 
        upsert: true, 
        new: true,
        setDefaultsOnInsert: true
      }
    )
    
    console.log('✅ Site data başarıyla güncellendi:', body.section)
    
    return NextResponse.json({ 
      success: true, 
      data: result.data,
      message: `${body.section} bölümü başarıyla güncellendi`
    })
    
  } catch (error: any) {
    console.error('❌ Site data update error:', error)
    
    // MongoDB bağlantı hatası durumunda
    if (error.name === 'MongoNetworkError' || error.name === 'MongoServerSelectionError') {
      return NextResponse.json(
        { 
          success: false, 
          message: 'Veritabanı bağlantısı kurulamadı. Lütfen daha sonra tekrar deneyin.',
          error: 'Database connection failed'
        },
        { status: 503 }
      )
    }
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Site ayarları güncellenemedi', 
        error: error.message 
      },
      { status: 500 }
    )
  }
}

// POST method for bulk operations
export async function POST(request: NextRequest) {
  try {
    // Kimlik doğrulama
    const user = await authenticate(request)
    if (!user || !requireEditor(user)) {
      return NextResponse.json(
        { success: false, message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }
    
    const body = await request.json() as {
      action: 'initialize' | 'reset' | 'backup'
    }
    
    // MongoDB'ye bağlan
    await connectDB()
    
    if (body.action === 'initialize') {
      // İlk kurulum - tüm default data'yı MongoDB'ye ekle
      const sections = Object.keys(defaultSiteData) as Array<keyof typeof defaultSiteData>
      
      for (const section of sections) {
        await SiteData.findOneAndUpdate(
          { section },
          { 
            section,
            data: (defaultSiteData as any)[section],
            updatedBy: user.id
          },
          { upsert: true, new: true }
        )
      }
      
      console.log('✅ Site data başarıyla initialize edildi')
      
      return NextResponse.json({ 
        success: true, 
        message: 'Site data başarıyla initialize edildi'
      })
    }
    
    if (body.action === 'reset') {
      // Tüm site data'yı sıfırla
      await SiteData.deleteMany({})
      
      console.log('✅ Site data başarıyla sıfırlandı')
      
      return NextResponse.json({ 
        success: true, 
        message: 'Site data başarıyla sıfırlandı'
      })
    }
    
    return NextResponse.json(
      { success: false, message: 'Geçersiz action' },
      { status: 400 }
    )
    
  } catch (error: any) {
    console.error('❌ Site data action error:', error)
    return NextResponse.json(
      { 
        success: false, 
        message: 'İşlem başarısız', 
        error: error.message 
      },
      { status: 500 }
    )
  }
}