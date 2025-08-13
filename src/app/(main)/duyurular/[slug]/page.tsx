import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { ArrowLeft, Calendar, User, Eye, Share2, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog'

// API'den duyuru getir
async function getAnnouncementBySlug(slug: string) {
  try {
      // Relative URL kullan - Vercel'de çalışır
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://your-domain.vercel.app'
    
    const response = await fetch(`${baseUrl}/api/announcements`, {
      cache: 'no-store'
    })
    
    if (!response.ok) {
      return null
    }
    
    const result = await response.json()
    const announcements = result.success ? result.data : []
    
    return announcements.find((a: any) => a.slug === slug) || null
  } catch (error) {
    console.error('Error fetching announcement:', error)
    return null
  }
}

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

export default async function DuyuruDetayPage({ params }: PageProps) {
  const { slug } = await params
  const announcement = await getAnnouncementBySlug(slug)

  if (!announcement) {
    notFound()
  }

  return (
    <>
      {/* Hero Section - tam genişlik görsel + overlay + büyük başlık */}
      <div className="relative w-full">
        <div className="relative w-full aspect-[16/9] md:aspect-[18/9] lg:aspect-[21/9]">
          <Image
            src={announcement.featuredImage || '/images/placeholder-hero.jpg'}
            alt={announcement.title}
            fill
            priority
            sizes="100vw"
            className="object-contain"
          />
          {/* Alt taraftan yukarı güçlü koyu degrade */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
          {/* Üst tarafta hafif karartma ve okunurluk için */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-black/30 to-transparent" />
          <Container>
            <div className="absolute inset-0 flex items-end justify-center pb-8">
              <div className="w-full max-w-3xl md:max-w-4xl mx-auto text-center">
                {/* Breadcrumb */}
                <div className="flex items-center gap-2 mb-3">
                  <Link href="/" className="text-white/85 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-xs md:text-sm transition-colors">Ana Sayfa</Link>
                  <span className="text-white/60">/</span>
                  <Link href="/duyurular" className="text-white/85 hover:text-white bg-white/10 hover:bg-white/20 rounded-full px-3 py-1 text-xs md:text-sm transition-colors">Duyurular</Link>
                </div>
                {/* Başlık bloğu */}
                <div className="bg-black/35 backdrop-blur-sm rounded-2xl inline-block shadow-[0_10px_30px_rgba(0,0,0,0.25)] px-4 md:px-6 py-4 md:py-5">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge variant="secondary" className="bg-white/15 text-white border-white/20">
                      {announcement.category || 'Genel'}
                    </Badge>
                  </div>
                  <h1 className="text-3xl md:text-5xl font-extrabold text-white leading-tight md:leading-snug drop-shadow-md max-w-[68ch]">
                    {announcement.title}
                  </h1>
                </div>
                {/* Meta */}
                <div className="mt-4 flex flex-wrap items-center gap-6 text-white/85">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    <span>
                      {new Date(announcement.publishDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'long', day: 'numeric' })}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    <span>{announcement.author || 'Admin'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    <span>{announcement.views || 0} görüntülenme</span>
                  </div>
                </div>
              </div>
            </div>
          </Container>
        </div>
      </div>

      {/* Content */}
      <Section padding="xl">
        <Container>
          <div className="max-w-3xl mx-auto">
            {/* Özet */}
            {announcement.excerpt && (
              <div className="text-xl md:text-2xl leading-relaxed text-muted-foreground mb-10 p-6 bg-muted/50 rounded-2xl border border-muted">
                {announcement.excerpt}
              </div>
            )}

            {/* İçerik */}
            <div className="prose prose-lg md:prose-xl dark:prose-invert max-w-none">
              <div dangerouslySetInnerHTML={{ __html: announcement.content.replace(/\n/g, '<br />') }} />
            </div>

            {/* Dosya İndir */}
            {announcement.fileUrl && (
              <div className="mt-10">
                <Button asChild>
                  <a href={announcement.fileUrl} target="_blank" rel="noopener noreferrer">
                    <Download className="h-4 w-4 mr-2" /> Ek Dosyayı İndir
                  </a>
                </Button>
              </div>
            )}

            {/* Görsel Galerisi */}
            {announcement.images && announcement.images.length > 0 && (
              <div className="mt-12">
                <h3 className="text-xl font-semibold mb-4">Görseller</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                  {announcement.images.slice(0, 8).map((img: string, idx: number) => (
                    <div key={idx} className="relative group aspect-[4/3] rounded-xl overflow-hidden bg-black/5">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Image src={img} alt={`${announcement.title} görsel ${idx + 1}`} fill className="object-cover group-hover:scale-105 transition-transform" />
                        </DialogTrigger>
                        <DialogContent className="max-w-4xl">
                          <Image src={img} alt={`${announcement.title} görsel ${idx + 1}`} width={1200} height={800} className="w-full h-auto" />
                        </DialogContent>
                      </Dialog>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Etiketler + Paylaşım */}
            <div className="mt-12 pt-8 border-t flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                {announcement.tags && announcement.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {announcement.tags.map((tag: string, index: number) => (
                      <Badge key={index} variant="outline">{tag}</Badge>
                    ))}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(announcement.title)}`} target="_blank" rel="noopener noreferrer">Twitter</a>
                </Button>
                <Button variant="outline" size="sm" asChild>
                  <a href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(`/duyurular/${announcement.slug}`)}`} target="_blank" rel="noopener noreferrer">Facebook</a>
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </Section>

      {/* Son Duyurular */}
      <Section padding="xl" background="muted">
        <Container>
          <RelatedAnnouncements currentSlug={announcement.slug} />
        </Container>
      </Section>
    </>
  )
}

// Generate metadata
export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const announcement = await getAnnouncementBySlug(slug)
  
  if (!announcement) {
    return {
      title: 'Duyuru Bulunamadı - Kültür Sanat İş',
    }
  }

  return {
    title: `${announcement.title} - Kültür Sanat İş`,
    description: announcement.excerpt || 'Sendikamızın güncel duyuruları',
    openGraph: {
      title: announcement.title,
      description: announcement.excerpt,
      images: announcement.featuredImage ? [announcement.featuredImage] : [],
    },
  }
}

// İlgili duyurular (aynı kategoriden son 3 duyuru)
async function fetchRelated(category: string, currentSlug: string) {
  try {
          // Server-side için environment variable kullan
      const baseUrl = process.env.VERCEL_URL 
        ? `https://${process.env.VERCEL_URL}` 
        : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
      
      const res = await fetch(`${baseUrl}/api/announcements?status=published&category=${encodeURIComponent(category)}&limit=3`, { cache: 'no-store' })
    const json = await res.json()
    const items = json.success ? json.data : []
    return items.filter((x: any) => x.slug !== currentSlug).slice(0, 3)
  } catch {
    return []
  }
}

async function RelatedAnnouncements({ currentSlug }: { currentSlug: string }) {
  // Kategori bilgisine erişmek için duyuruyu tekrar almamamız için basit bir çözüm:
  const curr = await getAnnouncementBySlug(currentSlug)
  const items = curr ? await fetchRelated(curr.category || 'genel', currentSlug) : []

  if (!items.length) return null

  return (
    <div>
      <h3 className="text-2xl font-bold mb-6">İlgili Duyurular</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((it: any) => (
          <Link key={it._id} href={`/duyurular/${it.slug}`} className="group bg-white dark:bg-gray-900 rounded-xl overflow-hidden border hover:shadow-md transition-all">
            <div className="relative aspect-[16/9] bg-black/5">
              {it.featuredImage && (
                <Image src={it.featuredImage} alt={it.title} fill className="object-cover group-hover:scale-[1.02] transition-transform" />
              )}
            </div>
            <div className="p-4">
              <div className="text-xs text-muted-foreground mb-2">
                {new Date(it.publishDate).toLocaleDateString('tr-TR', { year: 'numeric', month: 'short', day: 'numeric' })}
              </div>
              <div className="font-semibold line-clamp-2 group-hover:text-primary">
                {it.title}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
