import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Document from '@/models/Document'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'

// Cloudinary yapılandırması
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
})

// GET - Tek belge detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    await connectDB()

    const document = await Document.findById(id)
    
    if (!document) {
      return NextResponse.json({
        success: false,
        message: 'Belge bulunamadı'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: {
        ...document.toObject(),
        size: formatFileSize(document.fileSize),
        uploadDate: document.uploadDate.toISOString().split('T')[0],
        lastModified: document.lastModified.toISOString().split('T')[0],
        type: document.fileName.split('.').pop()?.toLowerCase()
      }
    })

  } catch (error) {
    console.error('Document GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Belge yüklenirken hata oluştu'
    }, { status: 500 })
  }
}

// PUT - Belge güncelleme
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const updateData = await request.json()

    const document = await Document.findById(id)
    if (!document) {
      return NextResponse.json({
        success: false,
        message: 'Belge bulunamadı'
      }, { status: 404 })
    }

    // Güncellenebilir alanlar
    const allowedFields = ['title', 'category', 'description', 'tags', 'isPrivate', 'status']
    const filteredUpdateData: any = {}
    
    allowedFields.forEach(field => {
      if (updateData[field] !== undefined) {
        filteredUpdateData[field] = updateData[field]
      }
    })

    // Tags'i işle
    if (filteredUpdateData.tags && typeof filteredUpdateData.tags === 'string') {
      filteredUpdateData.tags = filteredUpdateData.tags.split(',').map((tag: string) => tag.trim()).filter((tag: string) => tag)
    }

    filteredUpdateData.lastModified = new Date()

    const updatedDocument = await Document.findByIdAndUpdate(
      id,
      filteredUpdateData,
      { new: true, runValidators: true }
    )

    return NextResponse.json({
      success: true,
      message: 'Belge başarıyla güncellendi',
      data: {
        ...updatedDocument!.toObject(),
        size: formatFileSize(updatedDocument!.fileSize),
        uploadDate: updatedDocument!.uploadDate.toISOString().split('T')[0],
        lastModified: updatedDocument!.lastModified.toISOString().split('T')[0],
        type: updatedDocument!.fileName.split('.').pop()?.toLowerCase()
      }
    })

  } catch (error) {
    console.error('Document PUT error:', error)
    return NextResponse.json({
      success: false,
      message: 'Belge güncellenirken hata oluştu'
    }, { status: 500 })
  }
}

// DELETE - Belge silme
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Auth kontrolü
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) {
      return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    }

    try {
      jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    const { id } = await params
    await connectDB()

    const document = await Document.findById(id)
    if (!document) {
      return NextResponse.json({
        success: false,
        message: 'Belge bulunamadı'
      }, { status: 404 })
    }

    // Cloudinary'den dosyayı sil
    if (document.fileUrl) {
      try {
        const publicId = document.fileUrl.split('/').pop()?.split('.')[0]
        if (publicId) {
          await cloudinary.uploader.destroy(`sendika-documents/${publicId}`)
        }
      } catch (cloudinaryError) {
        console.error('Cloudinary delete error:', cloudinaryError)
        // Cloudinary hatası olsa bile belgeyi sil
      }
    }

    // Veritabanından sil
    await Document.findByIdAndDelete(id)

    return NextResponse.json({
      success: true,
      message: 'Belge başarıyla silindi'
    })

  } catch (error) {
    console.error('Document DELETE error:', error)
    return NextResponse.json({
      success: false,
      message: 'Belge silinirken hata oluştu'
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


