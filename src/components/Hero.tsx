import Link from "next/link"
import { ArrowRight, Users, Shield, Heart } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Section } from "./Section"

export function Hero() {
  const siteName = process.env.NEXT_PUBLIC_SITE_NAME || "Kültür Sanat İş"

  return (
    <Section padding="xl" className="bg-gradient-to-br from-primary/10 via-background to-primary/5">
      <div className="text-center space-y-8">
        {/* Ana Başlık */}
        <div className="space-y-4">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
            <span className="text-primary">{siteName}</span>
            <br />
            <span className="text-2xl md:text-4xl font-medium text-muted-foreground">
              Kültür Sanat İş, Güçlü Gelecek
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            Modern ve güçlü bir sendika olarak, çalışan haklarını koruyoruz, 
            adalet için mücadele ediyoruz ve birlikte daha güçlü bir gelecek inşa ediyoruz.
          </p>
        </div>

        {/* CTA Butonları */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <Button size="lg" className="text-lg px-8 py-6" asChild>
            <Link href="/iletisim">
              Bize Katılın
              <ArrowRight className="ml-2 h-5 w-5" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" className="text-lg px-8 py-6" asChild>
            <Link href="/hakkimizda">
              Hakkımızda
            </Link>
          </Button>
        </div>

        {/* İstatistikler */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12">
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Users className="h-6 w-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary">2.500+</div>
            <div className="text-muted-foreground">Aktif Üye</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary">15+</div>
            <div className="text-muted-foreground">Yıllık Deneyim</div>
          </div>
          
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center">
              <Heart className="h-6 w-6 text-primary" />
            </div>
            <div className="text-3xl font-bold text-primary">100+</div>
            <div className="text-muted-foreground">Başarılı Dava</div>
          </div>
        </div>
      </div>
    </Section>
  )
}
