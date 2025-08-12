import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Slider from '@/models/Slider'
import { authenticate, requireEditor } from '@/lib/auth'

export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const activeOnly = searchParams.get('active') === 'true'
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')

    // Query oluştur
    let query: any = {}
    if (activeOnly) {
      query.isActive = true
    }

    // Pagination hesapla
    const skip = (page - 1) * limit

    // Slider'ları getir (sıraya göre)
    const sliders = await Slider.find(query)
      .sort({ order: 1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()

    // Toplam sayı
    const total = await Slider.countDocuments(query)

    return NextResponse.json({
      success: true,
      data: sliders,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: sliders.length,
        totalItems: total
      }
    })
  } catch (error: any) {
    console.error('Error fetching sliders:', error)
    return NextResponse.json(
      { success: false, message: 'Slider\'lar getirilemedi', error: error.message },
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
    console.log('Received slider body:', body)

    // Gerekli alanları kontrol et
    if (!body.title || !body.image) {
      console.log('Validation failed:', { title: body.title, image: body.image })
      return NextResponse.json(
        { success: false, message: 'Başlık ve görsel gereklidir' },
        { status: 400 }
      )
    }

    // Yeni slider oluştur
    const slider = new Slider({
      title: body.title,
      subtitle: body.subtitle,
      description: body.description,
      image: body.image,
      buttonText: body.buttonText,
      buttonLink: body.buttonLink,
      order: body.order || 0,
      isActive: body.isActive !== undefined ? body.isActive : true,
      backgroundColor: body.backgroundColor || '#000000',
      textColor: body.textColor || '#ffffff',
      createdBy: user.name
    })

    await slider.save()

    return NextResponse.json({
      success: true,
      message: 'Slider başarıyla oluşturuldu',
      data: slider
    }, { status: 201 })

  } catch (error: any) {
    console.error('Error creating slider:', error)

    // Validation error kontrolü
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, message: 'Doğrulama hatası', errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Slider oluşturulamadı', error: error.message },
      { status: 500 }
    )
  }
}
