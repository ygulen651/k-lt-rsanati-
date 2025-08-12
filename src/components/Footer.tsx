import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin, ExternalLink, Youtube, Linkedin, Globe } from "lucide-react"
import { Container } from "./Container"

const iconMap = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  globe: Globe
}

const colorMap = {
  facebook: "bg-blue-600 hover:bg-blue-700",
  twitter: "bg-sky-500 hover:bg-sky-600", 
  instagram: "bg-pink-600 hover:bg-pink-700",
  youtube: "bg-red-600 hover:bg-red-700",
  linkedin: "bg-blue-700 hover:bg-blue-800",
  globe: "bg-gray-600 hover:bg-gray-700"
}

async function getSiteData() {
  try {
    // Server-side'da dosyadan direkt oku
    const fs = require('fs')
    const path = require('path')
    const STORAGE = path.join(process.cwd(), 'data', 'site-data.json')
    
    if (fs.existsSync(STORAGE)) {
      const raw = fs.readFileSync(STORAGE, 'utf8')
      const parsed = JSON.parse(raw)
      return parsed
    }
  } catch (error) {
    console.error('Site data fetch error:', error)
  }
  
  // Fallback default data
  return {
    settings: {
      siteName: "Kültür-İş",
      siteDescription: "Kültür Sanat İş"
    },
    contact: {
      email: 'info@kultursanatis.org',
      phone: '0312-419 85 79',
      address: 'Şehit Adem Yavuz Sokak. Hitit Apt. No:14/14',
      district: 'Kızılay',
      city: 'ANKARA'
    },
    socials: []
  }
}

