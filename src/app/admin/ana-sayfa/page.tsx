'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { 
  Save, 
  Eye, 
  EyeOff,
  Edit3, 
  Image as ImageIcon, 
  Plus, 
  Trash2,
  Home,
  FileText,
  Calendar,
  Users,
  Upload,
  ArrowUp,
  ArrowDown
} from 'lucide-react'
import Image from 'next/image'

interface Slide {
  id: number
  title: string
  subtitle: string
  image: string
  buttonText: string
  buttonLink: string
  active: boolean
}

export default function AnaSayfaDuzenlePage() {
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [slides, setSlides] = useState<Slide[]>([])
  const [missionData, setMissionData] = useState({
    mission: "",
    vision: "",
    values: ""
  })

  // Verileri API'den yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/admin/site-data')
        const result = await response.json()
        
        if (result.success) {
          console.log('API\'den gelen site data:', result.data)
          console.log('Mission data:', result.data.mission)
          
          setSlides(result.data.hero.slides || [])
          setMissionData({
            mission: result.data.mission.mission || "",
            vision: result.data.mission.vision || "",
            values: result.data.mission.values || ""
          })
          
          console.log('Set edilen mission data:', {
            mission: result.data.mission.mission || "",
            vision: result.data.mission.vision || "",
            values: result.data.mission.values || ""
          })
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error)
        alert('Veriler yüklenemedi!')
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log('Kaydedilecek mission verisi:', missionData)
      
      // Hero verilerini kaydet
      const heroResponse = await fetch('/api/admin/site-data', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ section: 'hero', data: { slides } }) 
      })

      // Mission verilerini kaydet
      const missionResponse = await fetch('/api/admin/site-data', { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ section: 'mission', data: missionData }) 
      })

      console.log('Hero response:', heroResponse.status)
      console.log('Mission response:', missionResponse.status)

      if (heroResponse.ok && missionResponse.ok) {
        const heroResult = await heroResponse.json()
        const missionResult = await missionResponse.json()
        console.log('Hero result:', heroResult)
        console.log('Mission result:', missionResult)
        
        setIsEditing(false)
        alert('Değişiklikler başarıyla kaydedildi!')
      } else {
        const heroError = !heroResponse.ok ? await heroResponse.text() : null
        const missionError = !missionResponse.ok ? await missionResponse.text() : null
        console.error('Hero error:', heroError)
        console.error('Mission error:', missionError)
        alert('Kaydetme sırasında bir hata oluştu!')
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('Kaydetme sırasında bir hata oluştu!')
    } finally {
      setSaving(false)
    }
  }

  const addSlide = () => {
    const newSlide: Slide = {
      id: Date.now(),
      title: "Yeni Slide Başlığı",
      subtitle: "Slide alt başlığı",
      image: "/hero-bg.jpg",
      buttonText: "Detay",
      buttonLink: "/",
      active: true
    }
    setSlides([...slides, newSlide])
  }

  const updateSlide = (id: number, field: keyof Slide, value: any) => {
    setSlides(slides.map(slide => 
      slide.id === id ? { ...slide, [field]: value } : slide
    ))
  }

  const deleteSlide = (id: number) => {
    if (confirm('Bu slide\'ı silmek istediğinizden emin misiniz?')) {
      setSlides(slides.filter(slide => slide.id !== id))
    }
  }

  const moveSlide = (id: number, direction: 'up' | 'down') => {
    const index = slides.findIndex(slide => slide.id === id)
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= slides.length) return
    
    const newSlides = [...slides]
    const temp = newSlides[index]
    newSlides[index] = newSlides[newIndex]
    newSlides[newIndex] = temp
    setSlides(newSlides)
  }

  const handleImageUpload = async (slideId: number, file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        updateSlide(slideId, 'image', result.url)
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
          <p>Veriler yükleniyor...</p>
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
            <Home className="h-8 w-8 text-blue-600" />
            Ana Sayfa Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">
            Ana sayfa slider ve içeriklerini yönetin
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            onClick={() => window.open('/', '_blank')}
          >
            <Eye className="h-4 w-4 mr-2" />
            Siteyi Görüntüle
          </Button>
          
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit3 className="h-4 w-4 mr-2" />
            {isEditing ? 'Düzenlemeyi Bitir' : 'Düzenle'}
          </Button>
          
          {isEditing && (
            <Button onClick={handleSave} disabled={saving}>
              <Save className="h-4 w-4 mr-2" />
              {saving ? 'Kaydediliyor...' : 'Kaydet'}
            </Button>
          )}
        </div>
      </div>

      {/* Ana Sayfa Slider Yönetimi */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Ana Sayfa Slider
            </CardTitle>
            <p className="text-sm text-muted-foreground mt-1">
              Ana sayfada görünen slider'ları yönetin
            </p>
          </div>
          {isEditing && (
            <Button onClick={addSlide} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Yeni Slide
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
          {slides.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              <ImageIcon className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p>Henüz slide eklenmemiş</p>
              {isEditing && (
                <Button onClick={addSlide} className="mt-4">
                  <Plus className="h-4 w-4 mr-2" />
                  İlk Slide'ı Ekle
                </Button>
              )}
            </div>
          ) : (
            slides.map((slide, index) => (
              <Card key={slide.id} className={`${!slide.active ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <Badge variant={slide.active ? "default" : "secondary"}>
                        {slide.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        Slide #{index + 1}
                      </span>
                    </div>
                    {isEditing && (
                      <div className="flex items-center gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveSlide(slide.id, 'up')}
                          disabled={index === 0}
                        >
                          <ArrowUp className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => moveSlide(slide.id, 'down')}
                          disabled={index === slides.length - 1}
                        >
                          <ArrowDown className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => updateSlide(slide.id, 'active', !slide.active)}
                        >
                          {slide.active ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => deleteSlide(slide.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Slide Görsel */}
                    <div>
                      <label className="text-sm font-medium mb-2 block">Slide Görseli</label>
                      <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                        <Image
                          src={slide.image}
                          alt={slide.title}
                          fill
                          className="object-cover"
                        />
                      </div>
                      {isEditing && (
                        <div className="mt-2 space-y-2">
                          <Input
                            placeholder="Görsel URL'si"
                            value={slide.image}
                            onChange={(e) => updateSlide(slide.id, 'image', e.target.value)}
                          />
                          <div className="flex items-center gap-2">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(slide.id, file)
                              }}
                              className="hidden"
                              id={`image-${slide.id}`}
                            />
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => document.getElementById(`image-${slide.id}`)?.click()}
                            >
                              <Upload className="h-4 w-4 mr-2" />
                              Dosya Yükle
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Slide İçeriği */}
                    <div className="space-y-4">
                      <div>
                        <label className="text-sm font-medium mb-2 block">Ana Başlık</label>
                        {isEditing ? (
                          <Textarea
                            value={slide.title}
                            onChange={(e) => updateSlide(slide.id, 'title', e.target.value)}
                            className="min-h-[80px]"
                          />
                        ) : (
                          <div className="p-3 bg-muted rounded-md">
                            {slide.title}
                          </div>
                        )}
                      </div>

                      <div>
                        <label className="text-sm font-medium mb-2 block">Alt Başlık</label>
                        {isEditing ? (
                          <Input
                            value={slide.subtitle}
                            onChange={(e) => updateSlide(slide.id, 'subtitle', e.target.value)}
                          />
                        ) : (
                          <div className="p-3 bg-muted rounded-md">
                            {slide.subtitle}
                          </div>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">Buton Metni</label>
                          {isEditing ? (
                            <Input
                              value={slide.buttonText}
                              onChange={(e) => updateSlide(slide.id, 'buttonText', e.target.value)}
                            />
                          ) : (
                            <div className="p-3 bg-muted rounded-md">
                              {slide.buttonText}
                            </div>
                          )}
                        </div>

                        <div>
                          <label className="text-sm font-medium mb-2 block">Buton Linki</label>
                          {isEditing ? (
                            <Input
                              value={slide.buttonLink}
                              onChange={(e) => updateSlide(slide.id, 'buttonLink', e.target.value)}
                            />
                          ) : (
                            <div className="p-3 bg-muted rounded-md">
                              {slide.buttonLink}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </CardContent>
      </Card>

      {/* Misyon Vizyon Değerler */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Misyon, Vizyon & Değerler
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div>
            <label className="text-sm font-medium mb-2 block text-blue-600">Misyonumuz</label>
            {isEditing ? (
              <Textarea
                value={missionData.mission}
                onChange={(e) => setMissionData({...missionData, mission: e.target.value})}
                className="min-h-[100px]"
              />
            ) : (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-md">
                {missionData.mission}
              </div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block text-green-600">Vizyonumuz</label>
            {isEditing ? (
              <Textarea
                value={missionData.vision}
                onChange={(e) => setMissionData({...missionData, vision: e.target.value})}
                className="min-h-[100px]"
              />
            ) : (
              <div className="p-4 bg-green-50 border border-green-200 rounded-md">
                {missionData.vision}
              </div>
            )}
          </div>
          
          <div>
            <label className="text-sm font-medium mb-2 block text-purple-600">Değerlerimiz</label>
            {isEditing ? (
              <Textarea
                value={missionData.values}
                onChange={(e) => setMissionData({...missionData, values: e.target.value})}
                className="min-h-[100px]"
              />
            ) : (
              <div className="p-4 bg-purple-50 border border-purple-200 rounded-md">
                {missionData.values}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Hızlı Erişim Kartları */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Duyurular</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Duyuru ekle, düzenle, yayınla
            </p>
            <Button size="sm" className="w-full" asChild>
              <a href="/admin/duyurular">Duyuruları Yönet</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Etkinlikler</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Etkinlik planlama ve yönetimi
            </p>
            <Button size="sm" className="w-full" asChild>
              <a href="/admin/etkinlikler">Etkinlikleri Yönet</a>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow">
          <CardContent className="p-6 text-center">
            <ImageIcon className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Medya</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Fotoğraf ve video yönetimi
            </p>
            <Button size="sm" className="w-full" asChild>
              <a href="/admin/basin-yayin">Medyayı Yönet</a>
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Durum Mesajı */}
      {isEditing && (
        <div className="fixed bottom-4 right-4 bg-blue-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Edit3 className="h-4 w-4" />
            Düzenleme modu aktif
          </div>
        </div>
      )}
    </div>
  )
}