import Link from "next/link"
import Image from "next/image"
import { Calendar, ExternalLink, Download, Eye, Newspaper, Video, Mic } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/Section"
import { Container } from "@/components/Container"
import { generatePageSEO } from "@/lib/seo"

export const metadata = generatePageSEO({
  title: "Basın Yayın",
  description: "Sendikamızın basın açıklamaları, medya görünümleri, röportajlar ve yayın faaliyetleri.",
  path: "/basin-yayin"
})

async function getPressFromAPI() {
  try {
            // Relative URL kullan - hem local hem Vercel'de çalışır
      const response = await fetch(`/api/press`, { cache: 'no-store' })
    if (!response.ok) return []
    const result = await response.json()
    return result.success ? result.data : []
  } catch {
    return []
  }
}

const mediaAppearances = [
  {
    id: "tv-roportaj-1",
    title: "TRT Haber - Kamu Çalışanlarının Durumu",
    description: "Genel Başkanımızın TRT Haber'de kamu çalışanlarının mevcut durumu hakkında röportajı.",
    date: "2024-03-15",
    type: "TV Röportajı",
    platform: "TRT Haber",
    url: "https://www.youtube.com/watch?v=example1",
    duration: "12:30"
  },
  {
    id: "radyo-program-1",
    title: "Radyo Programı - Sendikacılığın Geleceği",
    description: "Radyo programında sendikacılığın geleceği ve dijital dönüşüm konuları ele alındı.",
    date: "2024-02-28",
    type: "Radyo Programı",
    platform: "TRT Radyo 1",
    url: "https://www.trtradyo1.com.tr/example",
    duration: "45:00"
  },
  {
    id: "gazete-roportaj-1",
    title: "Cumhuriyet Gazetesi - Özel Röportaj",
    description: "Cumhuriyet Gazetesi'ne verilen özel röportajda sendika politikaları değerlendirildi.",
    date: "2024-01-20",
    type: "Gazete Röportajı",
    platform: "Cumhuriyet",
    url: "https://www.cumhuriyet.com.tr/example",
    duration: null
  }
]

const publications = [
  {
    id: "sendika-bulteni-2024-1",
    title: "Sendika Bülteni - Mart 2024",
    description: "Aylık sendika bültenimizin Mart 2024 sayısı. Güncel gelişmeler ve üye haberleri.",
    date: "2024-03-01",
    type: "Dergi",
    pages: "24 sayfa",
    downloadUrl: "/publications/bulten-mart-2024.pdf",
    coverImage: "https://res.cloudinary.com/demo/image/upload/v1640995392/cld-sample-4.jpg"
  },
  {
    id: "yillik-rapor-2023",
    title: "2023 Yılı Faaliyet Raporu",
    description: "2023 yılında gerçekleştirilen tüm faaliyetlerin detaylı raporu.",
    date: "2024-01-15",
    type: "Rapor",
    pages: "68 sayfa",
    downloadUrl: "/publications/faaliyet-raporu-2023.pdf",
    coverImage: "https://res.cloudinary.com/demo/image/upload/v1640995392/cld-sample-5.jpg"
  }
]

const socialMediaStats = [
  {
    platform: "Twitter",
    followers: "15.2K",
    engagement: "4.8%",
    url: "https://twitter.com/kultursanatis"
  },
  {
    platform: "Instagram",
    followers: "8.7K",
    engagement: "6.2%",
    url: "https://instagram.com/kultursanatis"
  },
  {
    platform: "Facebook",
    followers: "22.1K",
    engagement: "3.4%",
    url: "https://facebook.com/kultursanatis"
  },
  {
    platform: "LinkedIn",
    followers: "5.3K",
    engagement: "7.1%",
    url: "https://linkedin.com/company/kultursanatis"
  }
]