export async function Footer() {
  const siteData = await getSiteData()
  const currentYear = new Date().getFullYear()
  const siteName = siteData?.settings?.siteName || "Kültür-İş"
  const contactData = siteData?.contact || {}
  const socialLinks = siteData?.socials?.filter((s: any) => s.active && s.url) || []

  const sendikalar = [
    { name: "BÜRO-İŞ", href: "https://www.burois.org.tr/" },
    { name: "EĞİTİM-İŞ", href: "https://www.egitimis.org.tr/" },
    { name: "ENERJİ-İŞ", href: "#" },
    { name: "TARIM ORMAN-İŞ", href: "https://www.tarimorman-is.org/" },
    { name: "GENEL SAĞLIK-İŞ", href: "https://www.genelsaglikis.org.tr/" },
    { name: "KÜLTÜR SANAT-İŞ", href: "#" },
    { name: "TAPU ÇEVRE YOL-İŞ", href: "https://www.tapucevreyolis.org.tr/" },
  ]

  const birlesiKamuIs = [
    { name: "Birleşik Kamu İş Tüzüğü", href: "#" },
    { name: "TÜMSİLDİLİKLER", href: "#" },
  ]

  return (
    <footer className="bg-slate-800 text-white">
      <Container>
        <div className="py-12">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            
            {/* Sol Kolon - Anasayfa */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">ANASAYFA</h3>
              <ul className="space-y-3">
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">BÜRO-İŞ</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">EĞİTİM-İŞ</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">ENERJİ-İŞ</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">TARIM ORMAN-İŞ</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">GENEL SAĞLIK-İŞ</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">KÜLTÜR SANAT-İŞ</Link></li>
                <li><Link href="#" className="text-gray-300 hover:text-white transition-colors text-sm">TAPU ÇEVRE YOL-İŞ</Link></li>
              </ul>
            </div>

            {/* İkinci Kolon - Sendikalar */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">SENDİKALAR</h3>
              <ul className="space-y-3">
                {sendikalar.map((sendika) => (
                  <li key={sendika.name}>
                    <Link 
                      href={sendika.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm flex items-center gap-2"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {sendika.name}
                      {sendika.href !== "#" && <ExternalLink className="h-3 w-3" />}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Üçüncü Kolon - Birleşik Kamu İş */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">BİRLEŞİK KAMU İŞ</h3>
              <ul className="space-y-3">
                {birlesiKamuIs.map((item) => (
                  <li key={item.name}>
                    <Link 
                      href={item.href}
                      className="text-gray-300 hover:text-white transition-colors text-sm"
                    >
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Dördüncü Kolon - İletişim */}
            <div>
              <h3 className="text-lg font-bold mb-6 text-white">İLETİŞİM</h3>
              <div className="space-y-3 mb-6">
                {contactData.email && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Mail className="h-4 w-4" />
                    <a href={`mailto:${contactData.email}`} className="hover:text-white transition-colors text-sm">
                      {contactData.email}
                    </a>
                  </div>
                )}
                {contactData.phone && (
                  <div className="flex items-center gap-2 text-gray-300">
                    <Phone className="h-4 w-4" />
                    <a href={`tel:${contactData.phone}`} className="hover:text-white transition-colors text-sm">
                      {contactData.phone}
                    </a>
                  </div>
                )}
                {contactData.address && (
                  <div className="flex items-start gap-2 text-gray-300">
                    <MapPin className="h-4 w-4 mt-0.5" />
                    <div className="text-sm">
                      <p>{contactData.address}</p>
                      {contactData.district && contactData.city && (
                        <p>{contactData.district} / {contactData.city}</p>
                      )}
                    </div>
                  </div>
                )}
              </div>

              {/* Sosyal Medya Linkleri */}
              {socialLinks.length > 0 && (
                <div className="flex gap-3">
                  {socialLinks.map((social: any) => {
                    const Icon = iconMap[social.icon as keyof typeof iconMap] || Globe
                    const colorClass = colorMap[social.icon as keyof typeof colorMap] || "bg-gray-600 hover:bg-gray-700"
                    return (
                      <Link
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${colorClass}`}
                        aria-label={social.name}
                      >
                        <Icon className="h-5 w-5 text-white" />
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Harita Bölümü */}
        <div className="border-t border-slate-700 py-8">
          <div className="w-full h-80 rounded-lg overflow-hidden relative shadow-xl">
            {/* Google Maps Embed */}
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3059.6234567890123!2d32.8597!3d39.9208!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x14d347d520732db1%3A0x4b8b8b8b8b8b8b8b!2sZiya%20G%C3%B6kalp%20Cd.%20No%3A45%20D%3A5%2C%2006420%20%C3%87ankaya%2FAnkara!5e0!3m2!1str!2str!4v1641234567890!5m2!1str!2str"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="w-full h-full"
              title="Sendika Konumu - Ziya Gökalp Cd. No:45 D:5, Çankaya/Ankara"
            />
            
            {/* Harita Üzerinde Logo ve Adres Bilgisi */}
            <div className="absolute top-4 right-4">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-lg">
                <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-bold text-xs">LOGO</span>
                </div>
              </div>
            </div>

            {/* Alt Sol Köşede Adres Bilgisi */}
            <div className="absolute bottom-4 left-4 bg-white/95 backdrop-blur-sm rounded-lg p-4 shadow-lg max-w-sm">
              <div className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="font-semibold text-slate-800 text-sm">Ziya Gökalp Cd. No:45 D:5</p>
                  <p className="text-slate-600 text-xs">KONFEDERASYONLU Kızılay</p>
                  <p className="text-slate-600 text-xs">06420 Çankaya/Ankara</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Alt Copyright */}
        <div className="border-t border-slate-700 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              {currentYear} {siteName}. Tüm hakları saklıdır.
            </p>
            <div className="flex gap-6 text-sm">
              <Link href="/gizlilik" className="text-gray-400 hover:text-white transition-colors">
                Gizlilik Politikası
              </Link>
              <Link href="/kullanim" className="text-gray-400 hover:text-white transition-colors">
                Kullanım Şartları
              </Link>
            </div>
          </div>
        </div>
      </Container>
    </footer>
  )
}
