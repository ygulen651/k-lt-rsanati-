import { Target, Eye, Star } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Section } from "./Section"

const values = [
  {
    icon: Target,
    title: "Misyonumuz",
    description: "Çalışanların ekonomik ve sosyal haklarını korumak, geliştirmek ve güçlendirmek. Adil çalışma koşulları için mücadele etmek ve işçi dayanışmasını artırmak.",
    color: "text-blue-600"
  },
  {
    icon: Eye,
    title: "Vizyonumuz", 
    description: "Türkiye'nin en güvenilir ve etkili sendikası olmak. Çalışan haklarında öncü rol oynayarak, sosyal adaletin sağlandığı bir iş dünyası yaratmak.",
    color: "text-green-600"
  },
  {
    icon: Star,
    title: "Değerlerimiz",
    description: "Dayanışma, adalet, şeffaflık, dürüstlük ve demokratik katılım. Her üyemizin sesini duyurmak ve birlikte güçlü olmak.",
    color: "text-purple-600"
  }
]

export function MissionVisionValues() {
  return (
    <Section background="muted" padding="xl">
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold mb-4">
          Kim Olduğumuz
        </h2>
        <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
          Güçlü değerlerimiz ve net hedeflerimizle çalışan haklarını koruyoruz
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {values.map((item, index) => (
          <Card key={index} className="text-center h-full hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4">
              <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                <item.icon className={`h-8 w-8 ${item.color}`} />
              </div>
              <CardTitle className="text-xl">{item.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </Section>
  )
}
