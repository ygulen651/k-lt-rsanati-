import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

// GET - Tek üye detayı
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const filePath = path.join(process.cwd(), 'content', 'yonetim', 'yonetim-kurulu.json')
    
    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        message: 'Yönetim kurulu verisi bulunamadı'
      }, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    const managementData = JSON.parse(fileContents)
    
    const member = managementData.find((m: any) => m.id === id)
    
    if (!member) {
      return NextResponse.json({
        success: false,
        message: 'Üye bulunamadı'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: member
    })

  } catch (error) {
    console.error('Management GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// PUT - Üye güncelle
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
    const updateData = await request.json()
    const filePath = path.join(process.cwd(), 'content', 'yonetim', 'yonetim-kurulu.json')

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        message: 'Yönetim kurulu verisi bulunamadı'
      }, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    let managementData = JSON.parse(fileContents)
    
    const memberIndex = managementData.findIndex((m: any) => m.id === id)
    
    if (memberIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Üye bulunamadı'
      }, { status: 404 })
    }

    // Üyeyi güncelle
    managementData[memberIndex] = {
      ...managementData[memberIndex],
      ...updateData,
      id: id // ID değişmesin
    }

    // Dosyaya kaydet
    fs.writeFileSync(filePath, JSON.stringify(managementData, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: 'Üye başarıyla güncellendi',
      data: managementData[memberIndex]
    })

  } catch (error) {
    console.error('Management PUT error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// DELETE - Üye sil
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
    const filePath = path.join(process.cwd(), 'content', 'yonetim', 'yonetim-kurulu.json')

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({
        success: false,
        message: 'Yönetim kurulu verisi bulunamadı'
      }, { status: 404 })
    }

    const fileContents = fs.readFileSync(filePath, 'utf8')
    let managementData = JSON.parse(fileContents)
    
    const memberIndex = managementData.findIndex((m: any) => m.id === id)
    
    if (memberIndex === -1) {
      return NextResponse.json({
        success: false,
        message: 'Üye bulunamadı'
      }, { status: 404 })
    }

    // Üyeyi sil
    const deletedMember = managementData.splice(memberIndex, 1)[0]

    // Dosyaya kaydet
    fs.writeFileSync(filePath, JSON.stringify(managementData, null, 2), 'utf8')

    return NextResponse.json({
      success: true,
      message: 'Üye başarıyla silindi',
      data: deletedMember
    })

  } catch (error) {
    console.error('Management DELETE error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}


