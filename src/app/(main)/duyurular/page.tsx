import Link from "next/link"
import { Search, Filter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { AnnouncementCard } from "@/components/AnnouncementCard"
import { Section } from "@/components/Section"
import { Container } from "@/components/Container"
import { getContentByType } from "@/lib/mdx"
import { generatePageSEO } from "@/lib/seo"
import type { AnnouncementFrontmatter } from "@/lib/mdx"

export const metadata = generatePageSEO({
  title: "Duyurular",
  description: "Sendikamızın güncel duyuruları, haberler ve önemli açıklamalar.",
  path: "/duyurular"
})

// API'den duyuruları getir
async function getAnnouncementsFromAPI() {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' 
      ? 'http://localhost:3000' 
      : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    
    const response = await fetch(`${baseUrl}/api/announcements?status=published`, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
      }
    })
    
    if (!response.ok) {
      console.warn(`API call failed with status ${response.status}`)
      return []
    }
    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error('Error fetching announcements from API:', error)
    return []
  }
}

export default async function DuyurularPage() {
  // API'den ve MDX'den duyuruları al
  let apiAnnouncements: any[] = []
  let mdxAnnouncements: any[] = []
  
  try {
    apiAnnouncements = await getAnnouncementsFromAPI()
  } catch (error) {
    console.log('API announcements error:', error)
  }
  
  try {
    mdxAnnouncements = await getContentByType<AnnouncementFrontmatter>('duyurular')
  } catch (error) {
    console.log('MDX announcements error:', error)
  }
  
  // API verilerini öncelikle kullan, yoksa MDX verilerini kullan
  const announcements = apiAnnouncements.length > 0 ? apiAnnouncements : mdxAnnouncements.map(a => ({
    id: a.slug,
    slug: a.slug,
    title: a.frontmatter.title,
    excerpt: a.frontmatter.excerpt || a.frontmatter.description || '',
    content: a.content,
    category: a.frontmatter.category,
    tags: a.frontmatter.tags || [],
    featuredImage: a.frontmatter.coverImage,
    status: 'published',
    featured: a.frontmatter.featured || false,
    publishDate: a.frontmatter.date,
    author: a.frontmatter.author || 'Admin',
    createdAt: a.frontmatter.date,
    updatedAt: a.frontmatter.date,
    readingTime: { text: '5 dk okuma' },
    url: `/duyurular/${a.slug}`,
    frontmatter: a.frontmatter
  }))
  
  console.log('Duyurular sayfası - Toplam duyuru sayısı:', announcements.length)
  
  // Öne çıkan duyurular
  const featuredAnnouncements = announcements.filter(a => a.featured)
  const regularAnnouncements = announcements.filter(a => !a.featured)
  
  // Tüm etiketleri topla
  const allTags = Array.from(
    new Set(
      announcements
        .flatMap(a => a.tags || a.frontmatter?.tags || [])
        .filter(Boolean)
    )
  )

  return (
    <>
      {/* Hero ve ara alan kaldırıldı: direkt kartlar */}

      {/* Öne Çıkan Duyurular */}
      {featuredAnnouncements.length > 0 && (
        <Section padding="xl">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Öne Çıkan Duyurular
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                En önemli ve güncel duyurularımız
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
              {featuredAnnouncements.map((announcement) => (
                <AnnouncementCard
                  key={announcement.slug}
                  announcement={announcement}
                  featured={true}
                />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Tüm Duyurular */}
      <Section padding="xl" background="muted">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tüm Duyurular
            </h2>
            <p className="text-muted-foreground">
              Toplam {announcements.length} duyuru
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regularAnnouncements.map((announcement) => (
              <AnnouncementCard
                key={announcement.slug}
                announcement={announcement}
              />
            ))}
          </div>

          {announcements.length === 0 && (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                Henüz duyuru bulunmamaktadır.
              </p>
            </div>
          )}
        </Container>
      </Section>

      {/* Bildirim Aboneliği */}
      <Section padding="lg">
        <Container>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Duyuru Bildirimlerini Kaçırmayın
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Önemli duyurularımızdan haberdar olmak için e-posta listemize katılın 
              veya sosyal medya hesaplarımızı takip edin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/iletisim">
                  E-posta Listesine Katıl
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="https://twitter.com/kultursanatis" target="_blank" rel="noopener noreferrer">
                  Twitter'da Takip Et
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
