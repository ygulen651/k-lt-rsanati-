import { Section } from '@/components/Section'
import { Container } from '@/components/Container'

async function getData() {
  const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
  const res = await fetch(`${baseUrl}/api/press?category=takvim`, { cache: 'no-store' })
  const json = await res.json()
  return json.success ? json.data : []
}

export default async function TakvimPage() {
  const items = await getData()
  return (
    <Section padding="xl">
      <Container>
        <h1 className="text-3xl font-bold mb-6">Çalışma Takvimi</h1>
        <div className="space-y-4">
          {items.map((it: any) => (
            <a key={it._id} href={it.fileUrl || it.url} target="_blank" className="block border rounded-lg p-4 hover:bg-muted">
              <div className="font-semibold">{it.title}</div>
              <div className="text-sm text-muted-foreground">{new Date(it.date).toLocaleDateString('tr-TR')}</div>
            </a>
          ))}
        </div>
        {items.length === 0 && <div className="text-muted-foreground">Henüz takvim eklenmemiş.</div>}
      </Container>
    </Section>
  )
}
