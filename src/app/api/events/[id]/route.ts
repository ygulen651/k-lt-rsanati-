import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Event from '@/models/Event'
import { authenticate, requireEditor } from '@/lib/auth'

// Tek etkinlik getir
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()
    const event = await Event.findById(id)
    if (!event) {
      return NextResponse.json({ success: false, message: 'Etkinlik bulunamadı' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: event })
  } catch (error) {
    console.error('Error fetching event:', error)
    return NextResponse.json(
      { success: false, error: 'Etkinlik getirilemedi' },
      { status: 500 }
    )
  }
}

// Etkinlik güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const user = await authenticate(request)
    if (!user || !requireEditor(user)) {
      return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { id } = await params
    const body = await request.json()
    const updated = await Event.findByIdAndUpdate(id, body, { new: true, runValidators: true })
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Etkinlik bulunamadı' }, { status: 404 })
    }
    return NextResponse.json({ success: true, data: updated })
  } catch (error) {
    console.error('Error updating event:', error)
    return NextResponse.json(
      { success: false, error: 'Etkinlik güncellenemedi' },
      { status: 500 }
    )
  }
}

// Etkinlik sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    const user = await authenticate(request)
    if (!user || !requireEditor(user)) {
      return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
    }

    const { id } = await params
    const deleted = await Event.findByIdAndDelete(id)
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Etkinlik silinemedi' }, { status: 404 })
    }
    return NextResponse.json({ success: true, message: 'Etkinlik başarıyla silindi' })
  } catch (error) {
    console.error('Error deleting event:', error)
    return NextResponse.json(
      { success: false, error: 'Etkinlik silinemedi' },
      { status: 500 }
    )
  }
}

