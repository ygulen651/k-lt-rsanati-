import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Media from '@/models/Media'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') || 'published'
    const category = searchParams.get('category') || undefined
    const search = searchParams.get('search') || ''

    const query: any = { status }
    if (category) query.category = category
    if (search) query.$text = { $search: search }

    const items = await Media.find(query).sort({ uploadDate: -1 }).lean()
    return NextResponse.json({ success: true, data: items })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Medya listesi alınamadı' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    try { jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') } catch { return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 }) }

    await connectDB()

    const contentType = request.headers.get('content-type') || ''
    let created

    const writeLocal = (buf: Buffer, name: string) => {
      const uploads = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true })
      const safe = `${Date.now()}-${name.replace(/[^a-zA-Z0-9_.-çÇğĞıİöÖşŞüÜ\s]/g, '')}`
      const p = path.join(uploads, safe)
      fs.writeFileSync(p, buf)
      return `/uploads/${safe}`
    }

    const cloudinaryEnabled = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      const title = (form.get('title') as string) || 'Medya'
      const type = (form.get('type') as 'image' | 'video') || 'image'
      const category = (form.get('category') as string) || 'Genel'
      const tags = ((form.get('tags') as string) || '').split(',').map(t => t.trim()).filter(Boolean)

      const file = form.get('file') as File | null
      if (!file) return NextResponse.json({ success: false, message: 'Dosya gerekli' }, { status: 400 })

      const buf = Buffer.from(await file.arrayBuffer())
      let url = ''
      let thumbnail: string | undefined

      if (cloudinaryEnabled) {
        const up: any = await new Promise((res, rej) => cloudinary.uploader.upload_stream({ folder: 'sendika-media', resource_type: 'auto' }, (e, r) => e ? rej(e) : res(r)).end(buf))
        url = up.secure_url
        if (type === 'image') thumbnail = up.secure_url
      } else {
        url = writeLocal(buf, file.name || 'media')
        if (type === 'image') thumbnail = url
      }

      created = await Media.create({ title, type, url, thumbnail, category, tags, status: 'published' })
    } else {
      const body = await request.json()
      created = await Media.create({
        title: body.title,
        type: body.type,
        url: body.url,
        thumbnail: body.thumbnail,
        category: body.category || 'Genel',
        tags: body.tags || [],
        status: body.status || 'published'
      })
    }

    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (e) {
    console.error('MEDIA POST error:', e)
    return NextResponse.json({ success: false, message: 'Medya yüklenemedi' }, { status: 500 })
  }
}

