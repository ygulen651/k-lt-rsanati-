import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Announcement from '@/models/Announcement'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    
    // Query oluştur
    let query: any = {}
    
    if (status) {
      query.status = status
    }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (category) {
      query.category = category
    }
    
    // Pagination hesapla
    const skip = (page - 1) * limit
    
    // Duyuruları getir
    const announcements = await Announcement.find(query)
      .sort({ publishDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    // Toplam sayı
    const total = await Announcement.countDocuments(query)
    
    return NextResponse.json({
      ok: true,
      data: announcements,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: announcements.length,
        totalItems: total
      }
    })
  } catch (error: any) {
    console.error('Public Announcements error:', error)
    return NextResponse.json(
      { ok: false, message: 'Duyurular getirilemedi', error: error.message },
      { status: 500 }
    )
  }
}
