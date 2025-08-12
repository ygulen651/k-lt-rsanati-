/**
 * Admin kullanıcısını sıfırlama script'i
 */

const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')

require('dotenv').config({ path: '.env.local' })

const MONGODB_URI = process.env.MONGODB_URI

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  name: { type: String, required: true },
  role: { type: String, enum: ['admin', 'editor', 'viewer'], default: 'viewer' },
  isActive: { type: Boolean, default: true },
  lastLogin: Date
}, { timestamps: true })

const User = mongoose.model('User', UserSchema)

async function resetAdmin() {
  try {
    console.log('🔄 Admin kullanıcısını sıfırlıyor...')
    
    await mongoose.connect(MONGODB_URI, { bufferCommands: false })
    console.log('✅ MongoDB bağlantısı başarılı!')

    // Mevcut admin kullanıcıları sil
    await User.deleteMany({ role: 'admin' })
    console.log('🗑️  Mevcut admin kullanıcılar silindi')

    // Yeni admin kullanıcı oluştur
    const salt = await bcrypt.genSalt(12)
    const hashedPassword = await bcrypt.hash('admin123', salt)
    
    const adminUser = new User({
      email: 'admin@sendika.com',
      password: hashedPassword,
      name: 'Sistem Yöneticisi',
      role: 'admin',
      isActive: true
    })

    await adminUser.save()
    console.log('✅ Yeni admin kullanıcı oluşturuldu!')
    console.log('📧 E-posta: admin@sendika.com')
    console.log('🔑 Şifre: admin123')
    
  } catch (error) {
    console.error('❌ Hata:', error)
  } finally {
    await mongoose.connection.close()
    console.log('📡 MongoDB bağlantısı kapatıldı')
    process.exit(0)
  }
}

resetAdmin()


