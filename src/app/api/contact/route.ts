import { NextRequest, NextResponse } from 'next/server'

// E-posta gönderim fonksiyonu
async function sendEmail(data: {
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  category: string
}) {
  // Kategorilerin Türkçe karşılıkları
  const categoryLabels: Record<string, string> = {
    genel: 'Genel Bilgi',
    uyelik: 'Üyelik',
    hukuk: 'Hukuki Destek',
    etkinlik: 'Etkinlikler',
    basin: 'Basın',
    sikayet: 'Şikayet',
    oneri: 'Öneri'
  }

  const emailData = {
    to: 'info@kultursanatis.org',
    from: `"${data.name}" <noreply@kultursanatis.org>`,
    replyTo: data.email,
    subject: `[${categoryLabels[data.category] || data.category.toUpperCase()}] ${data.subject}`,
    html: `
      <!DOCTYPE html>
      <html lang="tr">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Yeni İletişim Mesajı</title>
        <style>
          body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px; }
          .header { background: linear-gradient(135deg, #dc2626, #2563eb); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
          .content { background: #f9fafb; padding: 20px; border: 1px solid #e5e7eb; }
          .footer { background: #374151; color: white; padding: 15px; border-radius: 0 0 8px 8px; text-align: center; font-size: 12px; }
          .info-row { margin: 10px 0; padding: 8px; background: white; border-radius: 4px; }
          .label { font-weight: bold; color: #374151; }
          .message-box { background: white; padding: 15px; border-radius: 4px; margin: 15px 0; border-left: 4px solid #2563eb; }
        </style>
      </head>
      <body>
        <div class="header">
          <h2 style="margin: 0;">🏛️ Kültür-İş Sendikası</h2>
          <p style="margin: 5px 0 0 0;">Yeni İletişim Mesajı</p>
        </div>
        
        <div class="content">
          <div class="info-row">
            <span class="label">👤 Gönderen:</span> ${data.name}
          </div>
          <div class="info-row">
            <span class="label">📧 E-posta:</span> 
            <a href="mailto:${data.email}" style="color: #2563eb;">${data.email}</a>
          </div>
          ${data.phone ? `
          <div class="info-row">
            <span class="label">📞 Telefon:</span> 
            <a href="tel:${data.phone}" style="color: #2563eb;">${data.phone}</a>
          </div>
          ` : ''}
          <div class="info-row">
            <span class="label">🏷️ Kategori:</span> ${categoryLabels[data.category] || data.category}
          </div>
          <div class="info-row">
            <span class="label">📋 Konu:</span> ${data.subject}
          </div>
          
          <div class="message-box">
            <h4 style="margin-top: 0; color: #374151;">💬 Mesaj İçeriği:</h4>
            <p style="white-space: pre-wrap; margin-bottom: 0;">${data.message}</p>
          </div>
        </div>
        
        <div class="footer">
          <p style="margin: 0;">Bu mesaj ${new Date().toLocaleString('tr-TR')} tarihinde gönderilmiştir.</p>
          <p style="margin: 5px 0 0 0;">Kültür-İş Sendikası - İletişim Sistemi</p>
        </div>
      </body>
      </html>
    `
  }

  console.log('📧 E-posta gönderiliyor:', emailData)

  // Gerçek Resend implementasyonu için:
  // const { Resend } = require('resend');
  // const resend = new Resend(process.env.RESEND_API_KEY);
  // await resend.emails.send(emailData);

  // Şimdilik simülasyon
  await new Promise(resolve => setTimeout(resolve, 1500))
  
  return true
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Validasyon
    const { name, email, subject, message, category, phone } = body
    
    if (!name || !email || !subject || !message) {
      return NextResponse.json(
        { success: false, error: 'Zorunlu alanlar eksik' },
        { status: 400 }
      )
    }

    // E-posta format kontrolü
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { success: false, error: 'Geçersiz e-posta formatı' },
        { status: 400 }
      )
    }

    // E-posta gönder
    await sendEmail({
      name,
      email,
      phone,
      subject,
      message,
      category: category || 'genel'
    })

    // Veritabanına kaydet (opsiyonel)
    // await saveContactMessage(body)

    return NextResponse.json(
      { 
        success: true, 
        message: 'Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.' 
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('İletişim formu hatası:', error)
    
    return NextResponse.json(
      { 
        success: false, 
        error: 'Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.' 
      },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { 
      message: 'İletişim API\'si aktif',
      endpoints: {
        POST: '/api/contact - İletişim formu gönderimi'
      }
    },
    { status: 200 }
  )
}
