import jwt from 'jsonwebtoken'
import { NextRequest } from 'next/server'
import User, { IUser } from '@/models/User'
import connectDB from '@/lib/mongodb'

const JWT_SECRET = process.env.JWT_SECRET!

if (!JWT_SECRET) {
  throw new Error('JWT_SECRET environment değişkeni tanımlanmamış')
}

export interface AuthUser {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
}

/**
 * JWT token oluşturur
 */
export function generateToken(user: IUser): string {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      name: user.name,
      role: user.role
    },
    JWT_SECRET,
    { expiresIn: '7d' }
  )
}

/**
 * JWT token'ı doğrular
 */
export function verifyToken(token: string): AuthUser | null {
  try {
    const decoded = jwt.verify(token, JWT_SECRET) as AuthUser
    return decoded
  } catch (error) {
    return null
  }
}

/**
 * Request'ten token'ı çıkarır
 */
export function extractToken(request: NextRequest): string | null {
  const authHeader = request.headers.get('Authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    return authHeader.substring(7)
  }
  
  // Cookie'den de kontrol et
  const tokenCookie = request.cookies.get('auth-token')
  if (tokenCookie) {
    return tokenCookie.value
  }
  
  return null
}

/**
 * Kullanıcı kimlik doğrulaması yapar
 */
export async function authenticate(request: NextRequest): Promise<AuthUser | null> {
  const token = extractToken(request)
  if (!token) {
    return null
  }
  
  const user = verifyToken(token)
  if (!user) {
    return null
  }
  
  // Kullanıcının hala aktif olduğunu kontrol et
  try {
    await connectDB()
    const dbUser = await User.findById(user.id).select('isActive role')
    if (!dbUser || !dbUser.isActive) {
      return null
    }
    
    return user
  } catch (error) {
    console.error('Auth kontrol hatası:', error)
    return null
  }
}

/**
 * Yetki kontrolü yapar
 */
export function hasPermission(userRole: string, requiredRole: string): boolean {
  const roleHierarchy = {
    'admin': 3,
    'editor': 2,
    'viewer': 1
  }
  
  return roleHierarchy[userRole as keyof typeof roleHierarchy] >= roleHierarchy[requiredRole as keyof typeof roleHierarchy]
}

/**
 * Admin yetkisi kontrolü
 */
export function requireAdmin(user: AuthUser | null): boolean {
  return user?.role === 'admin'
}

/**
 * Editor veya üstü yetki kontrolü
 */
export function requireEditor(user: AuthUser | null): boolean {
  return user ? hasPermission(user.role, 'editor') : false
}

/**
 * Herhangi bir yetki kontrolü
 */
export function requireAuth(user: AuthUser | null): boolean {
  return user ? hasPermission(user.role, 'viewer') : false
}
