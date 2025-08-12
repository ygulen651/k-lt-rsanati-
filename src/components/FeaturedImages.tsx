import Image from "next/image"
import Link from "next/link"
import { ExternalLink } from "lucide-react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Section } from "./Section"

const featuredImages = [
  {
    id: "1",
    url: "https://res.cloudinary.com/demo/image/upload/v1640995392/cld-sample.jpg",
    title: "1 Mayıs Kutlaması 2024",
    description: "Taksim Meydanı'nda düzenlenen 1 Mayıs kutlamasından kareler"
  },
  {
    id: "2", 
    url: "https://res.cloudinary.com/demo/image/upload/v1640995392/cld-sample-2.jpg",
    title: "Eğitim Semineri",
    description: "Çalışan hakları eğitim seminerinden görüntüler"
  },
  {
    id: "3",
    url: "https://res.cloudinary.com/demo/image/upload/v1640995392/cld-sample-3.jpg", 
    title: "Genel Kurul Toplantısı",
    description: "2024 yılı genel kurul toplantısından anlar"
  },
  {
    id: "4",
    url: "https://res.cloudinary.com/demo/image/upload/v1640995392/cld-sample-4.jpg",
    title: "Sosyal Etkinlik",
    description: "Üyelerimiz için düzenlenen sosyal etkinlik"
  },
  {
    id: "5",
    url: "https://res.cloudinary.com/demo/image/upload/v1640995392/cld-sample-5.jpg",
    title: "Liderlik Eğitimi", 
    description: "Genç sendikacılar için liderlik geliştirme programı"
  },
  {
    id: "6",
    url: "https://res.cloudinary.com/demo/image/upload/v1640995392/cld-sample.jpg",
    title: "Dayanışma Etkinliği",
    description: "Üyelerimiz arasında dayanışmayı güçlendiren etkinlik"
  }
]

export function FeaturedImages() {
  return (
    <Section padding="xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Öne Çıkan Görseller
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Sendika faaliyetlerimizden ve etkinliklerimizden özel kareler
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        {featuredImages.map((image) => (
          <Card key={image.id} className="group overflow-hidden hover:shadow-lg transition-all duration-300">
            <div className="relative aspect-[4/3] overflow-hidden">
              <Image
                src={image.url}
                alt={image.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute bottom-0 left-0 right-0 p-4 text-white transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="font-semibold text-sm mb-1">{image.title}</h3>
                <p className="text-xs text-white/90 line-clamp-2">{image.description}</p>
              </div>
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center">
        <Button variant="outline" size="lg" asChild>
          <Link href="/galeri">
            Tüm Galeriyi Görüntüle
            <ExternalLink className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </div>
    </Section>
  )
}
