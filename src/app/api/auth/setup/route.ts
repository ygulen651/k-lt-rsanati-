import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import AdminUser from '@/models/AdminUser'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Zaten admin kullanıcı var mı kontrol et
    const existingAdmin = await AdminUser.findOne({ role: 'admin' })
    
    if (existingAdmin) {
      return NextResponse.json(
        { success: false, message: 'Admin kullanıcı zaten mevcut' },
        { status: 400 }
      )
    }
    
    // Environment değişkenlerinden admin bilgilerini al
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@sendika.com'
    const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
    
    // Şifreyi hash'le
    const hashedPassword = await bcrypt.hash(adminPassword, 12)
    
    // Admin kullanıcı oluştur
    const adminUser = new AdminUser({
      email: adminEmail,
      password: hashedPassword,
      name: 'Sistem Yöneticisi',
      role: 'admin',
      isActive: true
    })
    
    await adminUser.save()
    
    return NextResponse.json({
      success: true,
      message: 'Admin kullanıcı başarıyla oluşturuldu',
      data: {
        email: adminEmail,
        name: 'Sistem Yöneticisi',
        role: 'admin'
      }
    })
    
  } catch (error: any) {
    console.error('Setup error:', error)
    
    // Duplicate key error kontrolü
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Bu e-posta adresi zaten kullanımda' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
