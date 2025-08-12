import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'
import connectDB from '@/lib/mongodb'
import BoardMember from '@/models/BoardMember'

const GROUP = 'merkez-disiplin-kurulu'
const STORAGE = path.join(process.cwd(), 'content', 'yonetim', 'yonetim-kurulu.json')

export async function GET() {
  try {
    await connectDB()
    const dbMembers = await BoardMember.find({ group: GROUP }).sort({ order: 1, createdAt: 1 }).lean()
    if (dbMembers.length > 0) return NextResponse.json({ success: true, data: dbMembers })
    if (fs.existsSync(STORAGE)) {
      const fileContents = fs.readFileSync(STORAGE, 'utf8')
      const all = JSON.parse(fileContents)
      const filtered = Array.isArray(all) ? all.filter((m: any) => (m?.group || '') === GROUP) : []
      return NextResponse.json({ success: true, data: filtered })
    }
    return NextResponse.json({ success: true, data: [] })
  } catch (error) {
    console.error('Boards GET error:', error)
    return NextResponse.json({ success: false, message: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    }
    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    const body = await request.json()
    await connectDB()
    const exists = await BoardMember.findOne({ name: body.name, position: body.position, group: GROUP })
    if (exists) return NextResponse.json({ success: true, data: exists })
    const created = await BoardMember.create({
      name: body.name || '',
      position: body.position || '',
      bio: body.bio || '',
      photo: body.photo || '',
      email: body.email || '',
      phone: body.phone || '',
      group: GROUP,
      order: body.order || 0
    })
    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error) {
    console.error('Boards POST error:', error)
    return NextResponse.json({ success: false, message: 'Sunucu hatası' }, { status: 500 })
  }
}

