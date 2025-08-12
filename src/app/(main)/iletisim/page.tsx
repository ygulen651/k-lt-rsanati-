"use client"

import { useState } from "react"
import { MapPin, Phone, Mail, Clock, Send, MessageCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Section } from "@/components/Section"
import { Container } from "@/components/Container"
import { generatePageSEO } from "@/lib/seo"

const metadata = generatePageSEO({
  title: "İletişim",
  description: "Kültür Sanat İş ile iletişime geçin. Adres, telefon, e-posta bilgileri ve iletişim formu.",
  path: "/iletisim"
})

export default function IletisimPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "",
    message: "",
    category: "genel"
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitStatus('idle')
    
    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      if (result.success) {
        setSubmitStatus('success')
        setFormData({
          name: "",
          email: "",
          phone: "",
          subject: "",
          message: "",
          category: "genel"
        })
      } else {
        setSubmitStatus('error')
        console.error('Form gönderim hatası:', result.error)
      }
    } catch (error) {
      console.error('Network hatası:', error)
      setSubmitStatus('error')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <>
      {/* Hero Section */}
      <Section padding="xl" background="muted">
        <Container>
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              İletişim
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Bizimle iletişime geçin. Sorularınız, önerileriniz ve talepleriniz için buradayız.
            </p>
          </div>
        </Container>
      </Section>

      {/* İletişim Bilgileri */}
      <Section padding="xl">
        <Container>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            <Card className="text-center">
              <CardContent className="p-6">
                <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Adres</h3>
                <p className="text-muted-foreground text-sm">
                  Şehit Adem Yavuz Sokak. Hitit Apt. No:14/14<br />
                  Kızılay / ANKARA
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Phone className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Telefon</h3>
                <p className="text-muted-foreground text-sm">
                  <a href="tel:+903124198579" className="hover:text-primary">
                    0312-419 85 79
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Mail className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">E-posta</h3>
                <p className="text-muted-foreground text-sm">
                  <a href="mailto:info@kultursanatis.org" className="hover:text-primary">
                    info@kultursanatis.org
                  </a>
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Faks</h3>
                <p className="text-muted-foreground text-sm">0312-419 85 79</p>
              </CardContent>
            </Card>
          </div>
        </Container>
      </Section>

      {/* İletişim Formu ve Harita */}
      <Section padding="xl" background="muted">
        <Container>
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {/* İletişim Formu */}
            <div>
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <MessageCircle className="h-5 w-5" />
                    İletişim Formu
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {submitStatus === 'success' && (
                    <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-green-800 dark:text-green-200 text-sm">
                        Mesajınız başarıyla gönderildi. En kısa sürede size dönüş yapacağız.
                      </p>
                    </div>
                  )}

                  {submitStatus === 'error' && (
                    <div className="mb-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                      <p className="text-red-800 dark:text-red-200 text-sm">
                        Mesaj gönderilirken bir hata oluştu. Lütfen tekrar deneyin.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="name">Ad Soyad *</Label>
                        <Input
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                          placeholder="Adınız ve soyadınız"
                        />
                      </div>
                      <div>
                        <Label htmlFor="email">E-posta *</Label>
                        <Input
                          id="email"
                          name="email"
                          type="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          required
                          placeholder="ornek@email.com"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="phone">Telefon</Label>
                        <Input
                          id="phone"
                          name="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={handleInputChange}
                          placeholder="0555 123 45 67"
                        />
                      </div>
                      <div>
                        <Label htmlFor="category">Konu Kategorisi</Label>
                        <select
                          id="category"
                          name="category"
                          value={formData.category}
                          onChange={handleInputChange}
                          className="w-full px-3 py-2 border border-input bg-background rounded-md text-sm"
                        >
                          <option value="genel">Genel Bilgi</option>
                          <option value="uyelik">Üyelik</option>
                          <option value="hukuk">Hukuki Destek</option>
                          <option value="etkinlik">Etkinlikler</option>
                          <option value="basin">Basın</option>
                          <option value="sikayet">Şikayet</option>
                          <option value="oneri">Öneri</option>
                        </select>
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="subject">Konu *</Label>
                      <Input
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleInputChange}
                        required
                        placeholder="Mesajınızın konusu"
                      />
                    </div>

                    <div>
                      <Label htmlFor="message">Mesaj *</Label>
                      <Textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleInputChange}
                        required
                        rows={6}
                        placeholder="Mesajınızı buraya yazın..."
                      />
                    </div>

                    <Button 
                      type="submit" 
                      size="lg" 
                      className="w-full"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <>
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                          Gönderiliyor...
                        </>
                      ) : (
                        <>
                          <Send className="h-4 w-4 mr-2" />
                          Mesajı Gönder
                        </>
                      )}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>

            {/* Harita ve Ek Bilgiler */}
            <div className="space-y-6">
              {/* Harita */}
              <Card>
                <CardHeader>
                  <CardTitle>Konum</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-2" />
                      <p className="text-muted-foreground">
                        Harita entegrasyonu<br />
                        (Google Maps / OpenStreetMap)
                      </p>
                    </div>
                  </div>
                  <div className="mt-4 p-4 bg-muted rounded-lg">
                    <h4 className="font-semibold mb-2">Ulaşım</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Metro: Kızılay İstasyonu (5 dk yürüme)</li>
                      <li>• Otobüs: Kızılay Durağı</li>
                      <li>• Otopark: Bina altında mevcuttur</li>
                    </ul>
                  </div>
                </CardContent>
              </Card>



              {/* Sosyal Medya */}
              <Card>
                <CardHeader>
                  <CardTitle>Sosyal Medya</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground mb-4">
                    Güncel haberler ve duyurular için takip edin:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button size="sm" variant="outline" asChild>
                      <a href="https://twitter.com/kultursanatis" target="_blank" rel="noopener noreferrer">
                        Twitter
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href="https://facebook.com/kultursanatis" target="_blank" rel="noopener noreferrer">
                        Facebook
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href="https://instagram.com/kultursanatis" target="_blank" rel="noopener noreferrer">
                        Instagram
                      </a>
                    </Button>
                    <Button size="sm" variant="outline" asChild>
                      <a href="https://linkedin.com/company/kultursanatis" target="_blank" rel="noopener noreferrer">
                        LinkedIn
                      </a>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}
