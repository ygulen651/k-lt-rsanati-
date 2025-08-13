import mongoose from 'mongoose';

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

// Index ekle
SiteDataSchema.index({ section: 1 });

// Virtual field for full data
SiteDataSchema.virtual('fullData').get(function() {
  return this.data;
});

// JSON serialization
SiteDataSchema.set('toJSON', {
  virtuals: true,
  transform: function(doc, ret) {
    delete ret._id;
    delete ret.__v;
    return ret;
  }
});

// Model export
const SiteData = mongoose.models.SiteData || mongoose.model('SiteData', SiteDataSchema);

export default SiteData;

// Default site data
export const defaultSiteData = {
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
