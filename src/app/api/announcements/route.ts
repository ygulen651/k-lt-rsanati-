import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Announcement from '@/models/Announcement'
import { authenticate, requireEditor } from '@/lib/auth'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

export async function GET(request: NextRequest) {
  try {
    await connectDB()
    
    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const featured = searchParams.get('featured')
    const category = searchParams.get('category')
    const limit = parseInt(searchParams.get('limit') || '10')
    const page = parseInt(searchParams.get('page') || '1')
    
    // Query oluştur
    let query: any = {}
    
    if (status) {
      query.status = status
    }
    
    if (featured === 'true') {
      query.featured = true
    }
    
    if (category) {
      query.category = category
    }
    
    // Pagination hesapla
    const skip = (page - 1) * limit
    
    // Duyuruları getir
    const announcements = await Announcement.find(query)
      .sort({ publishDate: -1, createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean()
    
    // Toplam sayı
    const total = await Announcement.countDocuments(query)
    
    return NextResponse.json({
      success: true,
      data: announcements,
      pagination: {
        current: page,
        total: Math.ceil(total / limit),
        count: announcements.length,
        totalItems: total
      }
    })
  } catch (error: any) {
    console.error('Error fetching announcements:', error)
    return NextResponse.json(
      { success: false, message: 'Duyurular getirilemedi', error: error.message },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    await connectDB()
    
    // Kimlik doğrulama
    const user = await authenticate(request)
    if (!user || !requireEditor(user)) {
      return NextResponse.json(
        { success: false, message: 'Yetkisiz erişim' },
        { status: 401 }
      )
    }
    
    const contentType = request.headers.get('content-type') || ''
    const isFormData = contentType.includes('multipart/form-data')
    let body: any = {}
    let images: File[] = []
    let file: File | null = null
    let featuredImageFile: File | null = null
    if (isFormData) {
      const form = await request.formData()
      body.title = form.get('title') as string
      body.content = form.get('content') as string
      body.excerpt = form.get('excerpt') as string
      body.category = form.get('category') as string
      body.status = (form.get('status') as string) || 'draft'
      body.featured = (form.get('featured') as string) === 'true'
      body.publishDate = form.get('publishDate') as string
      body.tags = (form.get('tags') as string || '').split(',').map(t => t.trim()).filter(Boolean)
      body.featuredImage = form.get('featuredImage') as string
      featuredImageFile = form.get('featuredImageFile') as File | null
      images = form.getAll('images') as File[]
      file = form.get('file') as File | null
    } else {
      body = await request.json()
    }
    
    // Gerekli alanları kontrol et
    if (!body.title || !body.content) {
      console.log('Validation failed:', { title: body.title, content: body.content })
      return NextResponse.json(
        { success: false, message: 'Başlık ve içerik gereklidir' },
        { status: 400 }
      )
    }
    
    // Slug oluştur (Türkçe karakter desteği)
    let slug = body.slug
    if (!slug) {
      slug = body.title
        .toLowerCase()
        .replace(/ğ/g, 'g')
        .replace(/ü/g, 'u')
        .replace(/ş/g, 's')
        .replace(/ı/g, 'i')
        .replace(/ö/g, 'o')
        .replace(/ç/g, 'c')
        .replace(/[^a-z0-9\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/-+/g, '-')
        .trim()
    }
    
    // Benzersiz slug kontrolü
    let uniqueSlug = slug
    let counter = 1
    while (await Announcement.findOne({ slug: uniqueSlug })) {
      uniqueSlug = `${slug}-${counter}`
      counter++
    }
    
    // Yüklemeler (opsiyonel)
    const cloudinaryEnabled = !!(process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_API_KEY && process.env.CLOUDINARY_API_SECRET)
    let uploadedImages: string[] = []
    let fileUrl: string | undefined = undefined
    let featuredImageUrl: string | undefined = body.featuredImage || undefined
    // Öne çıkan görsel dosyası varsa yükle (URL yoksa veya dosya önceliği istenirse)
    if (featuredImageFile) {
      const fbuf = Buffer.from(await featuredImageFile.arrayBuffer())
      if (cloudinaryEnabled) {
        const fres = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'sendika-announcements', resource_type: 'image' }, (err, out) => {
            if (err) reject(err); else resolve(out)
          }).end(fbuf)
        })
        // @ts-ignore
        featuredImageUrl = fres.secure_url
      } else {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
        const safe = `${Date.now()}-${(featuredImageFile.name || 'featured').replace(/[^a-zA-Z0-9_.-çÇğĞıİöÖşŞüÜ\s]/g, '')}`
        const p = path.join(uploadsDir, safe)
        fs.writeFileSync(p, fbuf)
        featuredImageUrl = `/uploads/${safe}`
      }
    }

    if (images && images.length) {
      if (images.length > 8) {
        return NextResponse.json({ success: false, message: 'En fazla 8 görsel yükleyebilirsiniz' }, { status: 400 })
      }
      for (const img of images) {
        // @ts-ignore
        if (!img || typeof img.arrayBuffer !== 'function') continue
        const buf = Buffer.from(await img.arrayBuffer())
        if (cloudinaryEnabled) {
          const res = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ folder: 'sendika-announcements', resource_type: 'image' }, (err, out) => {
              if (err) reject(err); else resolve(out)
            }).end(buf)
          })
          // @ts-ignore
          uploadedImages.push(res.secure_url)
        } else {
          const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
          if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
          const safe = `${Date.now()}-${(img.name || 'image').replace(/[^a-zA-Z0-9_.-çÇğĞıİöÖşŞüÜ\s]/g, '')}`
          const p = path.join(uploadsDir, safe)
          fs.writeFileSync(p, buf)
          uploadedImages.push(`/uploads/${safe}`)
        }
      }
    }

    if (file) {
      const fbuf = Buffer.from(await file.arrayBuffer())
      if (cloudinaryEnabled) {
        const fres = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream({ folder: 'sendika-announcements', resource_type: 'auto' }, (err, out) => {
            if (err) reject(err); else resolve(out)
          }).end(fbuf)
        })
        // @ts-ignore
        fileUrl = fres.secure_url
      } else {
        const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
        if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true })
        const safe = `${Date.now()}-${(file.name || 'file').replace(/[^a-zA-Z0-9_.-çÇğĞıİöÖşŞüÜ\s]/g, '')}`
        const p = path.join(uploadsDir, safe)
        fs.writeFileSync(p, fbuf)
        fileUrl = `/uploads/${safe}`
      }
    }

    // Yeni duyuru oluştur
    const announcement = new Announcement({
      title: body.title,
      slug: uniqueSlug,
      excerpt: body.excerpt || body.content.substring(0, 200) + '...',
      content: body.content,
      category: body.category || 'genel',
      tags: body.tags || [],
      featuredImage: featuredImageUrl,
      images: uploadedImages,
      fileUrl,
      status: body.status || 'draft',
      featured: body.featured || false,
      publishDate: body.publishDate ? new Date(body.publishDate) : new Date(),
      author: user.name
    })
    
    await announcement.save()
    
    return NextResponse.json({
      success: true,
      message: 'Duyuru başarıyla oluşturuldu',
      data: announcement
    }, { status: 201 })
    
  } catch (error: any) {
    console.error('Error creating announcement:', error)
    
    // Validation error kontrolü
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, message: 'Doğrulama hatası', errors },
        { status: 400 }
      )
    }
    
    // Duplicate key error kontrolü
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Bu slug zaten kullanımda' },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Duyuru oluşturulamadı', error: error.message },
      { status: 500 }
    )
  }
}
