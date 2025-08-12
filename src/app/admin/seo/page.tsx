'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  Save, 
  Search,
  Globe,
  BarChart,
  FileText,
  Image as ImageIcon,
  Twitter,
  Facebook,
  CheckCircle,
  AlertCircle
} from 'lucide-react'

interface SEOData {
  siteTitle: string
  siteDescription: string
  keywords: string
  robots: string
  canonicalUrl: string
  ogTitle: string
  ogDescription: string
  ogImage: string
  twitterCard: string
  twitterSite: string
  googleAnalytics: string
  googleSearchConsole: string
  structuredData: boolean
  sitemap: boolean
  robotsTxt: boolean
}

export default function SEOPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [seoData, setSeoData] = useState<SEOData>({
    siteTitle: '',
    siteDescription: '',
    keywords: '',
    robots: 'index, follow',
    canonicalUrl: '',
    ogTitle: '',
    ogDescription: '',
    ogImage: '',
    twitterCard: 'summary_large_image',
    twitterSite: '',
    googleAnalytics: '',
    googleSearchConsole: '',
    structuredData: true,
    sitemap: true,
    robotsTxt: true
  })

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/admin/site-data')
        const result = await response.json()
        
        if (result.success && result.data.seo) {
          setSeoData(result.data.seo)
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/site-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'seo', data: seoData })
      })

      if (response.ok) {
        alert('SEO ayarları başarıyla kaydedildi!')
      } else {
        alert('Kaydetme sırasında bir hata oluştu!')
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('Kaydetme sırasında bir hata oluştu!')
    } finally {
      setSaving(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        setSeoData({ ...seoData, ogImage: result.url })
        alert('Görsel başarıyla yüklendi!')
      } else {
        alert('Görsel yükleme hatası!')
      }
    } catch (error) {
      console.error('Görsel yükleme hatası:', error)
      alert('Görsel yükleme hatası!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>SEO ayarları yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Search className="h-8 w-8 text-green-600" />
            SEO Ayarları
          </h1>
          <p className="text-muted-foreground mt-2">
            Arama motoru optimizasyonu ayarlarını yönetin
          </p>
        </div>
        
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">Genel SEO</TabsTrigger>
          <TabsTrigger value="social">Sosyal Medya</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="technical">Teknik SEO</TabsTrigger>
        </TabsList>

        {/* Genel SEO */}
        <TabsContent value="general" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Temel SEO Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="siteTitle">Site Başlığı</Label>
                <Input
                  id="siteTitle"
                  value={seoData.siteTitle}
                  onChange={(e) => setSeoData({ ...seoData, siteTitle: e.target.value })}
                  placeholder="Kültür-İş - Kültür Sanat İş"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Tarayıcı sekmesinde ve arama sonuçlarında görünen başlık (50-60 karakter)
                </p>
              </div>

              <div>
                <Label htmlFor="siteDescription">Site Açıklaması</Label>
                <Textarea
                  id="siteDescription"
                  value={seoData.siteDescription}
                  onChange={(e) => setSeoData({ ...seoData, siteDescription: e.target.value })}
                  placeholder="Site açıklaması buraya yazılacak"
                  className="min-h-[80px]"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Arama sonuçlarında görünen açıklama (150-160 karakter)
                </p>
              </div>

              <div>
                <Label htmlFor="keywords">Anahtar Kelimeler</Label>
                <Input
                  id="keywords"
                  value={seoData.keywords}
                  onChange={(e) => setSeoData({ ...seoData, keywords: e.target.value })}
                  placeholder="sendika, kültür, bilim, işçi, kamu, çalışan"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Virgülle ayırarak anahtar kelimeleri girin
                </p>
              </div>

              <div>
                <Label htmlFor="robots">Robots Meta Tag</Label>
                <select
                  id="robots"
                  value={seoData.robots}
                  onChange={(e) => setSeoData({ ...seoData, robots: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="index, follow">Index, Follow (Önerilen)</option>
                  <option value="index, nofollow">Index, NoFollow</option>
                  <option value="noindex, follow">NoIndex, Follow</option>
                  <option value="noindex, nofollow">NoIndex, NoFollow</option>
                </select>
              </div>

              <div>
                <Label htmlFor="canonicalUrl">Canonical URL</Label>
                <Input
                  id="canonicalUrl"
                  value={seoData.canonicalUrl}
                  onChange={(e) => setSeoData({ ...seoData, canonicalUrl: e.target.value })}
                  placeholder="https://kultursanatis.org"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Sitenizin ana URL'si (opsiyonel)
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Sosyal Medya */}
        <TabsContent value="social" className="space-y-6">
          {/* Open Graph */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Facebook className="h-5 w-5" />
                Open Graph (Facebook, LinkedIn)
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="ogTitle">OG Başlık</Label>
                <Input
                  id="ogTitle"
                  value={seoData.ogTitle}
                  onChange={(e) => setSeoData({ ...seoData, ogTitle: e.target.value })}
                  placeholder="Kültür-İş - Kültür Sanat İş"
                />
              </div>

              <div>
                <Label htmlFor="ogDescription">OG Açıklama</Label>
                <Textarea
                  id="ogDescription"
                  value={seoData.ogDescription}
                  onChange={(e) => setSeoData({ ...seoData, ogDescription: e.target.value })}
                  placeholder="Site açıklaması buraya yazılacak"
                  className="min-h-[80px]"
                />
              </div>

              <div>
                <Label>OG Görsel</Label>
                <div className="space-y-2">
                  <Input
                    value={seoData.ogImage}
                    onChange={(e) => setSeoData({ ...seoData, ogImage: e.target.value })}
                    placeholder="https://kultursanatis.org/og-image.jpg"
                  />
                  {seoData.ogImage && (
                    <div className="relative w-full max-w-md h-48 border rounded overflow-hidden">
                      <img
                        src={seoData.ogImage}
                        alt="OG Image Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleImageUpload(file)
                      }}
                      className="hidden"
                      id="og-image-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('og-image-upload')?.click()}
                    >
                      <ImageIcon className="h-4 w-4 mr-2" />
                      Görsel Yükle
                    </Button>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Önerilen boyut: 1200x630 piksel
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Twitter Cards */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Twitter className="h-5 w-5" />
                Twitter Cards
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="twitterCard">Twitter Card Tipi</Label>
                <select
                  id="twitterCard"
                  value={seoData.twitterCard}
                  onChange={(e) => setSeoData({ ...seoData, twitterCard: e.target.value })}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="summary">Summary</option>
                  <option value="summary_large_image">Summary Large Image</option>
                </select>
              </div>

              <div>
                <Label htmlFor="twitterSite">Twitter Kullanıcı Adı</Label>
                <Input
                  id="twitterSite"
                  value={seoData.twitterSite}
                  onChange={(e) => setSeoData({ ...seoData, twitterSite: e.target.value })}
                  placeholder="@kultursanatis"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Analytics */}
        <TabsContent value="analytics" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart className="h-5 w-5" />
                Analytics & Tracking
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="googleAnalytics">Google Analytics ID</Label>
                <Input
                  id="googleAnalytics"
                  value={seoData.googleAnalytics}
                  onChange={(e) => setSeoData({ ...seoData, googleAnalytics: e.target.value })}
                  placeholder="G-XXXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Google Analytics 4 Measurement ID
                </p>
              </div>

              <div>
                <Label htmlFor="googleSearchConsole">Google Search Console</Label>
                <Input
                  id="googleSearchConsole"
                  value={seoData.googleSearchConsole}
                  onChange={(e) => setSeoData({ ...seoData, googleSearchConsole: e.target.value })}
                  placeholder="google-site-verification=XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"
                />
                <p className="text-xs text-muted-foreground mt-1">
                  Google Search Console doğrulama kodu
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Teknik SEO */}
        <TabsContent value="technical" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Teknik SEO Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label>Structured Data (JSON-LD)</Label>
                  <p className="text-sm text-muted-foreground">
                    Arama motorları için yapılandırılmış veri
                  </p>
                </div>
                <Switch
                  checked={seoData.structuredData}
                  onCheckedChange={(checked) => setSeoData({ ...seoData, structuredData: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>XML Sitemap</Label>
                  <p className="text-sm text-muted-foreground">
                    Otomatik sitemap oluşturma
                  </p>
                </div>
                <Switch
                  checked={seoData.sitemap}
                  onCheckedChange={(checked) => setSeoData({ ...seoData, sitemap: checked })}
                />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label>Robots.txt</Label>
                  <p className="text-sm text-muted-foreground">
                    Otomatik robots.txt oluşturma
                  </p>
                </div>
                <Switch
                  checked={seoData.robotsTxt}
                  onCheckedChange={(checked) => setSeoData({ ...seoData, robotsTxt: checked })}
                />
              </div>
            </CardContent>
          </Card>

          {/* SEO Kontrol Listesi */}
          <Card>
            <CardHeader>
              <CardTitle>SEO Kontrol Listesi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  {seoData.siteTitle ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">Site başlığı belirlendi</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {seoData.siteDescription ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">Site açıklaması eklendi</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {seoData.ogImage ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">Open Graph görseli eklendi</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {seoData.googleAnalytics ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">Google Analytics kuruldu</span>
                </div>
                
                <div className="flex items-center gap-2">
                  {seoData.structuredData ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500" />
                  )}
                  <span className="text-sm">Yapılandırılmış veri aktif</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}