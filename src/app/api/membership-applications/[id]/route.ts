import { NextRequest, NextResponse } from 'next/server'
import { connectDB } from '@/lib/mongodb'
import MembershipApplication from '@/models/MembershipApplication'
import Member from '@/models/Member'
import AdminUser from '@/models/AdminUser'
import jwt from 'jsonwebtoken'

// GET - Üyelik başvurusu detayı
export async function GET(
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

    await connectDB()

    const { id } = await params
    const application = await MembershipApplication.findById(id)
    
    if (!application) {
      return NextResponse.json({
        success: false,
        message: 'Başvuru bulunamadı'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      data: application
    })

  } catch (error) {
    console.error('Membership application GET error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// PUT - Üyelik başvurusu güncelle (onay/red)
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

    let currentUserId: string
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') as any
      currentUserId = decoded.userId
    } catch (error) {
      return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 })
    }

    await connectDB()

    const { status, reviewNotes } = await request.json()

    if (!['pending', 'under_review', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json({
        success: false,
        message: 'Geçersiz durum'
      }, { status: 400 })
    }

    const { id } = await params
    const application = await MembershipApplication.findById(id)
    if (!application) {
      return NextResponse.json({
        success: false,
        message: 'Başvuru bulunamadı'
      }, { status: 404 })
    }

    // Başvuru durumunu güncelle
    const updatedApplication = await MembershipApplication.findByIdAndUpdate(
      id,
      {
        status,
        reviewNotes,
        reviewedBy: currentUserId,
        reviewedAt: new Date(),
        updatedAt: new Date()
      },
      { new: true }
    )

    // Eğer onaylandıysa üye olarak kaydet
    if (status === 'approved') {
      try {
        // Üye numarası oluştur
        const lastMember = await Member.findOne().sort({ memberNumber: -1 })
        let nextMemberNumber = '000001'
        
        if (lastMember && lastMember.memberNumber) {
          const lastNumber = parseInt(lastMember.memberNumber) + 1
          nextMemberNumber = lastNumber.toString().padStart(6, '0')
        }

        // Başvuru verilerinden üye oluştur
        const newMember = new Member({
          memberNumber: nextMemberNumber,
          firstName: application.firstName,
          lastName: application.lastName,
          email: application.email,
          phone: application.phone,
          tcNumber: application.tcNumber || '',
          birthDate: application.birthDate,
          address: application.address || {},
          workInfo: application.workInfo,
          membershipInfo: {
            membershipType: 'active',
            joinDate: new Date(),
            dues: {
              amount: 100,
              status: 'unpaid'
            }
          },
          emergencyContact: application.emergencyContact,
          status: 'active',
          notes: `Üyelik başvurusu onaylanarak oluşturuldu. Başvuru ID: ${application._id}`
        })

        await newMember.save()

        return NextResponse.json({
          success: true,
          message: 'Başvuru onaylandı ve üye kaydı oluşturuldu',
          data: updatedApplication,
          member: newMember
        })

      } catch (memberError) {
        console.error('Member creation error:', memberError)
        
        // Başvuru durumunu geri al
        await MembershipApplication.findByIdAndUpdate(id, {
          status: 'under_review',
          reviewNotes: reviewNotes + '\n\nHata: Üye kaydı oluşturulamadı'
        })

        return NextResponse.json({
          success: false,
          message: 'Başvuru onaylandı ancak üye kaydı oluşturulamadı'
        }, { status: 500 })
      }
    }

    let message = 'Başvuru durumu güncellendi'
    if (status === 'rejected') {
      message = 'Başvuru reddedildi'
    } else if (status === 'under_review') {
      message = 'Başvuru incelemeye alındı'
    }

    return NextResponse.json({
      success: true,
      message,
      data: updatedApplication
    })

  } catch (error) {
    console.error('Membership application PUT error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}

// DELETE - Üyelik başvurusu sil
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

    await connectDB()

    const { id } = await params
    const deletedApplication = await MembershipApplication.findByIdAndDelete(id)

    if (!deletedApplication) {
      return NextResponse.json({
        success: false,
        message: 'Başvuru bulunamadı'
      }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      message: 'Başvuru silindi'
    })

  } catch (error) {
    console.error('Membership application DELETE error:', error)
    return NextResponse.json({
      success: false,
      message: 'Sunucu hatası'
    }, { status: 500 })
  }
}