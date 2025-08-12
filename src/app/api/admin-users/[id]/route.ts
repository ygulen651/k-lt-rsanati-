import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminUser from '@/models/AdminUser'
import jwt from 'jsonwebtoken'

// GET - Admin kullanıcısı detayı
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
    const adminUser = await AdminUser.findById(id).select('-password')
    
    if (!adminUser) {
      return NextResponse.json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: adminUser
    })

  } catch (error) {
    console.error('Admin user GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// PUT - Admin kullanıcısı güncelle
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
      
      // Sadece admin güncelleyebilir veya kullanıcı kendi profilini güncelleyebilir
      const { id } = await params
      const currentUser = await AdminUser.findById(decoded.userId)
      if (!currentUser || (currentUser.role !== 'admin' && currentUser._id.toString() !== id)) {
        return NextResponse.json({ 
          success: false, 
          message: 'Bu işlem için yetki gerekli' 
        }, { status: 403 })
      }
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    await connectDB()

    const updateData = await request.json()
    
    // Şifre güncelleniyorsa hashle
    if (updateData.password) {
      const bcrypt = require('bcryptjs')
      updateData.password = await bcrypt.hash(updateData.password, 12)
    }

    const updatedUser = await AdminUser.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    ).select('-password')

    if (!updatedUser) {
      return NextResponse.json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı güncellendi',
      data: updatedUser
    })

  } catch (error) {
    console.error('Admin user PUT error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// DELETE - Admin kullanıcısı sil
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
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
      
      // Sadece admin silebilir
      const { id } = await params
      const currentUser = await AdminUser.findById(decoded.userId)
      if (!currentUser || currentUser.role !== 'admin') {
        return NextResponse.json({ 
          success: false, 
          message: 'Bu işlem için yönetici yetkisi gerekli' 
        }, { status: 403 })
      }

      // Kendi kendini silemez
      if (currentUser._id.toString() === id) {
        return NextResponse.json({ 
          success: false, 
          message: 'Kendi hesabınızı silemezsiniz' 
        }, { status: 400 })
      }
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    await connectDB()

    const deletedUser = await AdminUser.findByIdAndDelete(id)

    if (!deletedUser) {
      return NextResponse.json({
        success: false,
        message: 'Kullanıcı bulunamadı'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı silindi'
    })

  } catch (error) {
    console.error('Admin user DELETE error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}