export default async function BasinYayinPage() {
  const pressItems = await getPressFromAPI()

  return (
    <>
      {/* Hero Section */}
      <Section padding="xl" background="muted">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Basın Yayın
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Sendikamızın basın açıklamaları, medya görünümleri, yayınları ve sosyal medya faaliyetleri
            </p>
          </div>
        </Container>
      </Section>

      {/* Sosyal Medya İstatistikleri */}
      <Section padding="lg">
        <Container>
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-4">Sosyal Medya Takipçilerimiz</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {socialMediaStats.map((stat, index) => (
              <Card key={index} className="text-center hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="text-2xl font-bold text-primary mb-1">
                    {stat.followers}
                  </div>
                  <div className="font-semibold mb-1">{stat.platform}</div>
                  <div className="text-sm text-muted-foreground mb-3">
                    Etkileşim: {stat.engagement}
                  </div>
                  <Button size="sm" variant="outline" asChild>
                    <a href={stat.url} target="_blank" rel="noopener noreferrer">
                      <ExternalLink className="h-3 w-3 mr-1" />
                      Takip Et
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Öne Çıkan Basın Açıklamaları */}
      <Section padding="xl">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Son Basın Açıklamaları
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Sendikamızın güncel basın açıklamaları ve duyuruları
            </p>
          </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {pressItems.slice(0, 4).map((release: any) => (
              <Card key={release.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-[16/9] overflow-hidden">
                  <Image
                    src={release.thumbnail || 'https://images.unsplash.com/photo-1586339949916-3e9457bef6d3?w=1200&h=675&fit=crop'}
                    alt={release.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-3">
                        {release.category || release.type}
                      </Badge>
                      <CardTitle className="text-xl mb-2">{release.title}</CardTitle>
                    </div>
                    <div className="text-sm text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(release.date).toLocaleDateString('tr-TR')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {release.summary || ''}
                  </p>
                  <div className="flex gap-2">
                    <Button size="sm" asChild>
                      <a href={release.url} target="_blank" rel="noopener noreferrer">
                        <Download className="h-3 w-3 mr-1" />
                        Bağlantı
                      </a>
                    </Button>
                    <Button size="sm" variant="outline">
                      <Eye className="h-3 w-3 mr-1" />
                      Oku
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Medya Görünümleri */}
      <Section padding="xl" background="muted">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Medya Görünümleri
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              TV, radyo ve gazete röportajlarımız
            </p>
          </div>

          <div className="space-y-6">
            {mediaAppearances.map((appearance) => {
              const getIcon = (type: string) => {
                if (type.includes('TV')) return Video
                if (type.includes('Radyo')) return Mic
                return Newspaper
              }
              
              const Icon = getIcon(appearance.type)
              
              return (
                <Card key={appearance.id} className="hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-start justify-between mb-2">
                          <h3 className="font-semibold text-lg">{appearance.title}</h3>
                          <div className="text-sm text-muted-foreground flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(appearance.date).toLocaleDateString('tr-TR')}
                          </div>
                        </div>
                        <div className="flex items-center gap-4 mb-3">
                          <Badge variant="outline">{appearance.type}</Badge>
                          <span className="text-sm text-muted-foreground">{appearance.platform}</span>
                          {appearance.duration && (
                            <span className="text-sm text-muted-foreground">
                              Süre: {appearance.duration}
                            </span>
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4">
                          {appearance.description}
                        </p>
                        <Button size="sm" variant="outline" asChild>
                          <a href={appearance.url} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-3 w-3 mr-1" />
                            İzle/Dinle
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Yayınlar */}
      <Section padding="xl">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Yayınlarımız
            </h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Dergi, bülten ve raporlarımız
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {publications.map((publication) => (
              <Card key={publication.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-[3/4] overflow-hidden">
                  <Image
                    src={publication.coverImage}
                    alt={publication.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <Badge variant="secondary" className="mb-3">
                        {publication.type}
                      </Badge>
                      <CardTitle className="text-xl mb-2">{publication.title}</CardTitle>
                    </div>
                    <div className="text-sm text-muted-foreground text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(publication.date).toLocaleDateString('tr-TR')}
                      </div>
                      <div>{publication.pages}</div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4 leading-relaxed">
                    {publication.description}
                  </p>
                  <Button asChild>
                    <a href={publication.downloadUrl} download>
                      <Download className="h-4 w-4 mr-2" />
                      PDF İndir
                    </a>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Basın İletişim */}
      <Section padding="lg" background="muted">
        <Container>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Basın İletişim
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Basın mensupları için özel iletişim kanallarımız. Röportaj talepleri ve basın açıklamaları için bizimle iletişime geçin.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <a href="mailto:basin@ornek-sendika.org">
                  Basın İletişim
                </a>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <a href="tel:+902121234567">
                  Basın Telefonu: 0212 123 45 67
                </a>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
