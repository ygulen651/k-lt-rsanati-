import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import KamuAr from '@/models/KamuAr'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'
    const search = searchParams.get('search') || ''

    // Kültür Sanat-İş içerikleri bu uçtan dönmesin
    const query: any = { status, category: { $ne: 'kultur-sanat-is' } }
    if (search) query.$text = { $search: search }

    const items = await KamuAr.find(query).sort({ publishDate: -1 }).lean()
    return NextResponse.json({ ok: true, data: items })
  } catch (e: any) {
    console.error('Public Kamu-Ar error:', e)
    return NextResponse.json({ ok: false, message: 'Kamu-Ar içerikleri alınamadı' }, { status: 500 })
  }
}
