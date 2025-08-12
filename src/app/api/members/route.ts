import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import Member from '@/models/Member'
import jwt from 'jsonwebtoken'

// GET - Üyeleri listele
export async function GET(request: NextRequest) {
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

    await connectDB()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const membershipType = searchParams.get('membershipType')
    const search = searchParams.get('search')

    let query: any = {}

    if (status && status !== 'all') {
      query.status = status
    }

    if (membershipType && membershipType !== 'all') {
      query['membershipInfo.membershipType'] = membershipType
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { memberNumber: { $regex: search, $options: 'i' } },
        { 'workInfo.workplace': { $regex: search, $options: 'i' } }
      ]
    }

    const members = await Member.find(query)
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: members
    })

  } catch (error) {
    console.error('Members GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// POST - Yeni üye oluştur
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

    await connectDB()

    const memberData = await request.json()

    // Validasyon
    if (!memberData.firstName || !memberData.lastName || !memberData.email || !memberData.tcNumber) {
      return NextResponse.json({
        success: false,
        message: 'Zorunlu alanları doldurun'
      }, { status: 400 })
    }

    // E-posta kontrolü
    const existingMember = await Member.findOne({ email: memberData.email })
    if (existingMember) {
      return NextResponse.json({
        success: false,
        message: 'Bu e-posta adresi zaten kullanımda'
      }, { status: 400 })
    }

    // TC Kimlik kontrolü
    const existingTC = await Member.findOne({ tcNumber: memberData.tcNumber })
    if (existingTC) {
      return NextResponse.json({
        success: false,
        message: 'Bu TC Kimlik numarası zaten kayıtlı'
      }, { status: 400 })
    }

    // Üye numarası oluştur
    const lastMember = await Member.findOne().sort({ memberNumber: -1 })
    let nextMemberNumber = '000001'
    
    if (lastMember && lastMember.memberNumber) {
      const lastNumber = parseInt(lastMember.memberNumber) + 1
      nextMemberNumber = lastNumber.toString().padStart(6, '0')
    }

    // Yeni üye oluştur
    const newMember = new Member({
      ...memberData,
      memberNumber: nextMemberNumber,
      membershipInfo: {
        ...memberData.membershipInfo,
        joinDate: new Date(),
        dues: {
          amount: memberData.membershipInfo?.dues?.amount || 100,
          status: 'unpaid'
        }
      }
    })

    await newMember.save()

    return NextResponse.json({
      success: true,
      message: 'Üye başarıyla oluşturuldu',
      data: newMember
    }, { status: 201 })

  } catch (error) {
    console.error('Member POST error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}