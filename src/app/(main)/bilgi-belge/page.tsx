import Link from "next/link"
import { FileText, Download, Calendar, Eye } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/Section"
import { Container } from "@/components/Container"
import { generatePageSEO } from "@/lib/seo"

export const metadata = generatePageSEO({
  title: "Bilgi ve Belgeler",
  description: "Sendikamızla ilgili önemli belgeler, tüzük, yönetmelikler ve bilgi dökümanları.",
  path: "/bilgi-belge"
})

// API'den belgeleri çek
async function getDocuments() {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/documents?showPrivate=false`, {
      cache: 'no-store' // Her zaman fresh data
    })
    
    if (!response.ok) {
      console.error('Documents fetch failed:', response.statusText)
      return []
    }
    
    const result = await response.json()
    return result.success ? result.data : []
  } catch (error) {
    console.error('Error fetching documents:', error)
    return []
  }
}

export default async function BilgiBelgePage() {
  const documents = await getDocuments()
  const categories = Array.from(new Set(documents.map((doc: any) => doc.category))) as string[]
  
  // Featured belgeleri ayır (admin panelinde işaretlenenler veya önemli kategoriler)
  const featuredDocs = documents.filter((doc: any) => 
    doc.category === 'Resmi Belgeler' || 
    doc.category === 'Yönetmelikler' ||
    doc.title.toLowerCase().includes('tüzük') ||
    doc.title.toLowerCase().includes('toplu sözleşme')
  ).slice(0, 4) // En fazla 4 öne çıkan

  const regularDocs = documents.filter((doc: any) => !featuredDocs.some((featured: any) => featured._id === doc._id))

  return (
    <>
      {/* Hero kaldırıldı - sayfa daha kompakt */}

      {/* Öne Çıkan Belgeler kaldırıldı */}

      {/* Tüm Belgeler */}
      <Section padding="lg" background="muted">
        <Container>
          <h2 className="text-3xl font-bold mb-6 text-center">Tüm Belgeler</h2>
          
          {/* Kategori Filtreleri */}
          <div className="flex flex-wrap gap-2 mb-6 justify-center">
            <Badge variant="default" className="cursor-pointer">
              Tümü
            </Badge>
            {categories.map((category, index) => (
              <Badge key={`${category}-${index}`} variant="outline" className="cursor-pointer hover:bg-primary hover:text-primary-foreground">
                {category}
              </Badge>
            ))}
          </div>

          {/* Belge Listesi */}
          <div className="space-y-4">
            {regularDocs.map((doc: any) => (
              <Card key={doc._id} className="hover:shadow-md transition-shadow duration-300">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-1">{doc.title}</h3>
                        <p className="text-muted-foreground text-sm mb-2">
                          {doc.description}
                        </p>
                        <div className="flex items-center gap-4 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {doc.category}
                          </Badge>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            {new Date(doc.uploadDate).toLocaleDateString('tr-TR')}
                          </span>
                          <span>{doc.type?.toUpperCase()} • {doc.size}</span>
                          <span>{doc.downloads} indirme</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 ml-4">
                      <Button size="sm" variant="outline" asChild>
                        <a href={doc.fileUrl} download={doc.fileName} target="_blank" rel="noopener noreferrer">
                          <Download className="h-3 w-3 mr-1" />
                          İndir
                        </a>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Yardım Bölümü */}
      <Section padding="lg">
        <Container>
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">
              Aradığınız Belgeyi Bulamadınız mı?
            </h3>
            <p className="text-muted-foreground mb-6">
              İhtiyacınız olan belge listede yoksa, bizimle iletişime geçin.
            </p>
            <Button size="lg" asChild>
              <Link href="/iletisim">
                İletişime Geçin
              </Link>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
