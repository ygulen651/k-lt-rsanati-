import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import AdminUser from '@/models/AdminUser'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

// GET - Admin kullanıcıları listele
export async function GET(request: NextRequest) {
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

    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')

    let query: any = {}

    if (role && role !== 'all') {
      query.role = role
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ]
    }

    const adminUsers = await AdminUser.find(query)
      .select('-password')
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: adminUsers
    })

  } catch (error) {
    console.error('Admin users GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// POST - Yeni admin kullanıcısı oluştur
export async function POST(request: NextRequest) {
  try {
    // Auth kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
      
      // Sadece admin kullanıcı oluşturabilir
      const currentUser = await AdminUser.findById(decoded.userId)
      if (!currentUser || currentUser.role !== 'admin') {
        return NextResponse.json({ 
          success: false, 
          message: 'Bu işlem için yönetici yetkisi gerekli' 
        }, { status: 403 })
      }
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    await connectDB()

    const { name, email, password, role } = await request.json()

    // Validasyon
    if (!name || !email || !password || !role) {
      return NextResponse.json({
        success: false,
        message: 'Tüm alanları doldurun'
      }, { status: 400 })
    }

    if (password.length < 6) {
      return NextResponse.json({
        success: false,
        message: 'Şifre en az 6 karakter olmalıdır'
      }, { status: 400 })
    }

    // E-posta kontrolü
    const existingUser = await AdminUser.findOne({ email })
    if (existingUser) {
      return NextResponse.json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanımda'
      }, { status: 400 })
    }

    // Şifreyi hashle
    const hashedPassword = await bcrypt.hash(password, 12)

    // Yeni kullanıcı oluştur
    const newUser = new AdminUser({
      name,
      email,
      password: hashedPassword,
      role
    })

    await newUser.save()

    // Şifreyi response'dan çıkar
    const { password: _, ...userWithoutPassword } = newUser.toObject()

    return NextResponse.json({
      success: true,
      message: 'Kullanıcı başarıyla oluşturuldu',
      data: userWithoutPassword
    }, { status: 201 })

  } catch (error) {
    console.error('Admin user POST error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}