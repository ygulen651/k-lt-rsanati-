import Image from "next/image"
import { Mail, Phone, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Section } from "@/components/Section"
import { Container } from "@/components/Container"
import { generatePageSEO } from "@/lib/seo"
import fs from 'fs'
import path from 'path'

interface ManagementMember {
  id: string
  name: string
  position: string
  bio: string
  photo: string
  email: string
  phone: string
  experience: string
  education: string
}

export const metadata = generatePageSEO({
  title: "Yönetim Kurulu",
  description: "Sendikamızın yönetim kurulu üyeleri ve görevlileri hakkında bilgiler.",
  path: "/yonetim"
})

// Yönetim kurulu verilerini yükle (admin ile aynı kaynaktan)
async function getManagementData(): Promise<ManagementMember[]> {
  const filePath = path.join(process.cwd(), 'content', 'yonetim', 'yonetim-kurulu.json')
  if (!fs.existsSync(filePath)) return []
  const fileContents = fs.readFileSync(filePath, 'utf8')
  const all: ManagementMember[] = JSON.parse(fileContents)
  // Sadece genel Yönetim Kurulu grubunu göster
  return all.filter(m => (m as any)?.group === 'yonetim-kurulu')
}

export default async function YonetimPage() {
  const managementData = await getManagementData()
  const members = managementData as ManagementMember[]

  return (
    <>
      {/* Hero Section */}
      <Section padding="xl" background="muted">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Yönetim Kurulu
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Sendikamızı yöneten deneyimli ve alanında uzman yönetim kurulu üyelerimiz
            </p>
          </div>
        </Container>
      </Section>

      {/* Yönetim Kurulu Üyeleri */}
      <Section padding="xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {members.map((member) => (
              <Card key={member.id} className="overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-[4/3] overflow-hidden">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                      <User className="h-16 w-16 text-gray-400" />
                    </div>
                  )}
                </div>
                
                <CardHeader className="pb-3">
                  <div className="text-center">
                    <CardTitle className="text-xl mb-1">{member.name}</CardTitle>
                    <Badge variant="secondary" className="mb-3">
                      {member.position}
                    </Badge>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {member.bio}
                  </p>
                  
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="text-muted-foreground">Deneyim:</span>
                      <span className="font-medium">{member.experience}</span>
                    </div>
                    
                    <div className="text-muted-foreground">
                      <strong>Eğitim:</strong> {member.education}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${member.email}`}>
                        <Mail className="h-3 w-3 mr-1" />
                        E-posta
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href={`tel:${member.phone}`}>
                        <Phone className="h-3 w-3 mr-1" />
                        Ara
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* İletişim Bilgileri */}
      <Section background="muted" padding="lg">
        <Container>
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">
              Yönetim Kurulu ile İletişim
            </h2>
            <p className="text-muted-foreground mb-6">
              Sorularınız ve önerileriniz için yönetim kurulu üyelerimizle iletişime geçebilirsiniz.
            </p>
            <Button size="lg" asChild>
              <a href="mailto:yonetim@ornek-sendika.org">
                Yönetim Kuruluna Yazın
              </a>
            </Button>
          </div>
        </Container>
      </Section>
    </>
  )
}
