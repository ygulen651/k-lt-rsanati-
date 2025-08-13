import { Section } from '@/components/Section'
import { Container } from '@/components/Container'
import Image from 'next/image'

async function getData() {
  const baseUrl = ""
  const res = await fetch(`${baseUrl}/api/press?category=afis`, { cache: 'no-store' })
  const json = await res.json()
  return json.success ? json.data : []
}

type PressListItem = {
  _id: string
  title: string
  fileUrl?: string
  url?: string
  thumbnail?: string
  images?: string[]
}

export default async function AfisPage() {
  const items = await getData()
  return (
    <Section padding="xl">
      <Container>
        <h1 className="text-3xl font-bold mb-6">Afişler</h1>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {items.map((it: PressListItem) => {
            const src = it.thumbnail || it.images?.[0] || '/placeholder.png'
            return (
              <a key={it._id} href={it.fileUrl || it.url} target="_blank" className="block border rounded-lg overflow-hidden">
                <div className="relative w-full aspect-[3/4] bg-black/5">
                  <Image
                    src={src}
                    alt={it.title}
                    fill
                    sizes="(max-width: 768px) 50vw, 25vw"
                    className="object-contain"
                  />
                </div>
                <div className="p-3 text-sm">{it.title}</div>
              </a>
            )
          })}
        </div>
        {items.length === 0 && <div className="text-muted-foreground">Henüz afiş eklenmemiş.</div>}
      </Container>
    </Section>
  )
}
