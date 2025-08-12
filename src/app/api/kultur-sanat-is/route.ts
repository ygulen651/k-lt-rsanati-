import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import KamuAr from '@/models/KamuAr'
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
    const search = searchParams.get('search') || ''

    const query: any = { status, category: 'kultur-sanat-is' }
    if (search) query.$text = { $search: search }

    const items = await KamuAr.find(query).sort({ publishDate: -1 }).lean()
    return NextResponse.json({ success: true, data: items })
  } catch (e) {
    return NextResponse.json({ success: false, message: 'Kültür Sanat-İş içerikleri alınamadı' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    try { jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') } catch { return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 }) }

    await connectDB()

    const contentType = request.headers.get('content-type') || ''
    let title = ''
    let slug = ''
    let excerpt = ''
    let content = ''
    let tags: string[] = []
    let featured = false
    let publishDate = ''
    let coverImageUrl = ''
    let coverImageFile: File | null = null
    let imageFiles: File[] = []
    let file: File | null = null

    if (contentType.includes('multipart/form-data')) {
      const form = await request.formData()
      title = (form.get('title') as string) || ''
      slug = (form.get('slug') as string) || title?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      excerpt = (form.get('excerpt') as string) || ''
      content = (form.get('content') as string) || ''
      tags = ((form.get('tags') as string) || '').split(',').map(t => t.trim()).filter(Boolean)
      featured = (form.get('featured') as string) === 'true'
      publishDate = (form.get('publishDate') as string) || ''
      coverImageUrl = (form.get('coverImageUrl') as string) || ''
      coverImageFile = form.get('coverImageFile') as File | null
      imageFiles = form.getAll('images') as File[]
      file = form.get('file') as File | null
    } else {
      const body = await request.json()
      title = body.title || ''
      slug = body.slug || title?.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-')
      excerpt = body.excerpt || ''
      content = body.content || ''
      tags = (body.tags || []).map((t: string) => String(t)).filter(Boolean)
      featured = !!body.featured
      publishDate = body.publishDate || ''
      coverImageUrl = body.coverImage || body.coverImageUrl || ''
      // JSON modunda dosya yüklemiyoruz
    }

    const cloudinaryEnabled = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)

    const uploadedImages: string[] = []
    let coverImage = coverImageUrl || ''
    let fileUrl: string | undefined

    const writeLocal = (buf: Buffer, name: string) => {
      const uploads = path.join(process.cwd(), 'public', 'uploads')
      if (!fs.existsSync(uploads)) fs.mkdirSync(uploads, { recursive: true })
      const safe = `${Date.now()}-${name.replace(/[^a-zA-Z0-9_.-çÇğĞıİöÖşŞüÜ\s]/g, '')}`
      const p = path.join(uploads, safe)
      fs.writeFileSync(p, buf)
      return `/uploads/${safe}`
    }

    if (coverImageFile) {
      const buf = Buffer.from(await coverImageFile.arrayBuffer())
      if (cloudinaryEnabled) {
        const up: any = await new Promise((res, rej) => cloudinary.uploader.upload_stream({ folder: 'sendika-kultur-sanat-is', resource_type: 'image' }, (e, r) => e ? rej(e) : res(r)).end(buf))
        coverImage = up.secure_url
      } else {
        coverImage = writeLocal(buf, coverImageFile.name || 'cover.jpg')
      }
    }

    if (imageFiles && imageFiles.length) {
      for (const img of imageFiles.slice(0, 8)) {
        // @ts-ignore
        if (!img || typeof img.arrayBuffer !== 'function') continue
        const buf = Buffer.from(await img.arrayBuffer())
        if (cloudinaryEnabled) {
          const up: any = await new Promise((res, rej) => cloudinary.uploader.upload_stream({ folder: 'sendika-kultur-sanat-is', resource_type: 'image' }, (e, r) => e ? rej(e) : res(r)).end(buf))
          uploadedImages.push(up.secure_url)
        } else {
          uploadedImages.push(writeLocal(buf, img.name || 'image.jpg'))
        }
      }
    }

    if (file) {
      const buf = Buffer.from(await file.arrayBuffer())
      if (cloudinaryEnabled) {
        const up: any = await new Promise((res, rej) => cloudinary.uploader.upload_stream({ folder: 'sendika-kultur-sanat-is', resource_type: 'auto' }, (e, r) => e ? rej(e) : res(r)).end(buf))
        fileUrl = up.secure_url
      } else {
        fileUrl = writeLocal(buf, file.name || 'file')
      }
    }

    try {
      const created = await KamuAr.create({
        title, slug, excerpt, content,
        category: 'kultur-sanat-is',
        tags,
        coverImage: coverImage || undefined,
        images: uploadedImages,
        fileUrl,
        featured,
        publishDate: publishDate ? new Date(publishDate) : new Date()
      })
      return NextResponse.json({ success: true, data: created }, { status: 201 })
    } catch (err: any) {
      if (err?.code === 11000) {
        return NextResponse.json({ success: false, message: 'Bu slug zaten mevcut' }, { status: 400 })
      }
      throw err
    }
  } catch (e) {
    console.error('Kültür Sanat-İş POST error:', e)
    return NextResponse.json({ success: false, message: 'Kayıt oluşturulamadı' }, { status: 500 })
  }
}
