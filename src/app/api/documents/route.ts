import { NextRequest, NextResponse } from 'next/server'

// Bu route kesinlikle Node.js runtime'da çalışmalı (Cloudinary için gerekli)
export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'
import { connectDB } from '@/lib/mongodb'
import Document from '@/models/Document'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

// Cloudinary yapılandırması (varsa)
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// GET - Belge listesi
export async function GET(request: NextRequest) {
  try {
    await connectDB()

    const { searchParams } = new URL(request.url)
    const category = searchParams.get('category')
    const status = searchParams.get('status')
    const search = searchParams.get('search')
    const showPrivate = searchParams.get('showPrivate') === 'true'

    // Query oluştur
    let query: any = {}
    
    if (category && category !== 'Tümü') {
      query.category = category
    }
    
    if (status && status !== 'all') {
      query.status = status
    }
    
    if (!showPrivate) {
      query.isPrivate = false
    }
    
    if (search) {
      query.$text = { $search: search }
    }

    const documents = await Document.find(query)
      .sort({ uploadDate: -1 })
      .lean()

    // Dosya boyutunu formatla
    const formattedDocuments = documents.map(doc => ({
      ...doc,
      size: formatFileSize(doc.fileSize),
      uploadDate: doc.uploadDate.toISOString().split('T')[0],
      lastModified: doc.lastModified.toISOString().split('T')[0],
      type: doc.fileName.split('.').pop()?.toLowerCase()
    }))

    return NextResponse.json({
      success: true,
      data: formattedDocuments
    })

  } catch (error) {
    console.error('Documents GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Belgeler yüklenirken hata oluştu'
    }, { status: 500 })
  }
}

// POST - Yeni belge ekleme
export async function POST(request: NextRequest) {
  try {
    console.log('📄 POST /api/documents - Başlangıç')
    
    // Auth kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      console.log('❌ Token yok')
      return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
      console.log('✅ Token doğrulandı')
    } catch (error) {
      console.log('❌ Token geçersiz:', error)
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    console.log('🔌 MongoDB bağlanıyor...')
    await connectDB()
    console.log('✅ MongoDB bağlantısı başarılı')

    console.log('📋 FormData alınıyor...')
    const formData = await request.formData()
    const title = formData.get('title') as string
    const category = formData.get('category') as string
    const description = formData.get('description') as string || ''
    const tags = formData.get('tags') as string
    const isPrivate = formData.get('isPrivate') === 'true'
    const file = formData.get('file') as File

    console.log('📝 Form verileri:', { title, category, fileName: file?.name, fileSize: file?.size })

    // Validasyon
    if (!title || !category || !file) {
      console.log('❌ Validasyon hatası - eksik alan')
      return NextResponse.json({
        success: false,
        message: 'Başlık, kategori ve dosya zorunludur'
      }, { status: 400 })
    }

    // Dosya boyutu kontrolü (10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json({
        success: false,
        message: 'Dosya boyutu 10MB\'dan küçük olmalıdır'
      }, { status: 400 })
    }

    // Dosya baytlarını hazırla
    const bytes = await file.arrayBuffer()
    const buffer = Buffer.from(bytes)

    // Önce Cloudinary dene, olmazsa public/uploads'a kaydet
    let fileUrl: string | null = null
    const cloudinaryEnabled = !!(
      process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
    )

    if (cloudinaryEnabled) {
      console.log('☁️ Cloudinary yükleme başlıyor...')
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          cloudinary.uploader.upload_stream(
            {
              resource_type: 'auto',
              folder: 'sendika-documents',
              public_id: `${Date.now()}-${file.name.replace(/\.[^/.]+$/, '')}`
            },
            (error, result) => {
              if (error) {
                reject(error)
              } else {
                resolve(result)
              }
            }
          ).end(buffer)
        })
        const cloudinaryResult = uploadResult as any
        fileUrl = cloudinaryResult.secure_url
        console.log('✅ Cloudinary yükleme başarılı:', fileUrl)
      } catch (err) {
        console.log('❌ Cloudinary yükleme başarısız, yerel kayda geçiliyor:', err)
      }
    } else {
      console.log('ℹ️ Cloudinary devre dışı, yerel kayda geçiliyor')
    }

    if (!fileUrl) {
      // Local fallback: public/uploads
      const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
      try {
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true })
        }
        const sanitizedBase = file.name.replace(/[^a-zA-Z0-9_.-çÇğĞıİöÖşŞüÜ\s]/g, '')
        const uniqueName = `${Date.now()}-${sanitizedBase}`
        const filePath = path.join(uploadsDir, uniqueName)
        fs.writeFileSync(filePath, buffer)
        fileUrl = `/uploads/${uniqueName}`
        console.log('✅ Yerel kaydetme başarılı:', fileUrl)
      } catch (localErr) {
        console.error('❌ Yerel kaydetme hatası:', localErr)
        throw localErr
      }
    }

    // Belgeyi veritabanına kaydet
    console.log('💾 Veritabanına kaydediliyor...')
    const newDocument = new Document({
      title,
      category,
      description,
      tags: tags ? tags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
      fileName: file.name,
      fileType: file.type,
      fileSize: file.size,
      fileUrl: fileUrl!,
      isPrivate
    })

    await newDocument.save()
    console.log('✅ Belge veritabanına kaydedildi:', newDocument._id)

    return NextResponse.json({
      success: true,
      message: 'Belge başarıyla yüklendi',
      data: {
        ...newDocument.toObject(),
        size: formatFileSize(newDocument.fileSize),
        uploadDate: newDocument.uploadDate.toISOString().split('T')[0],
        lastModified: newDocument.lastModified.toISOString().split('T')[0],
        type: file.name.split('.').pop()?.toLowerCase()
      }
    }, { status: 201 })

  } catch (error) {
    console.error('❌ Documents POST error:', error)
    console.error('❌ Error stack:', error instanceof Error ? error.stack : 'No stack trace')
    return NextResponse.json({
      success: false,
      message: 'Belge yüklenirken hata oluştu: ' + (error instanceof Error ? error.message : 'Bilinmeyen hata')
    }, { status: 500 })
  }
}

// Dosya boyutu formatlama fonksiyonu
function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
