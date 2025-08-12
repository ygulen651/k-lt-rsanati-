import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import KamuAr from '@/models/KamuAr'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const { slug } = await params
    await connectDB()
    const item = await KamuAr.findOne({ slug })
    if (!item) return NextResponse.json({ success: false, message: 'Bulunamadı' }, { status: 404 })
    return NextResponse.json({ success: true, data: item })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Kayıt getirilemedi' }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    try { jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') } catch { return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 }) }

    const { slug } = await params
    await connectDB()
    const body = await request.json()
    const updated = await KamuAr.findOneAndUpdate({ slug }, body, { new: true, runValidators: true })
    if (!updated) return NextResponse.json({ success: false, message: 'Bulunamadı' }, { status: 404 })
    return NextResponse.json({ success: true, data: updated })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Güncelleme başarısız' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    try { jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') } catch { return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 }) }

    const { slug } = await params
    await connectDB()
    const deleted = await KamuAr.findOneAndDelete({ slug })
    if (!deleted) return NextResponse.json({ success: false, message: 'Bulunamadı' }, { status: 404 })
    return NextResponse.json({ success: true, message: 'Silindi' })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Silme başarısız' }, { status: 500 })
  }
}


