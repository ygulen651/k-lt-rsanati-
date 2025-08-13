import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Event from '@/models/Event'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const upcoming = searchParams.get('upcoming')
    const category = searchParams.get('category')
    const slug = searchParams.get('slug')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    
    // Query oluştur
    let query: any = {}
    
    if (status) {
      query.status = status
    }
    
    if (category) {
      query.category = category
    }
    if (slug) {
      query.slug = slug
    }
    
    // Yaklaşan etkinlikler filtresi
    if (upcoming === 'true') {
      query.date = { $gte: new Date() }
    }
    
    // Pagination hesapla
    const skip = (page - 1) * limit
    
    // Etkinlikleri getir
    const events = await Event.find(query)
      .sort({ date: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    // Toplam sayı
    const total = await Event.countDocuments(query)
    
    return NextResponse.json({
      ok: true,
      data: events,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: events.length,
        totalItems: total
      }
    })
  } catch (error: any) {
    console.error('Public Events error:', error)
    return NextResponse.json(
      { ok: false, message: 'Etkinlikler getirilemedi', error: error.message },
      { status: 500 }
    )
  }
}
