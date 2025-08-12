import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import MembershipApplication from '@/models/MembershipApplication'
import Member from '@/models/Member'
import jwt from 'jsonwebtoken'

// GET - Üyelik başvurularını listele
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
    const search = searchParams.get('search')

    let query: any = {}

    if (status && status !== 'all') {
      query.status = status
    }

    if (search) {
      query.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { 'workInfo.workplace': { $regex: search, $options: 'i' } }
      ]
    }

    const applications = await MembershipApplication.find(query)
      .sort({ createdAt: -1 })

    return NextResponse.json({
      success: true,
      data: applications
    })

  } catch (error) {
    console.error('Membership applications GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// POST - Yeni üyelik başvurusu oluştur
export async function POST(request: NextRequest) {
  try {
    await connectDB()

    const applicationData = await request.json()

    // Validasyon
    if (!applicationData.firstName || !applicationData.lastName || !applicationData.email) {
      return NextResponse.json({
        success: false,
        message: 'Zorunlu alanları doldurun'
      }, { status: 400 })
    }

    // E-posta kontrolü - hem üyelerde hem başvurularda
    const existingMember = await Member.findOne({ email: applicationData.email })
    if (existingMember) {
      return NextResponse.json({
        success: false,
        message: 'Bu e-posta adresi zaten üye olarak kayıtlı'
      }, { status: 400 })
    }

    const existingApplication = await MembershipApplication.findOne({ 
      email: applicationData.email,
      status: { $in: ['pending', 'under_review'] }
    })
    if (existingApplication) {
      return NextResponse.json({
        success: false,
        message: 'Bu e-posta adresi ile zaten bekleyen bir başvuru var'
      }, { status: 400 })
    }

    // Yeni başvuru oluştur
    const newApplication = new MembershipApplication({
      ...applicationData,
      status: 'pending'
    })

    await newApplication.save()

    return NextResponse.json({
      success: true,
      message: 'Üyelik başvurusu başarıyla gönderildi',
      data: newApplication
    }, { status: 201 })

  } catch (error) {
    console.error('Membership application POST error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}