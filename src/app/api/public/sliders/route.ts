import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Slider from '@/models/Slider'

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
      ok: true,
      data: sliders,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: sliders.length,
        totalItems: total
      }
    })
  } catch (error: any) {
    console.error('Public Sliders error:', error)
    return NextResponse.json(
      { ok: false, message: 'Slider\'lar getirilemedi', error: error.message },
      { status: 500 }
    )
  }
}
