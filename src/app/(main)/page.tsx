import Link from "next/link"
import Image from "next/image"
import { ArrowRight, Calendar, Users, Award, TrendingUp, Shield } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import HeroCarouselClient from "@/components/HeroCarouselClient"
import { AnnouncementCard } from "@/components/AnnouncementCard"
import { Section } from "@/components/Section"
import { Container } from "@/components/Container"
import { getContentByType } from "@/lib/mdx"
import type { AnnouncementFrontmatter, EventFrontmatter } from "@/lib/mdx"
import { getBaseUrl } from "@/lib/baseUrl"

async function fetchJson(path: string) {
  const res = await fetch(new URL(path, getBaseUrl()), { cache: "no-store" });
  if (!res.ok) throw new Error(`HTTP ${res.status} ${path}`);
  const ct = res.headers.get("content-type") || "";
  if (!ct.includes("application/json")) {
    const t = await res.text();
    throw new Error(`JSON değil: ${path} -> ${t.slice(0,120)}...`);
  }
  return res.json();
}

async function getAnnouncementsFromAPI() {
  try {
    const result = await fetchJson('/api/public/announcements?status=published&limit=6')
    return result.success ? result.data : []
  } catch (error) {
    console.error('Error fetching announcements from API:', error)
    return []
  }
}

async function getEventsFromAPI() {
  try {
    const result = await fetchJson('/api/public/events?status=published&upcoming=true&limit=6')
    return result.success ? result.data : []
  } catch (error) {
    console.error('Error fetching events from API:', error)
    return []
  }
}

// Güvenli veri işleme fonksiyonu
function safeGetDate(dateString: string | undefined): string {
  if (!dateString) return 'Tarih belirtilmemiş'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return 'Geçersiz tarih'
    return date.toLocaleDateString('tr-TR')
  } catch (error) {
    console.warn('Date parsing error:', error)
    return 'Tarih belirtilmemiş'
  }
}

function safeGetTitle(item: any): string {
  return item?.title || item?.frontmatter?.title || 'Başlık bulunamadı'
}

function safeGetDescription(item: any): string {
  return item?.excerpt || item?.description || item?.frontmatter?.description || 'Açıklama bulunamadı'
}

function safeGetYear(item: any): string {
  const raw = item?.date || item?.publishDate || item?.frontmatter?.date
  if (!raw) return ''
  try {
    const d = new Date(raw)
    if (isNaN(d.getTime())) return ''
    return String(d.getFullYear())
  } catch { return '' }
}

// Slider verilerini al
async function getSlidersFromAPI() {
  try {
    const result = await fetchJson('/api/public/sliders?active=true')
    return result.success ? result.data : []
  } catch (error) {
    console.error('Error fetching sliders:', error)
    return []
  }
}

// Admin verilerini al
async function getSiteDataFromAPI() {
  try {
    console.log('🔍 Site data API çağrılıyor:', `/api/public/site-data`)
    
    const result = await fetchJson('/api/public/site-data')
    console.log('✅ Site data API sonucu:', result.ok ? 'Başarılı' : 'Başarısız')
    return result.ok ? result.data : null
  } catch (error) {
    console.error('❌ Error fetching site data:', error)
    return null
  }
}

