import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Member from '@/models/Member'
import jwt from 'jsonwebtoken'

// GET - Üye detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    await connectDB()

    const { id } = await params
    const member = await Member.findById(id)
    
    if (!member) {
      return NextResponse.json({
        success: false,
        message: 'Üye bulunamadı'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: member
    })

  } catch (error) {
    console.error('Member GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// PUT - Üye güncelle
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    await connectDB()

    const updateData = await request.json()

    // E-posta benzersizlik kontrolü (sadece değiştiriliyorsa)
    const { id } = await params
    if (updateData.email) {
      const existingMember = await Member.findOne({ 
        email: updateData.email, 
        _id: { $ne: id } 
      })
      if (existingMember) {
        return NextResponse.json({
          success: false,
          message: 'Bu e-posta adresi zaten kullanımda'
        }, { status: 400 })
      }
    }

    // TC Kimlik benzersizlik kontrolü (sadece değiştiriliyorsa)
    if (updateData.tcNumber) {
      const existingTC = await Member.findOne({ 
        tcNumber: updateData.tcNumber, 
        _id: { $ne: id } 
      })
      if (existingTC) {
        return NextResponse.json({
          success: false,
          message: 'Bu TC Kimlik numarası zaten kayıtlı'
        }, { status: 400 })
      }
    }

    const updatedMember = await Member.findByIdAndUpdate(
      id,
      { ...updateData, updatedAt: new Date() },
      { new: true }
    )

    if (!updatedMember) {
      return NextResponse.json({
        success: false,
        message: 'Üye bulunamadı'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Üye güncellendi',
      data: updatedMember
    })

  } catch (error) {
    console.error('Member PUT error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// DELETE - Üye sil
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    await connectDB()

    const { id } = await params
    const deletedMember = await Member.findByIdAndDelete(id)

    if (!deletedMember) {
      return NextResponse.json({
        success: false,
        message: 'Üye bulunamadı'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Üye silindi'
    })

  } catch (error) {
    console.error('Member DELETE error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}