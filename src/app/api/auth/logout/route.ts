import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    // Response oluştur
    const response = NextResponse.json({
      success: true,
      message: 'Çıkış başarılı'
    })
    
    // Cookie'yi temizle
    response.cookies.set('auth-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 0 // Hemen sil
    })
    
    return response
    
  } catch (error: any) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { success: false, message: 'Sunucu hatası' },
      { status: 500 }
    )
  }
}
