import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

// GET - Yönetim kurulu listesi
export async function GET(request: NextRequest) {
  try {
    const filePath = path.join(process.cwd(), 'content', 'yonetim', 'yonetim-kurulu.json')
    
    // Dosya var mı kontrol et
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        message: 'Yönetim kurulu verisi bulunamadı',
        data: []
      })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const managementData = JSON.parse(fileContents)

    // Optional group filter via query param
    const url = new URL(request.url)
    const group = url.searchParams.get('group') || ''
    const filtered = group
      ? (Array.isArray(managementData) ? managementData.filter((m: any) => (m?.group || '') === group) : [])
      : managementData

    return NextResponse.json({
      success: true,
      data: filtered
    })

  } catch (error) {
    console.error('Management API error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası',
      data: []
    }, { status: 500 })
  }
}

// POST - Yeni yönetim kurulu üyesi ekle
export async function POST(request: NextRequest) {
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

    const memberData = await request.json()

    // Opsiyonel alanları varsayılanlarla doldur (boş kart desteği)
    memberData.name = memberData.name ?? ''
    memberData.position = memberData.position ?? ''
    memberData.email = memberData.email ?? ''
    memberData.bio = memberData.bio ?? ''
    memberData.phone = memberData.phone ?? ''
    memberData.experience = memberData.experience ?? ''
    memberData.education = memberData.education ?? ''
    memberData.group = memberData.group ?? ''

    const filePath = path.join(process.cwd(), 'content', 'yonetim', 'yonetim-kurulu.json')
    
    // Mevcut veriyi oku
    let managementData = []
    if (fs.existsSync(filePath)) {
      const fileContents = fs.readFileSync(filePath, 'utf8')
      managementData = JSON.parse(fileContents)
    }

    // ID oluştur (isim/pozisyon bazlı slug; yoksa 'uye')
    const baseForId = (memberData.name || memberData.position || 'uye')
      .toLowerCase()
      .replace(/ş/g, 's')
      .replace(/ğ/g, 'g')
      .replace(/ü/g, 'u')
      .replace(/ı/g, 'i')
      .replace(/ö/g, 'o')
      .replace(/ç/g, 'c')
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
    const id = baseForId || `uye-${Date.now()}`

    // Aynı ID var mı kontrol et
    let counter = 1
    let uniqueId = id
    while (managementData.find((m: any) => m.id === uniqueId)) {
      uniqueId = `${id}-${counter}`
      counter++
    }

    // Yeni üye ekle
    const newMember = {
      id: uniqueId,
      name: memberData.name,
      position: memberData.position,
      bio: memberData.bio || '',
      photo: memberData.photo || '', // Boş bırak, opsiyonel
      email: memberData.email,
      phone: memberData.phone || '',
      experience: memberData.experience || '0 yıl',
      education: memberData.education || '',
      group: memberData.group || ''
    }

    managementData.push(newMember)

    // Dosyaya kaydet
    fs.writeFileSync(filePath, JSON.stringify(managementData, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: 'Yönetim kurulu üyesi başarıyla eklendi',
      data: newMember
    }, { status: 201 })

  } catch (error) {
    console.error('Management POST error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}
