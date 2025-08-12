import { Section } from '@/components/Section'
import { Container } from '@/components/Container'

async function getData() {
  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  const res = await fetch(`${baseUrl}/api/press?category=video`, { cache: 'no-store' })
  const json = await res.json()
  return json.success ? json.data : []
}

export default async function VideoPage() {
  const items = await getData()
  return (
    <Section padding="xl">
      <Container>
        <h1 className="text-3xl font-bold mb-6">Videolar</h1>
        <div className="space-y-6">
          {items.map((it: any) => (
            <div key={it._id} className="border rounded-lg p-4">
              <div className="font-semibold mb-2">{it.title}</div>
              <a href={it.url || it.fileUrl} target="_blank" className="text-primary underline">İzle</a>
            </div>
          ))}
        </div>
        {items.length === 0 && <div className="text-muted-foreground">Henüz video eklenmemiş.</div>}
      </Container>
    </Section>
  )
}
