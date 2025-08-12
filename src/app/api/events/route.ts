import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Event from '@/models/Event'
import { authenticate, requireEditor } from '@/lib/auth'

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
      success: true,
      data: events,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: events.length,
        totalItems: total
      }
    })
  } catch (error: any) {
    console.error('Error fetching events:', error)
    return NextResponse.json(
      { success: false, message: 'Etkinlikler getirilemedi', error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Kimlik doğrulama
    const user = await authenticate(request)
    if (!user || !requireEditor(user)) {
      return NextResponse.json(
        { success: false, message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }
    
    const body = await request.json()
    
    // Gerekli alanları kontrol et
    if (!body.title || !body.date || !body.time || !body.location) {
      return NextResponse.json(
        { success: false, message: 'Başlık, tarih, saat ve konum gereklidir' },
        { status: 400 }
      )
    }
    
    // Slug oluştur
    let slug = body.slug
    if (!slug) {
      slug = body.title
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }
    
    // Benzersiz slug kontrolü
    let uniqueSlug = slug
    let counter = 1
    while (await Event.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }
    
    // Yeni etkinlik oluştur
    const event = new Event({
      title: body.title,
      slug: uniqueSlug,
      description: body.description || '',
      date: new Date(body.date),
      time: body.time,
      endDate: body.endDate ? new Date(body.endDate) : undefined,
      endTime: body.endTime,
      location: body.location,
      address: body.address,
      category: body.category || 'toplanti',
      status: body.status || 'draft',
      featured: body.featured || false,
      maxParticipants: body.maxParticipants,
      registrationRequired: body.registrationRequired || false,
      registrationDeadline: body.registrationDeadline ? new Date(body.registrationDeadline) : undefined,
      contactEmail: body.contactEmail,
      contactPhone: body.contactPhone,
      featuredImage: body.featuredImage,
      createdBy: user.name
    })
    
    await event.save()
    
    return NextResponse.json({
      success: true,
      message: 'Etkinlik başarıyla oluşturuldu',
      data: event
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Error creating event:', error)
    
    // Validation error kontrolü
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, message: 'Doğrulama hatası', errors },
        { status: 400 }
      )
    }
    
    // Duplicate key error kontrolü
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Bu slug zaten kullanımda' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Etkinlik oluşturulamadı', error: error.message },
      { status: 500 }
    )
  }
}
