import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import User from '@/models/User'
import { generateToken } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    const { email, password } = await request.json()
    
    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'E-posta ve şifre gereklidir' },
        { status: 400 }
      )
    }
    
    // Kullanıcıyı bul (şifre dahil)
    const user = await User.findOne({ email }).select('+password')
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      )
    }
    
    // Kullanıcının aktif olup olmadığını kontrol et
    if (!user.isActive) {
      return NextResponse.json(
        { success: false, message: 'Hesabınız deaktif edilmiş' },
        { status: 401 }
      )
    }
    
    // Şifre kontrolü
    const isPasswordValid = await user.comparePassword(password)
    
    if (!isPasswordValid) {
      return NextResponse.json(
        { success: false, message: 'Geçersiz e-posta veya şifre' },
        { status: 401 }
      )
    }
    
    // Son giriş tarihini güncelle
    user.lastLogin = new Date()
    await user.save()
    
    // JWT token oluştur
    const token = generateToken(user)
    
    // Kullanıcı bilgilerini hazırla (şifre olmadan)
    const userData = {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role,
      lastLogin: user.lastLogin
    }
    
    // Response oluştur
    const response = NextResponse.json({
      success: true,
      message: 'Giriş başarılı',
      data: {
        user: userData,
        token
      }
    })
    
    // Cookie'ye token'ı ekle
    response.cookies.set('auth-token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 gün
    })
    
    return response
    
  } catch (error: any) {
    console.error('Login error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
