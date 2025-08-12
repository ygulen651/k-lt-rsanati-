import Link from "next/link"
import { Calendar, MapPin, Clock, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Section } from "@/components/Section"
import { Container } from "@/components/Container"
import { getContentByType } from "@/lib/mdx"
import { generatePageSEO } from "@/lib/seo"
import { formatDate } from "@/lib/mdx"
import type { EventFrontmatter } from "@/lib/mdx"

export const metadata = generatePageSEO({
  title: "Etkinlikler",
  description: "Sendikamızın düzenlediği etkinlikler, seminerler, toplantılar ve özel günler.",
  path: "/etkinlikler"
})

export default async function EtkinliklerPage() {
  // Tüm etkinlikleri al
  const events = await getContentByType<EventFrontmatter>('etkinlikler')
  
  // Etkinlikleri tarihe göre sırala
  const sortedEvents = events.sort((a, b) => 
    new Date(a.frontmatter.date).getTime() - new Date(b.frontmatter.date).getTime()
  )
  
  // Yaklaşan ve geçmiş etkinlikleri ayır
  const now = new Date()
  const upcomingEvents = sortedEvents.filter(e => new Date(e.frontmatter.date) >= now)
  const pastEvents = sortedEvents.filter(e => new Date(e.frontmatter.date) < now)

  return (
    <>
      {/* Hero Section */}
      <Section padding="xl" background="muted">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Etkinlikler
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Sendikamızın düzenlediği etkinlikler, seminerler, toplantılar ve özel günler
            </p>
          </div>
        </Container>
      </Section>

      {/* Yaklaşan Etkinlikler */}
      {upcomingEvents.length > 0 && (
        <Section padding="xl">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Yaklaşan Etkinlikler
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Katılabileceğiniz güncel etkinliklerimiz
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {upcomingEvents.map((event) => (
                <EventCard key={event.slug} event={event} upcoming={true} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Geçmiş Etkinlikler */}
      {pastEvents.length > 0 && (
        <Section padding="xl" background="muted">
          <Container>
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                Geçmiş Etkinlikler
              </h2>
              <p className="text-muted-foreground">
                Daha önce düzenlediğimiz etkinlikler
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pastEvents.map((event) => (
                <EventCard key={event.slug} event={event} upcoming={false} />
              ))}
            </div>
          </Container>
        </Section>
      )}

      {/* Etkinlik Yoksa */}
      {events.length === 0 && (
        <Section padding="xl">
          <Container>
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-2xl font-bold mb-4">
                Henüz Etkinlik Bulunmamaktadır
              </h3>
              <p className="text-muted-foreground text-lg mb-6">
                Yakında düzenlenecek etkinliklerimiz için sosyal medya hesaplarımızı takip edin.
              </p>
              <Button asChild>
                <Link href="/iletisim">
                  İletişime Geçin
                </Link>
              </Button>
            </div>
          </Container>
        </Section>
      )}

      {/* Etkinlik Bilgilendirme */}
      <Section padding="lg">
        <Container>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Etkinliklerimizden Haberdar Olun
            </h3>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Düzenlediğimiz etkinlikler hakkında bilgi almak ve katılım sağlamak için 
              iletişim bilgilerimizi kullanabilirsiniz.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" asChild>
                <Link href="/iletisim">
                  İletişim Bilgileri
                </Link>
              </Button>
              <Button size="lg" variant="outline" asChild>
                <Link href="/duyurular">
                  Duyuruları İncele
                </Link>
              </Button>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

interface EventCardProps {
  event: {
    slug: string
    frontmatter: EventFrontmatter
  }
  upcoming: boolean
}

function EventCard({ event, upcoming }: EventCardProps) {
  const { frontmatter } = event
  
  return (
    <Card className={`h-full transition-all duration-200 hover:shadow-lg ${upcoming ? 'ring-2 ring-primary/20' : ''}`}>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-xl mb-2">
              {frontmatter.title}
            </CardTitle>
            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
              <Calendar className="h-4 w-4" />
              <span>{formatDate(frontmatter.date)}</span>
            </div>
          </div>
          {upcoming && (
            <Badge variant="default" className="ml-2">
              Yaklaşan
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        <p className="text-muted-foreground mb-4 line-clamp-3">
          {frontmatter.description}
        </p>
        
        <div className="space-y-2 mb-4">
          {frontmatter.location && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>{frontmatter.location}</span>
            </div>
          )}
          
          {frontmatter.time && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{frontmatter.time}</span>
            </div>
          )}
          
          {frontmatter.capacity && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Users className="h-4 w-4" />
              <span>Kapasite: {frontmatter.capacity} kişi</span>
            </div>
          )}
        </div>
        
        {frontmatter.tags && frontmatter.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4">
            {frontmatter.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex gap-2">
          <Button size="sm" asChild>
            <Link href={`/etkinlikler/${event.slug}`}>
              Detayları Gör
            </Link>
          </Button>
          
          {upcoming && frontmatter.registrationUrl && (
            <Button size="sm" variant="outline" asChild>
              <a href={frontmatter.registrationUrl} target="_blank" rel="noopener noreferrer">
                Kayıt Ol
              </a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
