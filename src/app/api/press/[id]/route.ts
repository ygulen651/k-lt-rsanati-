import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import PressItem from '@/models/PressItem'
import jwt from 'jsonwebtoken'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// GET /api/press/[id]
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    await connectDB()
    const item = await PressItem.findById(id)
    if (!item) return NextResponse.json({ success: false, message: 'Kayıt bulunamadı' }, { status: 404 })
    return NextResponse.json({ success: true, data: item })
  } catch (error) {
    console.error('Press GET by id error:', error)
    return NextResponse.json({ success: false, message: 'Kayıt alınamadı' }, { status: 500 })
  }
}

// PUT /api/press/[id]
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    try { jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') } catch { return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 }) }

    const { id } = await params
    await connectDB()
    const body = await request.json()

    const updated = await PressItem.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!updated) return NextResponse.json({ success: false, message: 'Kayıt bulunamadı' }, { status: 404 })

    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Press PUT error:', error)
    return NextResponse.json({ success: false, message: 'Güncelleme başarısız' }, { status: 500 })
  }
}

// DELETE /api/press/[id]
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    try { jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') } catch { return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 }) }

    const { id } = await params
    await connectDB()
    const deleted = await PressItem.findByIdAndDelete(id)
    if (!deleted) return NextResponse.json({ success: false, message: 'Kayıt bulunamadı' }, { status: 404 })

    return NextResponse.json({ success: true, message: 'Silindi' })
  } catch (error) {
    console.error('Press DELETE error:', error)
    return NextResponse.json({ success: false, message: 'Silme başarısız' }, { status: 500 })
  }
}


