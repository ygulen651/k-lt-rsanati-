import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Slider from '@/models/Slider'
import { authenticate, requireEditor } from '@/lib/auth'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    await connectDB()

    const { id } = await params
    const slider = await Slider.findById(id)
    
    if (!slider) {
      return NextResponse.json(
        { success: false, message: 'Slider bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: slider
    })
  } catch (error: any) {
    console.error('Error fetching slider:', error)
    return NextResponse.json(
      { success: false, message: 'Slider getirilemedi', error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    // Mevcut slider'ı bul
    const { id } = await params
    const existingSlider = await Slider.findById(id)
    if (!existingSlider) {
      return NextResponse.json(
        { success: false, message: 'Slider bulunamadı' },
        { status: 404 }
      )
    }

    // Güncelle
    const updatedSlider = await Slider.findByIdAndUpdate(
      id,
      {
        title: body.title || existingSlider.title,
        subtitle: body.subtitle,
        description: body.description,
        image: body.image || existingSlider.image,
        buttonText: body.buttonText,
        buttonLink: body.buttonLink,
        order: body.order !== undefined ? body.order : existingSlider.order,
        isActive: body.isActive !== undefined ? body.isActive : existingSlider.isActive,
        backgroundColor: body.backgroundColor || existingSlider.backgroundColor,
        textColor: body.textColor || existingSlider.textColor,
        updatedAt: new Date()
      },
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Slider başarıyla güncellendi',
      data: updatedSlider
    })

  } catch (error: any) {
    console.error('Error updating slider:', error)

    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, message: 'Doğrulama hatası', errors },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { success: false, message: 'Slider güncellenemedi', error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
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

    const { id } = await params
    const slider = await Slider.findByIdAndDelete(id)
    
    if (!slider) {
      return NextResponse.json(
        { success: false, message: 'Slider bulunamadı' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Slider başarıyla silindi'
    })

  } catch (error: any) {
    console.error('Error deleting slider:', error)
    return NextResponse.json(
      { success: false, message: 'Slider silinemedi', error: error.message },
      { status: 500 }
    )
  }
}
