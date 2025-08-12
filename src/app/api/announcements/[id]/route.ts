import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Announcement from '@/models/Announcement'
import { authenticate, requireEditor } from '@/lib/auth'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB()
    
    const { id } = await params
    const announcement = await Announcement.findById(id).lean()
    
    if (!announcement) {
      return NextResponse.json(
        { success: false, message: 'Duyuru bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      data: announcement
    })
    
  } catch (error: any) {
    console.error('Error fetching announcement:', error)
    return NextResponse.json(
      { success: false, message: 'Duyuru getirilemedi', error: error.message },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const body = await request.json()
    
    // Gerekli alanları kontrol et
    if (!body.title || !body.content) {
      return NextResponse.json(
        { success: false, message: 'Başlık ve içerik gereklidir' },
        { status: 400 }
      )
    }
    
    // Mevcut duyuruyu bul
    const existingAnnouncement = await Announcement.findById(params.id)
    
    if (!existingAnnouncement) {
      return NextResponse.json(
        { success: false, message: 'Duyuru bulunamadı' },
        { status: 404 }
      )
    }
    
    // Slug güncellemesi gerekiyorsa (Türkçe karakter desteği)
    let slug = existingAnnouncement.slug
    if (body.title !== existingAnnouncement.title) {
      let newSlug = body.title
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
      
      const { id } = await params
      
      // Benzersiz slug kontrolü (mevcut duyuru hariç)
      let counter = 1
      while (await Announcement.findOne({ slug: newSlug, _id: { $ne: id } })) {
        newSlug = `${newSlug}-${counter}`
        counter++
      }
      slug = newSlug
    }
    
    // Duyuruyu güncelle
    const updatedAnnouncement = await Announcement.findByIdAndUpdate(
      id,
      {
        title: body.title,
        slug: slug,
        excerpt: body.excerpt || body.content.substring(0, 200) + '...',
        content: body.content,
        category: body.category || 'genel',
        tags: body.tags || [],
        featuredImage: body.featuredImage,
        status: body.status || 'draft',
        featured: body.featured || false,
        publishDate: body.publishDate ? new Date(body.publishDate) : existingAnnouncement.publishDate,
        author: user.name
      },
      { new: true, runValidators: true }
    )
    
    return NextResponse.json({
      success: true,
      message: 'Duyuru başarıyla güncellendi',
      data: updatedAnnouncement
    })
    
  } catch (error: any) {
    console.error('Error updating announcement:', error)
    
    // Validation error kontrolü
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map((err: any) => err.message)
      return NextResponse.json(
        { success: false, message: 'Doğrulama hatası', errors },
        { status: 400 }
      )
    }
    
    return NextResponse.json(
      { success: false, message: 'Duyuru güncellenemedi', error: error.message },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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
    
    const { id } = await params
    const deletedAnnouncement = await Announcement.findByIdAndDelete(id)
    
    if (!deletedAnnouncement) {
      return NextResponse.json(
        { success: false, message: 'Duyuru bulunamadı' },
        { status: 404 }
      )
    }
    
    return NextResponse.json({
      success: true,
      message: 'Duyuru başarıyla silindi'
    })
    
  } catch (error: any) {
    console.error('Error deleting announcement:', error)
    return NextResponse.json(
      { success: false, message: 'Duyuru silinemedi', error: error.message },
      { status: 500 }
    )
  }
}
