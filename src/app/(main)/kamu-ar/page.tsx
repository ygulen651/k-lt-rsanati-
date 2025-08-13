import Link from 'next/link'
import Image from 'next/image'
import { Section } from '@/components/Section'
import { Container } from '@/components/Container'

async function getKamuAr(params?: { search?: string; category?: string; tag?: string }) {
  try {
    const baseUrl = ""
    const qs = new URLSearchParams()
    qs.set('status', 'published')
    if (params?.search) qs.set('search', params.search)
    if (params?.category) qs.set('category', params.category)
    if (params?.tag) qs.set('tag', params.tag)
    const res = await fetch(`${baseUrl}/api/kamu-ar?${qs.toString()}`, { cache: 'no-store' })
    const json = await res.json()
    return json.success ? json.data : []
  } catch { return [] }
}

export default async function KamuArListPage({ searchParams }: { searchParams?: Promise<{ q?: string; c?: string; t?: string }> }) {
  const sp = searchParams ? await searchParams : undefined
  const items = await getKamuAr({ search: sp?.q, category: sp?.c, tag: sp?.t })
  const featured = items.filter((x: any) => x.featured).slice(0, 2)
  const regular = items.filter((x: any) => !x.featured)

  return (
    <>
      {featured.length > 0 && (
        <Section padding="xl">
          <Container>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {featured.map((it: any) => (
                <Link key={it._id} href={`/kamu-ar/${it.slug}`} className="group block rounded-2xl overflow-hidden border bg-white dark:bg-gray-900">
                  <div className="relative aspect-[16/9]">
                    {it.coverImage && (
                      <Image src={it.coverImage} alt={it.title} fill className="object-cover group-hover:scale-[1.02] transition-transform" />
                    )}
                  </div>
                  <div className="p-6">
                    <div className="text-sm text-primary/80 mb-2">Kamu-AR</div>
                    <h2 className="text-xl md:text-2xl font-bold group-hover:text-primary line-clamp-2">{it.title}</h2>
                    {it.excerpt && (<p className="mt-2 text-muted-foreground line-clamp-2">{it.excerpt}</p>)}
                    <div className="mt-4 text-sm text-muted-foreground">{new Date(it.publishDate).toLocaleDateString('tr-TR')}</div>
                  </div>
                </Link>
              ))}
            </div>
          </Container>
        </Section>
      )}

      <Section padding="xl" background="muted">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {regular.map((it: any) => (
              <Link key={it._id} href={`/kamu-ar/${it.slug}`} className="group block rounded-2xl overflow-hidden border bg-white dark:bg-gray-900">
                <div className="relative aspect-[16/9] bg-black/5">
                  {it.coverImage && (
                    <Image src={it.coverImage} alt={it.title} fill className="object-cover group-hover:scale-[1.02] transition-transform" />
                  )}
                </div>
                <div className="p-5">
                  <div className="text-xs text-primary/80 mb-1">{it.category || 'Genel'}</div>
                  <h3 className="font-semibold line-clamp-2 group-hover:text-primary">{it.title}</h3>
                </div>
              </Link>
            ))}
          </div>

          {items.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">Henüz içerik yok.</div>
          )}
        </Container>
      </Section>
    </>
  )
}
