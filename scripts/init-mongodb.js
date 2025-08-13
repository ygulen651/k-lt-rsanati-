#!/usr/bin/env node

/**
 * MongoDB Initialize Script'i
 * Bu script MongoDB'de gerekli collection'ları ve default data'yı oluşturur
 */

const mongoose = require('mongoose');
require('dotenv').config({ path: '.env.local' });

// MongoDB bağlantısı
const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
  console.error('❌ MONGODB_URI environment değişkeni tanımlanmamış');
  console.log('📝 .env.local dosyasında MONGODB_URI\'yi tanımlayın');
  process.exit(1);
}

// Site Data Schema
const SiteDataSchema = new mongoose.Schema({
  section: {
    type: String,
    required: true,
    enum: ['hero', 'mission', 'settings', 'theme', 'menu', 'socials', 'seo', 'contact', 'analytics'],
    unique: true
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
}, {
  timestamps: true
});

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
});

const SiteData = mongoose.model('SiteData', SiteDataSchema);
const User = mongoose.model('User', UserSchema);

// Default site data
const defaultSiteData = {
  hero: { 
    slides: [
      {
        id: 1,
        title: "Kültür ve Bilim İşçileri Sendikası",
        subtitle: "",
        image: "/hero-bg.jpg",
        buttonText: "Hakkımızda",
        buttonLink: "/hakkimizda",
        active: true
      }
    ]
  },
  mission: {
    mission: "Kamu çalışanlarının haklarını korumak, sosyal ve ekonomik durumlarını iyileştirmek, demokratik ve laik cumhuriyeti desteklemek.",
    vision: "Türkiye'nin en güçlü ve etkili kamu sendikası olmak, çalışanların sesini en yüksek perdeden duyurmak.",
    values: "Adalet, eşitlik, dayanışma, şeffaflık ve demokratik katılım ilkelerimizle hareket ediyoruz."
  },
  settings: {
    siteName: "Kültür-İş",
    siteTitle: "Kültür ve Bilim İşçileri Sendikası",
    siteDescription: "",
    logo: "/Logo-png-beyaz.png",
    favicon: "/kültür.png",
    contactEmail: 'info@kultursanatis.org',
    contactPhone: '0312-419 85 79',
    fax: '0312-419 85 79',
    address: 'Şehit Adem Yavuz Sokak. Hitit Apt. No:14/14 Kızılay / ANKARA'
  },
  theme: {
    primaryColor: '#dc2626',
    secondaryColor: '#2563eb',
    accentColor: '#7c3aed',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    logoUrl: '/Logo-png-beyaz.png',
    customCss: ''
  },
  menu: [
    { id: 1, title: "Ana Sayfa", url: "/", order: 1, visible: true, target: "_self" },
    { id: 2, title: "Hakkımızda", url: "/hakkimizda", order: 2, visible: true, target: "_self" },
    { id: 3, title: "Basın Yayın", url: "/basin-yayin", order: 3, visible: true, target: "_self" },
    { id: 4, title: "Etkinlikler", url: "/etkinlikler", order: 4, visible: true, target: "_self" },
    { id: 5, title: "İletişim", url: "/iletisim", order: 5, visible: true, target: "_self" }
  ],
  socials: [
    { id: 1, name: "Facebook", url: "https://facebook.com/kultursanatis", icon: "facebook", active: true },
    { id: 2, name: "Twitter", url: "https://twitter.com/kultursanatis", icon: "twitter", active: true },
    { id: 3, name: "Instagram", url: "https://instagram.com/kultursanatis", icon: "instagram", active: true },
    { id: 4, name: "YouTube", url: "https://youtube.com/kultursanatis", icon: "youtube", active: true }
  ],
  seo: {
    siteTitle: 'Kültür-İş',
    siteDescription: 'Kültür ve Bilim İşçileri Sendikası',
    keywords: 'sendika, kültür, bilim, işçi, kamu, çalışan',
    robots: 'index, follow',
    canonicalUrl: '',
    ogTitle: 'Kültür-İş - Kültür ve Bilim İşçileri Sendikası',
    ogDescription: '',
    ogImage: '/og-image.jpg',
    twitterCard: 'summary_large_image',
    twitterSite: '@kultursanatis',
    googleAnalytics: '',
    googleSearchConsole: '',
    structuredData: true,
    sitemap: true,
    robotsTxt: true
  },
  contact: {
    email: 'info@kultursanatis.org',
    phone: '0312-419 85 79',
    fax: '0312-419 85 79',
    address: 'Şehit Adem Yavuz Sokak. Hitit Apt. No:14/14',
    district: 'Kızılay',
    city: 'ANKARA',
    postalCode: '06420',
    workingHours: 'Pazartesi - Cuma: 09:00 - 18:00',
    mapUrl: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.6234567890123!2d32.8597!3d39.9208'
  },
  analytics: {
    visitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    topSources: []
  }
};

