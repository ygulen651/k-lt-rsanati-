import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  // Sadece admin yollarını koru
  const { pathname } = request.nextUrl
  
  // Admin sayfaları ve API'leri koru
  if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
    // Burada authentication kontrolü yapılabilir
    // Şimdilik sadece geçiş yapıyoruz
    return NextResponse.next()
  }
  
  // Public endpoint'ler ve sayfalar için hiçbir şey yapma
  return NextResponse.next()
}

export const config = {
  matcher: [
    // Sadece admin yollarını koru
    '/admin/:path*',
    '/api/admin/:path*'
  ]
}
