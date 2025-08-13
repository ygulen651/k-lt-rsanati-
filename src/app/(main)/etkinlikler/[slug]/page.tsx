import Image from 'next/image'
import Link from 'next/link'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import { Calendar, Clock, MapPin, ArrowLeft } from 'lucide-react'

async function getEvent(slug: string) {
  try {
    // Relative URL kullan - Vercel'de daha güvenilir
    const res = await fetch(`/api/events?slug=${encodeURIComponent(slug)}`, { cache: 'no-store' })
    const json = await res.json()
    const items = json.success ? json.data : []
    return Array.isArray(items) ? items[0] : null
  } catch {
    return null
  }
}

export default async function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const ev = await getEvent(slug)

  if (!ev) {
    return (
      <Section padding="xl">
        <Container>
          <div className="text-center py-20">
            <h1 className="text-3xl font-bold mb-4">Etkinlik bulunamadı</h1>
            <Link href="/etkinlikler" className="inline-flex items-center text-primary">
              <ArrowLeft className="w-4 h-4 mr-2" /> Etkinliklere dön
            </Link>
          </div>
        </Container>
      </Section>
    )
  }

  const date = ev.date ? new Date(ev.date).toLocaleDateString('tr-TR') : ''

  return (
    <Section padding="xl">
      <Container>
        <div className="max-w-4xl mx-auto space-y-6">
          <Link href="/etkinlikler" className="inline-flex items-center text-primary">
            <ArrowLeft className="w-4 h-4 mr-2" /> Geri
          </Link>

          <h1 className="text-3xl font-bold">{ev.title}</h1>

          {ev.featuredImage && (
            <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-black/5">
              <Image src={ev.featuredImage} alt={ev.title} fill className="object-cover" />
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm text-muted-foreground">
            <div className="flex items-center gap-2"><Calendar className="w-4 h-4" /> {date}</div>
            {ev.time && <div className="flex items-center gap-2"><Clock className="w-4 h-4" /> {ev.time}</div>}
            {ev.location && <div className="flex items-center gap-2"><MapPin className="w-4 h-4" /> {ev.location}</div>}
          </div>

          {ev.description && (
            <div className="prose dark:prose-invert max-w-none">
              <p>{ev.description}</p>
            </div>
          )}
        </div>
      </Container>
    </Section>
  )
}


