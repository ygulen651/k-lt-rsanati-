import { Suspense } from "react"
import { redirect } from "next/navigation"
import { AlertTriangle, Upload as UploadIcon } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Container } from "@/components/Container"
import { UploadWidget } from "@/components/UploadWidget"

interface UploadPageProps {
  searchParams: { key?: string }
}

function UploadContent({ searchParams }: UploadPageProps) {
  const providedKey = searchParams.key
  const expectedKey = process.env.NEXT_PUBLIC_UPLOAD_KEY

  // Key kontrolü
  if (!providedKey || providedKey !== expectedKey) {
    return (
      <Container className="py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Erişim Engellendi</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Bu sayfaya erişim için geçerli bir anahtar gereklidir.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </Container>
    )
  }

  // Cloudinary konfigürasyonu kontrolü
  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
  const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

  if (!cloudName || !uploadPreset) {
    return (
      <Container className="py-12">
        <Card className="max-w-md mx-auto">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
              <AlertTriangle className="h-8 w-8 text-destructive" />
            </div>
            <CardTitle>Konfigürasyon Hatası</CardTitle>
          </CardHeader>
          <CardContent>
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Cloudinary konfigürasyonu eksik. Lütfen yöneticinize başvurun.
              </AlertDescription>
            </Alert>
          </CardContent>
        </Card>
      </Container>
    )
  }

  return (
    <Container className="py-12">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
            <UploadIcon className="h-8 w-8 text-primary" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Görsel Yükleme</h1>
          <p className="text-muted-foreground">
            Sendika web sitesi için görselleri yükleyin ve URL'lerini kopyalayın
          </p>
        </div>

        <UploadWidget />

        <div className="mt-8 p-4 bg-muted/50 rounded-lg">
          <h3 className="font-semibold mb-2">Kullanım Talimatları:</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>• Görselleri sürükleyip bırakın veya "Dosya Seç" butonunu kullanın</li>
            <li>• Yükleme tamamlandıktan sonra URL'yi kopyalayın</li>
            <li>• URL'leri web sitesinde kullanabilirsiniz</li>
            <li>• Desteklenen formatlar: JPG, PNG, GIF, WebP</li>
          </ul>
        </div>
      </div>
    </Container>
  )
}

export default function UploadPage({ searchParams }: UploadPageProps) {
  return (
    <Suspense fallback={<div>Yükleniyor...</div>}>
      <UploadContent searchParams={searchParams} />
    </Suspense>
  )
}

export const metadata = {
  title: "Görsel Yükleme",
  description: "Sendika web sitesi için görsel yükleme aracı",
  robots: "noindex, nofollow", // Arama motorlarından gizle
}
