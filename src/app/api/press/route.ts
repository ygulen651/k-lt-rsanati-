import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import PressItem from '@/models/PressItem'
import jwt from 'jsonwebtoken'
import fs from 'fs'
import path from 'path'
import { v2 as cloudinary } from 'cloudinary'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Cloudinary config (varsa)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// GET /api/press
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const type = searchParams.get('type')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const category = searchParams.get('category')

    const query: any = {}
    if (type && type !== 'all') query.type = type
    if (status && status !== 'all') query.status = status
    if (search) query.$text = { $search: search }
    if (category && category !== 'all') query.category = category

    const items = await PressItem.find(query).sort({ date: -1 }).lean()

    return NextResponse.json({ success: true, data: items })
  } catch (error) {
    console.error('Press GET error:', error)
    return NextResponse.json({ success: false, message: 'Basın içerikleri alınamadı' }, { status: 500 })
  }
}

// POST /api/press
export async function POST(request: NextRequest) {
  try {
    // Auth
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    try { jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') } catch { return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 }) }

    await connectDB()

    // FormData ile dosya ve alanları al
    const form = await request.formData()
    const title = form.get('title') as string
    const type = form.get('type') as string
    const outlet = form.get('outlet') as string
    const date = form.get('date') as string
    const status = (form.get('status') as string) || 'published'
    const url = (form.get('url') as string) || ''
    const summary = (form.get('summary') as string) || ''
    const category = (form.get('category') as string) || ''
    const thumbnailUrl = (form.get('thumbnailUrl') as string) || ''
    const thumbnailFile = form.get('thumbnailFile') as File | null
    const imageFiles = form.getAll('images') as File[]
    const file = form.get('file') as File | null

    if (!title || !type || !outlet || !date) {
      return NextResponse.json({ success: false, message: 'Başlık, tür, kaynak ve tarih zorunlu' }, { status: 400 })
    }

    let finalThumbnail = thumbnailUrl
    const uploadedImages: string[] = []
    let fileUrl: string | undefined = undefined

    // Cloudinary bilgileri mevcutsa kullan, yoksa local uploads
    const cloudinaryEnabled = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
    if (thumbnailFile) {
      const bytes = await thumbnailFile.arrayBuffer()
      const buffer = Buffer.from(bytes)
      if (cloudinaryEnabled) {
        const uploadRes = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'sendika-press' }, (err, res) => {
            if (err) reject(err); else resolve(res)
          }).end(buffer)
        })
        // @ts-ignore
        finalThumbnail = uploadRes.secure_url
      } else {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
        const safeName = `${Date.now()}-${(thumbnailFile.name || 'thumb').replace(/[^a-zA-Z0-9_.-çÇğĞıİöÖşŞüÜ\s]/g, '')}`
        const filePath = path.join(uploadsDir, safeName)
        fs.writeFileSync(filePath, buffer)
        finalThumbnail = `/uploads/${safeName}`
      }
    }

    // Çoklu görsel yükleme (1-8 arası)
    if (imageFiles && imageFiles.length > 0) {
      if (imageFiles.length > 8) {
        return NextResponse.json({ success: false, message: 'En fazla 8 görsel yükleyebilirsiniz' }, { status: 400 })
      }
      for (const img of imageFiles) {
        // Boş girişleri atla
        // @ts-ignore
        if (!img || typeof img.arrayBuffer !== 'function') continue
        const ib = await img.arrayBuffer()
        const ibuf = Buffer.from(ib)
        if (cloudinaryEnabled) {
          const up = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'sendika-press', resource_type: 'image' }, (err, res) => {
              if (err) reject(err); else resolve(res)
            }).end(ibuf)
          })
          // @ts-ignore
          uploadedImages.push(up.secure_url)
        } else {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
          if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
          const safeName = `${Date.now()}-${(img.name || 'image').replace(/[^a-zA-Z0-9_.-çÇğĞıİöÖşŞüÜ\s]/g, '')}`
          const filePath = path.join(uploadsDir, safeName)
          fs.writeFileSync(filePath, ibuf)
          uploadedImages.push(`/uploads/${safeName}`)
        }
      }
    }

    // Ana dosya (PDF/video/ses vb.) yükle
    if (file) {
      const fileBytes = await file.arrayBuffer()
      const fileBuffer = Buffer.from(fileBytes)
      if (cloudinaryEnabled) {
        const uploadRes = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'sendika-press', resource_type: 'auto' }, (err, res) => {
            if (err) reject(err); else resolve(res)
          }).end(fileBuffer)
        })
        // @ts-ignore
        fileUrl = uploadRes.secure_url
      } else {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
        const safeName = `${Date.now()}-${(file.name || 'press-file').replace(/[^a-zA-Z0-9_.-çÇğĞıİöÖşŞüÜ\s]/g, '')}`
        const filePath = path.join(uploadsDir, safeName)
        fs.writeFileSync(filePath, fileBuffer)
        fileUrl = `/uploads/${safeName}`
      }
    }

    // Dosya yükleme opsiyonel: fileUrl da url de olmasa da kayıt oluşturulabilir

    const created = await PressItem.create({
      title,
      type,
      outlet,
      date: new Date(date),
      status,
      url: url || undefined,
      fileUrl,
      thumbnail: finalThumbnail || undefined,
      images: uploadedImages,
      summary,
      category
    })

    return NextResponse.json({ success: true, data: created }, { status: 201 })
  } catch (error) {
    console.error('Press POST error:', error)
    return NextResponse.json({ success: false, message: 'Basın içeriği oluşturulamadı' }, { status: 500 })
  }
}
