import Image from 'next/image'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'

async function getItem(slug: string) {
  try {
    const baseUrl = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000')
    const res = await fetch(`${baseUrl}/api/kamu-ar/${slug}`, { cache: 'no-store' })
    const json = await res.json()
    return json.success ? json.data : null
  } catch { return null }
}

interface PageProps { params: Promise<{ slug: string }> }

export default async function KamuArDetail({ params }: PageProps) {
  const { slug } = await params
  const it = await getItem(slug)
  if (!it) return null

  return (
    <>
      <Section padding="xl">
        <Container>
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl md:text-4xl font-extrabold mb-6">{it.title}</h1>
            {it.coverImage && (
              <div className="mb-8 rounded-2xl overflow-hidden">
                <div className="relative w-full aspect-[16/9]">
                  <Image src={it.coverImage} alt={it.title} fill className="object-contain bg-black/5" />
                </div>
              </div>
            )}
            {it.excerpt && (<p className="text-xl text-muted-foreground mb-6">{it.excerpt}</p>)}
            {it.content && (
              <div className="prose dark:prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: it.content.replace(/\n/g, '<br />') }} />
            )}
          </div>
        </Container>
      </Section>
    </>
  )
}


