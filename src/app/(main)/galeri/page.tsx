import { Eye } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogTrigger, DialogTitle } from "@/components/ui/dialog"
import { Section } from "@/components/Section"
import { Container } from "@/components/Container"
import { generatePageSEO } from "@/lib/seo"

export const metadata = generatePageSEO({
  title: "Galeri",
  description: "Sendikamızın etkinlikleri, toplantıları ve özel anlarından fotoğraflar.",
  path: "/galeri"
})

async function getMedia() {
  try {
    // Relative URL kullan - hem local hem Vercel'de çalışır
    const res = await fetch(`/api/media?status=published`, { cache: 'no-store' })
    const json = await res.json()
    return json.success ? json.data : []
  } catch { return [] }
}

export default async function GaleriPage() {
  const items = await getMedia()
  return (
    <>
      {/* Hero Section */}
      <Section padding="xl" background="muted">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Galeri
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Sendikamızın etkinlikleri, toplantıları ve özel anlarından fotoğraflar
            </p>
          </div>
        </Container>
      </Section>

      {/* Tüm Fotoğraflar - API'den */}
      <Section padding="xl" background="muted">
        <Container>
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Tüm Fotoğraflar
            </h2>
            <p className="text-muted-foreground">Toplam {items.length} medya</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {items.map((m: any) => (
              <ImageCard key={m._id} image={{
                id: m._id,
                title: m.title,
                description: '',
                image: m.thumbnail || m.url,
                category: m.category || 'Genel',
                date: m.uploadDate,
                tags: m.tags || []
              }} />
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

interface ImageCardProps {
  image: {
    id: string
    title: string
    description: string
    image: string
    category: string
    date: string
    tags: string[]
  }
}

function ImageCard({ image }: ImageCardProps) {
  return (
    <Card className="overflow-hidden group hover:shadow-lg transition-all duration-200">
      <div className="relative aspect-[4/3] overflow-hidden">
        <Dialog>
          <DialogTrigger asChild>
            <div className="relative cursor-pointer">
               <img
                src={image.image}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
               />
              <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-200 flex items-center justify-center">
                <Eye className="h-6 w-6 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
              </div>
            </div>
          </DialogTrigger>
          <DialogContent className="max-w-4xl">
            <DialogTitle>{image.title}</DialogTitle>
             <img
              src={image.image}
              alt={image.title}
              className="w-full h-auto"
             />
          </DialogContent>
        </Dialog>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-center justify-between mb-2">
          <Badge variant="outline" className="text-xs">{image.category}</Badge>
          <span className="text-xs text-muted-foreground">
            {new Date(image.date).toLocaleDateString('tr-TR')}
          </span>
        </div>
        
        <h4 className="font-semibold mb-1 text-sm line-clamp-2">{image.title}</h4>
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">{image.description}</p>
        
        <div className="flex flex-wrap gap-1">
          {image.tags.slice(0, 2).map((tag) => (
            <Badge key={tag} variant="secondary" className="text-xs">
              {tag}
            </Badge>
          ))}
          {image.tags.length > 2 && (
            <Badge variant="secondary" className="text-xs">
              +{image.tags.length - 2}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  )
}