async function initializeMongoDB() {
  try {
    console.log('🚀 MongoDB Initialize Script\'i başlatılıyor...');
    console.log('=============================================\n');
    
    // MongoDB'ye bağlan
    console.log('📡 MongoDB\'ye bağlanılıyor...');
    await mongoose.connect(MONGODB_URI, {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      connectTimeoutMS: 10000,
      retryWrites: true,
      w: 'majority'
    });
    console.log('✅ MongoDB bağlantısı başarılı!');
    
    // Database ve collection'ları oluştur
    console.log('\n🗄️  Database yapısı oluşturuluyor...');
    
    // Site Data collection'ını oluştur
    console.log('📝 Site Data collection oluşturuluyor...');
    const sections = Object.keys(defaultSiteData);
    
    for (const section of sections) {
      try {
        await SiteData.findOneAndUpdate(
          { section },
          { 
            section,
            data: defaultSiteData[section],
            updatedAt: new Date()
          },
          { upsert: true, new: true }
        );
        console.log(`✅ ${section} section oluşturuldu`);
      } catch (error) {
        console.log(`⚠️  ${section} section oluşturulamadı:`, error.message);
      }
    }
    
    // Admin kullanıcı kontrolü
    console.log('\n👤 Admin kullanıcı kontrol ediliyor...');
    const existingAdmin = await User.findOne({ role: 'admin' });
    
    if (existingAdmin) {
      console.log('✅ Admin kullanıcı zaten mevcut:', existingAdmin.email);
    } else {
      console.log('⚠️  Admin kullanıcı bulunamadı');
      console.log('📝 setup-db.js script\'ini çalıştırarak admin kullanıcı oluşturun');
    }
    
    // Collection'ları listele
    console.log('\n📊 Mevcut collection\'lar:');
    const collections = await mongoose.connection.db.listCollections().toArray();
    collections.forEach(collection => {
      console.log(`  - ${collection.name}`);
    });
    
    // Site Data sayısını kontrol et
    const siteDataCount = await SiteData.countDocuments();
    console.log(`\n📈 Site Data kayıt sayısı: ${siteDataCount}`);
    
    console.log('\n🎉 MongoDB initialize işlemi tamamlandı!');
    console.log('\n📋 Sonraki adımlar:');
    console.log('1. Admin kullanıcı oluşturmak için: npm run setup-db');
    console.log('2. Geliştirme sunucusunu başlatmak için: npm run dev');
    console.log('3. Vercel\'e deploy etmek için: npm run vercel:deploy');
    
  } catch (error) {
    console.error('❌ MongoDB initialize hatası:', error);
    console.log('\n🔧 Hata giderme:');
    console.log('1. MONGODB_URI doğru mu kontrol edin');
    console.log('2. MongoDB Atlas\'ta network access ayarlarını kontrol edin');
    console.log('3. MongoDB Atlas\'ta database user permissions\'ları kontrol edin');
  } finally {
    // Bağlantıyı kapat
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      console.log('\n🔌 MongoDB bağlantısı kapatıldı');
    }
    process.exit(0);
  }
}

// Script çalıştır
if (require.main === module) {
  initializeMongoDB();
}

module.exports = { initializeMongoDB, defaultSiteData };