export default async function Home() {
  // API'lerden veri çekmeyi dene, hata durumunda boş array döndür
  let siteData = null
  let apiAnnouncements: any[] = []
  let apiEvents: any[] = []
  let sliders: any[] = []
  let kamuFeatured: any[] = []
  
  try {
    siteData = await getSiteDataFromAPI()
    console.log('✅ Site data yüklendi:', siteData ? 'Veri var' : 'Veri yok')
    if (siteData) {
      console.log('📊 Site data içeriği:', {
        mission: !!siteData.mission,
        settings: !!siteData.settings,
        theme: !!siteData.theme,
        menu: !!siteData.menu,
        socials: !!siteData.socials
      })
    }
  } catch (error) {
    console.log('❌ Site data API hatası:', error)
  }
  
  try {
    apiAnnouncements = await getAnnouncementsFromAPI()
    console.log('Ana sayfa - API duyuruları yüklendi:', apiAnnouncements.length)
  } catch (error) {
    console.log('Announcements API hatası:', error)
  }
  
  try {
    apiEvents = await getEventsFromAPI()
  } catch (error) {
    console.log('Events API hatası:', error)
  }
  
  try {
    sliders = await getSlidersFromAPI()
    console.log('Ana sayfa - Slider\'lar yüklendi:', sliders.length)
  } catch (error) {
    console.log('Sliders API hatası:', error)
  }

  // Kamu-AR öne çıkanlar
  try {
    const result = await fetchJson('/api/public/kamu-ar?status=published')
    const items = result.success ? result.data : []
    kamuFeatured = items.filter((x: any) => x.featured).slice(0, 3)
  } catch (e) {
    console.log('Kamu-AR API hatası:', e)
  }
  
  // Fallback olarak MDX dosyalarını da al
  const mdxAnnouncements = await getContentByType<AnnouncementFrontmatter>('duyurular')
  const mdxEvents = await getContentByType<EventFrontmatter>('etkinlikler')
  
  // API verilerini öncelikle kullan, yoksa MDX verilerini kullan
  console.log('Ana sayfa - API duyuru sayısı:', apiAnnouncements.length)
  console.log('Ana sayfa - MDX duyuru sayısı:', mdxAnnouncements.length)
  
  const allAnnouncements = apiAnnouncements.length > 0 ? apiAnnouncements : mdxAnnouncements.map(a => ({
    id: a.slug,
    title: a.frontmatter.title,
    excerpt: a.frontmatter.excerpt || a.frontmatter.description || '',
    content: a.content,
    category: a.frontmatter.category,
    tags: a.frontmatter.tags || [],
    featuredImage: a.frontmatter.featuredImage,
    status: 'published',
    featured: a.frontmatter.featured || false,
    publishDate: a.frontmatter.date,
    author: a.frontmatter.author || 'Admin',
    createdAt: a.frontmatter.date,
    updatedAt: a.frontmatter.date
    }))
  
  console.log('Ana sayfa - Toplam duyuru sayısı:', allAnnouncements.length)

  const allEvents = apiEvents.length > 0 ? apiEvents : mdxEvents.map(e => ({
    id: e.slug,
    title: e.frontmatter.title,
    description: e.content,
    date: e.frontmatter.date,
    time: e.frontmatter.time,
    location: e.frontmatter.location,
    category: e.frontmatter.category,
    status: 'published',
    createdAt: e.frontmatter.date
  }))
  
  const latestAnnouncements = allAnnouncements.slice(0, 6)
  const featuredAnnouncements = allAnnouncements.filter((a: any) => a.featured)
  const upcomingEvents = allEvents.slice(0, 3)

  // Hero carousel için slides hazırla - API'den slider verilerini kullan
  const heroSlides = sliders.length > 0 ? sliders.map(slider => ({
    id: slider._id,
    title: slider.title,
    subtitle: slider.subtitle,
    description: slider.description || '',
    image: slider.image,
    date: slider.createdAt,
    category: 'Slider',
    link: slider.buttonLink || '/duyurular',
    featured: true
  })) : [
    // Fallback slider'lar (eğer API'den veri gelmezse)
    {
      id: "madimak",
      title: "MADİMAK'ın 32. YILINDA AYDINLIĞA YÖNELİK SALDIRILAR SÜRÜYOR",
      subtitle: "unutMADİMAKlımaa",
      description: "Aydınlığın Yakıldığı Yer... 2 TEMMUZ 1993",
              image: "/images/fallback/madimak.jpg",
      date: "2025-07-02",
      category: "Anma",
      link: "/duyurular",
      featured: true
    },
    {
      id: "1-mayis",
      title: "1 Mayıs İşçi Bayramı Kutlu Olsun",
      subtitle: "Emek ve Dayanışma Günü",
      description: "Tüm işçilerin 1 Mayıs Emek ve Dayanışma Günü kutlu olsun. Birlik ve mücadele ruhuyla...",
              image: "/images/fallback/1mayis.jpg",
      date: "2025-05-01",
      category: "Kutlama",
      link: "/etkinlikler",
      featured: true
    }
  ]
  
  console.log('Ana sayfa - Hero slides:', heroSlides.length)

  return (
    <>
      {/* Hero Carousel */}
      <HeroCarouselClient slides={heroSlides} />

      {/* Ultra Modern Son Duyurular */}
      <Section padding="xl">
        <Container>
          {/* Mobile Responsive Başlık */}
          <div className="text-center mb-6 md:mb-12 px-4">
            <div className="relative inline-block">
              {/* Mobile Optimized Glow */}
              <div className="absolute -inset-2 md:-inset-3 bg-gradient-to-r from-red-600/20 via-blue-600/20 to-purple-600/20 rounded-xl md:rounded-2xl blur-lg md:blur-xl animate-pulse"></div>
              
              {/* Mobile Optimized Badge */}
              <div className="relative inline-flex items-center gap-1.5 md:gap-2 bg-black/5 dark:bg-white/5 backdrop-blur-xl rounded-full px-4 py-1.5 md:px-6 md:py-2 mb-4 md:mb-6 border border-red-200/30 dark:border-red-700/30">
                <div className="flex items-center gap-1">
                  <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-500 rounded-full animate-pulse" style={{animationDelay: '0.5s'}}></div>
                  <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-purple-500 rounded-full animate-pulse" style={{animationDelay: '1s'}}></div>
                </div>
                <span className="text-xs font-black text-red-600 dark:text-red-400 uppercase tracking-wider">Son Duyurular</span>
              </div>
            </div>
            
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-3 md:mb-4 leading-tight">
              <span className="block bg-gradient-to-r from-slate-900 via-red-600 to-blue-600 bg-clip-text text-transparent dark:from-white dark:via-red-400 dark:to-blue-400">
                Güncel
              </span>
              <span className="block bg-gradient-to-r from-blue-600 via-purple-600 to-red-600 bg-clip-text text-transparent">
                Haberler
              </span>
            </h2>
            
            <p className="text-base md:text-lg text-muted-foreground max-w-xs sm:max-w-md md:max-w-3xl mx-auto leading-relaxed mb-3 md:mb-4">
              Sendikamızdan en güncel haberler, önemli duyurular ve gelişmeler
            </p>
            
            {/* Mobile Optimized Dekoratif Çizgiler */}
            <div className="flex items-center justify-center gap-2 md:gap-3">
              <div className="h-px w-8 md:w-12 bg-gradient-to-r from-transparent to-red-500"></div>
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-red-500 rounded-full"></div>
              <div className="h-px w-16 md:w-24 bg-gradient-to-r from-red-500 via-blue-500 to-purple-500"></div>
              <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-blue-500 rounded-full"></div>
              <div className="h-px w-8 md:w-12 bg-gradient-to-l from-transparent to-purple-500"></div>
            </div>
          </div>

          {/* Featured Announcement - Ultra Modern Hero Card */}
          {featuredAnnouncements.length > 0 && featuredAnnouncements[0] && (
            <div className="mb-16">
              <div className="relative group">
                <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-blue-900 shadow-2xl group-hover:shadow-3xl transition-all duration-700">
                  <div className="grid lg:grid-cols-2 min-h-[500px]">
                    {/* Sol Taraf - Görsel ve Dekoratif Elementler */}
                    <div className="relative bg-gradient-to-br from-red-600 via-red-700 to-blue-700 overflow-hidden">
                      {/* Background Pattern */}
                      <div className="absolute inset-0 opacity-20">
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.3)_1px,transparent_1px)] bg-[length:50px_50px]"></div>
                        <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:30px_30px]"></div>
                      </div>
                      
                      {/* Animated Floating Elements */}
                      <div className="absolute inset-0">
                        {[...Array(20)].map((_, i) => (
                          <div
                            key={i}
                            className="absolute w-3 h-3 bg-white/20 rounded-full animate-pulse"
                            style={{
                              left: `${Math.random() * 100}%`,
                              top: `${Math.random() * 100}%`,
                              animationDelay: `${Math.random() * 3}s`,
                              animationDuration: `${2 + Math.random() * 2}s`
                            }}
                          />
                        ))}
                      </div>
                      
                      {/* Modern Content Overlay */}
                      <div className="relative h-full flex flex-col justify-center items-center text-white p-10">
                        <div className="text-center">
                          <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-3xl flex items-center justify-center mb-6 mx-auto shadow-2xl group-hover:rotate-12 transition-transform duration-500">
                            <Calendar className="h-10 w-10" />
                          </div>
                          <h4 className="text-2xl font-black mb-2 uppercase tracking-wider">Öne Çıkan</h4>
                          <p className="text-lg opacity-90 font-medium">Güncel Duyuru</p>
                          <div className="mt-4 h-px w-24 bg-white/60 mx-auto"></div>
                        </div>
                      </div>
                      
                      {/* Geometric Shapes */}
                      <div className="absolute top-8 right-8 w-16 h-16 border-2 border-white/30 rotate-45 animate-spin" style={{animationDuration: '20s'}}></div>
                      <div className="absolute bottom-8 left-8 w-12 h-12 bg-white/20 rounded-full animate-bounce" style={{animationDuration: '3s'}}></div>
                    </div>
                    
                    {/* Sağ Taraf - Modern İçerik */}
                    <CardContent className="p-10 flex flex-col justify-center">
                      {/* Modern Badge ve Tarih */}
                      <div className="flex items-center gap-4 mb-6">
                        <div className="relative">
                          <div className="absolute -inset-1 bg-gradient-to-r from-red-500 to-blue-500 rounded-full opacity-75 blur-sm"></div>
                          <Badge className="relative bg-gradient-to-r from-red-600 to-blue-600 text-white border-0 px-4 py-1 font-bold">
                            ÖNE ÇIKAN
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 text-muted-foreground bg-slate-100 dark:bg-slate-800 rounded-full px-3 py-1">
                          <Calendar className="h-4 w-4" />
                          <span className="text-sm font-medium">
                            {safeGetDate(featuredAnnouncements[0]?.publishDate || featuredAnnouncements[0]?.frontmatter?.date)}
                          </span>
                        </div>
                      </div>
                      
                      {/* Başlık */}
                      <h3 className="text-3xl lg:text-4xl font-black mb-6 leading-tight group-hover:bg-gradient-to-r group-hover:from-red-600 group-hover:to-blue-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
                        {safeGetTitle(featuredAnnouncements[0])}
                      </h3>
                      
                      {/* Açıklama */}
                      <p className="text-muted-foreground mb-8 text-lg leading-relaxed bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-6 border border-slate-200/50 dark:border-slate-700/50">
                        {safeGetDescription(featuredAnnouncements[0])}
                      </p>
                      
                      {/* Modern CTA */}
                      <div className="relative inline-block w-fit">
                        <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition-all duration-300 animate-pulse"></div>
                        <Button size="lg" asChild className="relative bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white border-0 rounded-2xl px-8 py-4 font-bold text-lg shadow-2xl">
                          <Link href={`/duyurular/${featuredAnnouncements[0]?.slug || featuredAnnouncements[0]?.id || '#'}`}>
                            Devamını Oku
                            <ArrowRight className="ml-3 h-5 w-5" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              </div>
            </div>
          )}

          {/* Magazine Style Bento Grid Layout */}
          <div className="relative mb-16 -mx-8 sm:-mx-12 lg:-mx-16">
            {/* Mobile Responsive Grid Container - No Gaps */}
            <div className="flex flex-wrap w-full">
              
              {/* Mobile Optimized Featured Haber */}
              {latestAnnouncements[0] && (
                <div className="w-full sm:w-2/3 lg:w-2/3 group">
                  <div className="relative h-64 sm:h-80 lg:h-96 overflow-hidden bg-gradient-to-br from-red-500 via-red-600 to-red-700 shadow-xl lg:shadow-2xl group-hover:shadow-red-500/25 transition-all duration-500">
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      {latestAnnouncements[0]?.featuredImage ? (
                        <Image
                          src={latestAnnouncements[0].featuredImage}
                          alt={safeGetTitle(latestAnnouncements[0])}
                          fill
                          className="object-cover opacity-60"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-[url('/images/fallback/hero-bg.jpg')] bg-cover bg-center opacity-60"></div>
                      )}
                      <div className="absolute inset-0 bg-gradient-to-br from-red-500/50 via-red-600/40 to-red-700/50"></div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_70%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:25px_25px] opacity-30"></div>
                    </div>
                    
                    {/* Animated Background Pattern */}
                    <div className="absolute inset-0">
                      {[...Array(30)].map((_, i) => (
                        <div
                          key={i}
                          className="absolute w-2 h-2 bg-white/10 rounded-full animate-pulse"
                          style={{
                            left: `${Math.random() * 100}%`,
                            top: `${Math.random() * 100}%`,
                            animationDelay: `${Math.random() * 3}s`,
                            animationDuration: `${2 + Math.random() * 2}s`
                          }}
                        />
                      ))}
                    </div>
                    
                    {/* Mobile Optimized Content */}
                    <div className="relative h-full flex flex-col justify-between p-4 sm:p-6 lg:p-8 text-white">
                      {/* Mobile Optimized Header */}
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-2 lg:gap-3">
                          <div className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/20 backdrop-blur-sm rounded-xl lg:rounded-2xl flex items-center justify-center">
                            <Calendar className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6" />
                          </div>
                          <div>
                            <p className="text-xs font-black uppercase tracking-wide lg:tracking-widest opacity-80">
                              {latestAnnouncements[0]?.frontmatter?.tags?.[0] || latestAnnouncements[0]?.tags?.[0] || 'DUYURU'}
                            </p>
                            <p className="text-xs lg:text-sm opacity-60">
                              {safeGetDate(latestAnnouncements[0]?.publishDate || latestAnnouncements[0]?.frontmatter?.date)}
                            </p>
                          </div>
                        </div>
                        <div className="w-6 h-6 lg:w-8 lg:h-8 bg-white/20 rounded-full flex items-center justify-center text-xs font-black">
                          01
                        </div>
                      </div>
                      
                      {/* Mobile Optimized Main Content */}
                      <div className="space-y-3 lg:space-y-4">
                        <h2 className="text-xl sm:text-2xl lg:text-3xl xl:text-4xl font-black leading-tight">
                          {safeGetTitle(latestAnnouncements[0])}
                        </h2>
                        <p className="text-sm sm:text-base lg:text-lg opacity-90 leading-relaxed line-clamp-2 lg:line-clamp-3">
                          {safeGetDescription(latestAnnouncements[0])}
                        </p>
                        <Link 
                          href={`/duyurular/${latestAnnouncements[0]?.slug || latestAnnouncements[0]?.id || '#'}`}
                          className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 lg:px-6 lg:py-3 font-bold text-xs lg:text-sm hover:bg-white/30 transition-all duration-300 group-hover:translate-x-2"
                        >
                          Devamını Oku
                          <ArrowRight className="h-3 w-3 lg:h-4 lg:w-4" />
                        </Link>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute -top-4 -right-4 w-20 h-20 bg-white/10 rounded-full blur-xl animate-pulse"></div>
                    <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-white/5 rounded-full blur-2xl"></div>
                  </div>
                </div>
              )}
              
              {/* Mobile Responsive Orta Boyut Haberler */}
              <div className="w-full sm:w-1/3 lg:w-1/3 flex flex-col">
              {latestAnnouncements.slice(1, 3).map((announcement: any, index: number) => (
                <div key={`announcement-${index + 1}`} className="w-full group flex-1">
                  <div className={`relative h-40 sm:h-44 lg:h-48 overflow-hidden shadow-lg lg:shadow-xl transition-all duration-500 ${
                    index === 0 
                      ? 'bg-gradient-to-br from-blue-500 to-blue-700 group-hover:shadow-blue-500/25' 
                      : 'bg-gradient-to-br from-purple-500 to-purple-700 group-hover:shadow-purple-500/25'
                  } group-hover:scale-105`}>
                    {/* Background Image */}
                    <div className="absolute inset-0">
                      {announcement.featuredImage ? (
                        <Image
                          src={announcement.featuredImage}
                          alt={safeGetTitle(announcement)}
                          fill
                          className="object-cover opacity-50"
                        />
                      ) : (
                        <div className={`absolute inset-0 bg-cover bg-center opacity-50 ${
                          index === 0 
                                            ? "bg-[url('/images/fallback/event-1.jpg')]"
                : "bg-[url('/images/fallback/event-2.jpg')]"
                        }`}></div>
                      )}
                      <div className={`absolute inset-0 ${
                        index === 0 
                          ? 'bg-gradient-to-br from-blue-500/50 to-blue-700/50' 
                          : 'bg-gradient-to-br from-purple-500/50 to-purple-700/50'
                      }`}></div>
                      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.1)_25%,transparent_25%)] bg-[length:15px_15px] opacity-25"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-6 text-white">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center">
                            <Calendar className="h-4 w-4" />
                          </div>
                          <span className="text-xs font-bold opacity-80">
                            {safeGetDate(announcement?.publishDate || announcement?.frontmatter?.date)}
                          </span>
                        </div>
                        <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center text-xs font-black">
                          {String(index + 2).padStart(2, '0')}
                        </div>
                      </div>
                      
                      <div className="space-y-3">
                        <h3 className="text-lg font-bold leading-tight line-clamp-2">
                          {safeGetTitle(announcement)}
                        </h3>
                        <p className="text-sm opacity-80 line-clamp-2">
                          {safeGetDescription(announcement)}
                        </p>
                        <Link 
                          href={`/duyurular/${announcement.slug || announcement.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold opacity-90 hover:opacity-100 transition-opacity group-hover:translate-x-1 transition-transform duration-300"
                        >
                          Oku
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
              
              {/* Mobile Responsive Küçük Haberler */}
              <div className="w-full flex flex-wrap">
              {latestAnnouncements.slice(3, 6).map((announcement: any, index: number) => (
                <div key={`announcement-small-${index + 3}`} className="w-full sm:w-1/2 lg:w-1/3 group">
                  <div className={`relative h-32 sm:h-36 lg:h-40 overflow-hidden shadow-md lg:shadow-lg transition-all duration-500 ${
                    index === 0 
                      ? 'bg-gradient-to-br from-emerald-500 to-emerald-700 group-hover:shadow-emerald-500/25' 
                      : index === 1
                      ? 'bg-gradient-to-br from-orange-500 to-orange-700 group-hover:shadow-orange-500/25'
                      : 'bg-gradient-to-br from-pink-500 to-pink-700 group-hover:shadow-pink-500/25'
                  } group-hover:scale-105`}>
                    {/* Background Image Simulation */}
                    <div className="absolute inset-0">
                      <div className={`absolute inset-0 bg-cover bg-center opacity-55 ${
                        index === 0 
                                          ? "bg-[url('/images/fallback/announcement-1.jpg')]"
                : index === 1
                ? "bg-[url('/images/fallback/announcement-2.jpg')]"
                : "bg-[url('/images/fallback/announcement-3.jpg')]"
                      }`}></div>
                      <div className={`absolute inset-0 ${
                        index === 0 
                          ? 'bg-gradient-to-br from-emerald-500/45 to-emerald-700/45' 
                          : index === 1
                          ? 'bg-gradient-to-br from-orange-500/45 to-orange-700/45'
                          : 'bg-gradient-to-br from-pink-500/45 to-pink-700/45'
                      }`}></div>
                      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_30%,rgba(255,255,255,0.15)_1px,transparent_1px)] bg-[length:12px_12px] opacity-30"></div>
                    </div>
                    
                    {/* Content */}
                    <div className="relative h-full flex flex-col justify-between p-4 text-white">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 bg-white/20 rounded-lg flex items-center justify-center">
                            <Calendar className="h-3 w-3" />
                          </div>
                          <span className="text-xs font-bold opacity-80">
                            {safeGetDate(announcement?.publishDate || announcement?.frontmatter?.date)}
                          </span>
                        </div>
                        <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center text-xs font-black">
                          {String(index + 4).padStart(2, '0')}
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-bold leading-tight line-clamp-2">
                          {safeGetTitle(announcement)}
                        </h3>
                        <p className="text-xs opacity-80 line-clamp-2">
                          {safeGetDescription(announcement)}
                        </p>
                        <Link 
                          href={`/duyurular/${announcement.slug || announcement.id}`}
                          className="inline-flex items-center gap-1 text-xs font-bold opacity-90 hover:opacity-100 transition-opacity group-hover:translate-x-1 transition-transform duration-300"
                        >
                          Oku
                          <ArrowRight className="h-3 w-3" />
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
              </div>
            </div>
          </div>

          {/* Mobile Responsive CTA */}
          <div className="relative px-4">
            <div className="bg-gradient-to-r from-slate-900 via-red-900 to-blue-900 dark:from-slate-800 dark:via-red-800 dark:to-blue-800 rounded-2xl lg:rounded-3xl p-6 lg:p-8 shadow-xl lg:shadow-2xl overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute inset-0 opacity-10">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_25%,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[length:30px_30px] lg:bg-[length:50px_50px]"></div>
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_75%_75%,rgba(255,255,255,0.1)_1px,transparent_1px)] bg-[length:20px_20px] lg:bg-[length:30px_50px]"></div>
              </div>
              
              {/* Mobile Optimized Content */}
              <div className="relative text-center text-white">
                <div className="inline-flex items-center gap-1.5 lg:gap-2 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1.5 lg:px-4 lg:py-2 mb-4 lg:mb-6">
                  <div className="w-1.5 h-1.5 lg:w-2 lg:h-2 bg-red-400 rounded-full animate-pulse"></div>
                  <span className="text-xs lg:text-sm font-bold uppercase tracking-wider">Daha Fazla Haber</span>
                </div>
                
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black mb-3 lg:mb-4">
                  Tüm Duyuruları Keşfet
                </h3>
                
                <p className="text-sm sm:text-base lg:text-lg opacity-90 mb-6 lg:mb-8 max-w-sm sm:max-w-md lg:max-w-2xl mx-auto">
                  Sendikamızdan tüm güncel haberler, duyurular ve önemli gelişmeleri takip edin
                </p>
                
                <Link 
                  href="/duyurular"
                  className="inline-flex items-center gap-2 lg:gap-3 bg-white text-slate-900 px-6 py-3 lg:px-8 lg:py-4 rounded-xl lg:rounded-2xl font-bold text-base lg:text-lg shadow-lg lg:shadow-xl hover:shadow-xl lg:hover:shadow-2xl hover:scale-105 transition-all duration-300 group"
                >
                  Tüm Duyuruları Gör
                  <ArrowRight className="h-4 w-4 lg:h-5 lg:w-5 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
              
              {/* Decorative Elements */}
              <div className="absolute top-8 right-8 w-16 h-16 bg-white/5 rounded-full"></div>
              <div className="absolute bottom-8 left-8 w-24 h-24 bg-white/5 rounded-full"></div>
              <div className="absolute top-1/2 right-16 w-8 h-8 bg-red-400/20 rounded-full animate-pulse"></div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Kamu-AR Öne Çıkanlar */}
      {kamuFeatured.length > 0 && (
        <Section padding="xl" background="muted">
          <Container>
            <h2 className="text-2xl md:text-3xl font-bold mb-6">Kamu-AR Öne Çıkanlar</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {kamuFeatured.map((it: any) => (
                <Link key={it._id} href={`/kamu-ar/${it.slug}`} className="group block rounded-xl overflow-hidden border bg-white dark:bg-gray-900">
                  <div className="relative aspect-[16/9] bg-black/5">
                    {it.coverImage && (
                      <Image src={it.coverImage} alt={it.title} fill className="object-cover" />
                    )}
                  </div>
                  <div className="p-4">
                    <div className="text-xs text-primary/80 mb-1">{it.category || 'Genel'}</div>
                    <div className="font-semibold line-clamp-2 group-hover:text-primary">{it.title}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Sendika Hakkında - Modern Timeline */}
      <Section padding="lg">
        <Container>
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Sendikamızın Gücü
            </h2>

          </div>
          
          <div className="grid lg:grid-cols-3 gap-8 mb-12">
            {/* Sol Kolon - Misyon */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/50 dark:to-indigo-950/50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Shield className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-blue-700 dark:text-blue-300">Misyonumuz</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {siteData?.mission?.mission || "Kamu çalışanlarının haklarını korumak, sosyal ve ekonomik durumlarını iyileştirmek, demokratik ve laik cumhuriyeti desteklemek."}
                </p>
                {!siteData?.mission?.mission && (
                  <p className="text-xs text-orange-600 mt-2">⚠️ Admin panelinden misyon bilgisini güncelleyin</p>
                )}
              </CardContent>
            </Card>

            {/* Orta Kolon - Vizyon */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-green-50 to-emerald-50 dark:from-green-950/50 dark:to-emerald-950/50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <TrendingUp className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-green-700 dark:text-green-300">Vizyonumuz</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {siteData?.mission?.vision || "Türkiye'nin en güçlü ve etkili kamu sendikası olmak, çalışanların sesini en yüksek perdeden duyurmak."}
                </p>
              </CardContent>
            </Card>

            {/* Sağ Kolon - Değerler */}
            <Card className="relative overflow-hidden border-0 bg-gradient-to-br from-purple-50 to-violet-50 dark:from-purple-950/50 dark:to-violet-950/50">
              <CardContent className="p-8">
                <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-violet-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                  <Award className="h-8 w-8 text-white" />
                </div>
                <h3 className="text-2xl font-bold mb-4 text-purple-700 dark:text-purple-300">Değerlerimiz</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {siteData?.mission?.values || "Adalet, eşitlik, dayanışma, şeffaflık ve demokratik katılım ilkelerimizle hareket ediyoruz."}
                </p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* Ultra Modern Galeri */}
      <Section padding="xl" background="muted">
        <Container>
          {/* Modern Başlık */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 bg-gradient-to-r from-red-500/10 to-blue-500/10 backdrop-blur-sm rounded-full px-6 py-2 mb-6 border border-red-200/20 dark:border-red-700/20">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm font-bold text-red-600 dark:text-red-400 uppercase tracking-wider">Galeri</span>
            </div>
            <h2 className="text-4xl md:text-6xl font-black mb-6">
              <span className="bg-gradient-to-r from-slate-900 via-red-600 to-blue-600 bg-clip-text text-transparent dark:from-white dark:via-red-400 dark:to-blue-400">
                Etkinliklerimiz
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Sendikamızın düzenlediği etkinliklerden ve özel anlarımızdan kareler
            </p>
            <div className="mt-6 h-1 w-24 bg-gradient-to-r from-red-500 to-blue-500 rounded-full mx-auto"></div>
          </div>

          {/* Ultra Modern Galeri Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
            {([...allEvents].sort((a: any, b: any) => new Date(b.date || b.publishDate || 0).getTime() - new Date(a.date || a.publishDate || 0).getTime()).slice(0, 8)).map((ev: any, idx: number) => (
              <Link href={`/etkinlikler/${ev.slug || ev._id || ev.id || '#'}`} key={ev._id || ev.id || ev.slug || idx} className="group relative">
                {/* Glow Effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-red-600/20 to-blue-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur-xl transition-all duration-500"></div>
                
                {/* Card */}
                <Card className="relative overflow-hidden border-0 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-2xl shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <div className="relative aspect-square overflow-hidden">
                    {ev.featuredImage ? (
                      <Image src={ev.featuredImage} alt={safeGetTitle(ev)} fill className="object-cover" />
                    ) : (
                      <div className="absolute inset-0 bg-gradient-to-br from-slate-50 via-red-50 to-blue-50 dark:from-slate-800 dark:via-red-900/20 dark:to-blue-900/20" />
                    )}
                    {/* Content */}
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center">
                        <div className="w-16 h-16 bg-gradient-to-br from-red-500 to-blue-500 rounded-2xl flex items-center justify-center mb-3 mx-auto shadow-lg group-hover:rotate-12 transition-transform duration-500">
                          <Calendar className="h-8 w-8 text-white" />
                        </div>
                        <p className="text-sm font-bold text-slate-700 dark:text-slate-300">{safeGetTitle(ev)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{safeGetYear(ev)}</p>
                      </div>
                    </div>
                    
                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="absolute bottom-4 left-4 right-4">
                        <p className="text-white text-xs font-medium">Detayları Gör</p>
                      </div>
                    </div>
                    
                    {/* Decorative Elements */}
                    <div className="absolute top-2 right-2 w-3 h-3 bg-gradient-to-r from-red-400 to-blue-400 rounded-full opacity-60 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>
                </Card>
              </Link>
            ))}
          </div>

          {/* Modern CTA */}
          <div className="text-center">
            <div className="relative inline-block group">
              <div className="absolute -inset-2 bg-gradient-to-r from-red-600 via-blue-600 to-red-600 rounded-2xl opacity-75 group-hover:opacity-100 blur-lg transition-all duration-300 animate-pulse"></div>
              <Button size="lg" asChild className="relative bg-gradient-to-r from-red-600 to-blue-600 hover:from-red-700 hover:to-blue-700 text-white border-0 rounded-2xl px-8 py-4 font-bold text-lg shadow-2xl">
                <Link href="/galeri">
                  Tüm Galeriyi Keşfet
                  <ArrowRight className="ml-3 h-5 w-5" />
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}