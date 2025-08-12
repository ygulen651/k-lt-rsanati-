/**
 * MongoDB Kurulum Script'i
 * Bu script MongoDB bağlantısını kurar ve ilk admin kullanıcısını oluşturur
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

// Environment değişkenlerini yükle
require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/sendika-website'
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@sendika.com'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'admin123'

// User Schema
const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['admin', 'editor', 'viewer'],
    default: 'viewer'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date
}, {
  timestamps: true
})

const User = mongoose.model('User', UserSchema)

async function setupDatabase() {
  try {
    console.log('🚀 MongoDB kurulumu başlıyor...')
    
    // MongoDB'ye bağlan
    console.log('📡 MongoDB\'ye bağlanılıyor...')
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
    })
    console.log('✅ MongoDB bağlantısı başarılı!')

    // Mevcut admin kullanıcı var mı kontrol et
    console.log('👤 Mevcut admin kullanıcı kontrol ediliyor...')
    const existingAdmin = await User.findOne({ role: 'admin' })
    
    if (existingAdmin) {
      console.log('⚠️  Admin kullanıcı zaten mevcut:', existingAdmin.email)
      console.log('📧 E-posta:', existingAdmin.email)
      console.log('👤 İsim:', existingAdmin.name)
      console.log('🔑 Rol:', existingAdmin.role)
      return
    }

    // Admin kullanıcı oluştur
    console.log('🔐 Admin kullanıcı oluşturuluyor...')
    
    // Şifreyi hash'le
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash(ADMIN_PASSWORD, salt)
    
    const adminUser = new User({
      email: ADMIN_EMAIL,
      password: hashedPassword,
      name: 'Sistem Yöneticisi',
      role: 'admin',
      isActive: true
    })

    await adminUser.save()
    console.log('✅ Admin kullanıcı başarıyla oluşturuldu!')
    console.log('')
    console.log('📋 Admin Bilgileri:')
    console.log('📧 E-posta:', ADMIN_EMAIL)
    console.log('🔑 Şifre:', ADMIN_PASSWORD)
    console.log('👤 İsim: Sistem Yöneticisi')
    console.log('🎯 Rol: admin')
    console.log('')
    console.log('🌐 Admin paneline erişmek için: http://localhost:3000/admin/login')
    console.log('')

    // Örnek duyuru oluştur
    console.log('📝 Örnek içerik oluşturuluyor...')
    
    const AnnouncementSchema = new mongoose.Schema({
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      excerpt: { type: String, required: true },
      content: { type: String, required: true },
      category: { type: String, default: 'genel' },
      tags: [String],
      status: { type: String, default: 'published' },
      featured: { type: Boolean, default: false },
      publishDate: { type: Date, default: Date.now },
      author: { type: String, default: 'Admin' },
      views: { type: Number, default: 0 }
    }, { timestamps: true })

    const Announcement = mongoose.model('Announcement', AnnouncementSchema)

    // Örnek duyuru ekle
    const sampleAnnouncement = new Announcement({
      title: 'Sendika Websitesi Yenilendi!',
      slug: 'sendika-websitesi-yenilendi',
      excerpt: 'Sendikamızın yeni websitesi MongoDB ile güçlendirildi ve modern bir tasarıma kavuştu.',
      content: `
        <h2>Yeni Website Özellikleri</h2>
        <p>Sendikamızın yeni websitesi artık daha hızlı, güvenli ve kullanıcı dostu bir deneyim sunuyor.</p>
        
        <h3>Öne Çıkan Özellikler:</h3>
        <ul>
          <li>MongoDB veritabanı ile güçlendirilmiş içerik yönetimi</li>
          <li>Responsive tasarım ile mobil uyumluluk</li>
          <li>Gelişmiş admin paneli</li>
          <li>Hızlı arama ve filtreleme</li>
          <li>SEO optimizasyonu</li>
        </ul>
        
        <p>Yeni websitemizi ziyaret ettiğiniz için teşekkür ederiz!</p>
      `,
      category: 'genel',
      tags: ['website', 'yenilik', 'teknoloji'],
      status: 'published',
      featured: true,
      author: 'Sistem Yöneticisi'
    })

    await sampleAnnouncement.save()
    console.log('✅ Örnek duyuru oluşturuldu!')

    // Örnek etkinlik oluştur
    const EventSchema = new mongoose.Schema({
      title: { type: String, required: true },
      slug: { type: String, required: true, unique: true },
      description: { type: String, required: true },
      date: { type: Date, required: true },
      time: { type: String, required: true },
      location: { type: String, required: true },
      category: { type: String, default: 'toplanti' },
      status: { type: String, default: 'published' },
      featured: { type: Boolean, default: false },
      createdBy: { type: String, default: 'Admin' }
    }, { timestamps: true })

    const Event = mongoose.model('Event', EventSchema)

    const sampleEvent = new Event({
      title: 'Genel Kurul Toplantısı',
      slug: 'genel-kurul-toplantisi',
      description: 'Sendikamızın yıllık genel kurul toplantısına tüm üyelerimizi davet ediyoruz.',
      date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 gün sonra
      time: '14:00',
      location: 'Sendika Merkezi',
      category: 'toplanti',
      status: 'published',
      featured: true,
      createdBy: 'Sistem Yöneticisi'
    })

    await sampleEvent.save()
    console.log('✅ Örnek etkinlik oluşturuldu!')
    
    console.log('')
    console.log('🎉 MongoDB kurulumu tamamlandı!')
    console.log('🚀 Artık uygulamayı başlatabilirsiniz: npm run dev')

  } catch (error) {
    console.error('❌ Kurulum hatası:', error)
    process.exit(1)
  } finally {
    await mongoose.connection.close()
    console.log('📡 MongoDB bağlantısı kapatıldı')
    process.exit(0)
  }
}

// Script'i çalıştır
setupDatabase()
