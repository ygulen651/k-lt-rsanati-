'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Save, 
  Plus,
  Trash2,
  Facebook,
  Twitter,
  Instagram,
  Youtube,
  Linkedin,
  Globe,
  Edit,
  Eye,
  EyeOff
} from 'lucide-react'

interface SocialMedia {
  id: number
  name: string
  url: string
  icon: string
  active: boolean
}

const socialIcons = {
  facebook: Facebook,
  twitter: Twitter,
  instagram: Instagram,
  youtube: Youtube,
  linkedin: Linkedin,
  globe: Globe
}

const iconOptions = [
  { value: 'facebook', label: 'Facebook', icon: Facebook },
  { value: 'twitter', label: 'Twitter', icon: Twitter },
  { value: 'instagram', label: 'Instagram', icon: Instagram },
  { value: 'youtube', label: 'YouTube', icon: Youtube },
  { value: 'linkedin', label: 'LinkedIn', icon: Linkedin },
  { value: 'globe', label: 'Website', icon: Globe }
]

export default function SosyalMedyaPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [socials, setSocials] = useState<SocialMedia[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/admin/site-data')
        const result = await response.json()
        
        if (result.success && result.data.socials) {
          setSocials(result.data.socials)
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
        body: JSON.stringify({ section: 'socials', data: socials })
      })

      if (response.ok) {
        setEditingId(null)
        alert('Sosyal medya ayarları başarıyla kaydedildi!')
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

  const addSocial = () => {
    const newSocial: SocialMedia = {
      id: Date.now(),
      name: 'Yeni Platform',
      url: '',
      icon: 'globe',
      active: true
    }
    setSocials([...socials, newSocial])
    setEditingId(newSocial.id)
  }

  const updateSocial = (id: number, field: keyof SocialMedia, value: any) => {
    setSocials(socials.map(social => 
      social.id === id ? { ...social, [field]: value } : social
    ))
  }

  const deleteSocial = (id: number) => {
    if (confirm('Bu sosyal medya hesabını silmek istediğinizden emin misiniz?')) {
      setSocials(socials.filter(social => social.id !== id))
    }
  }

  const toggleActive = (id: number) => {
    setSocials(socials.map(social => 
      social.id === id ? { ...social, active: !social.active } : social
    ))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Sosyal medya ayarları yükleniyor...</p>
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
            <Globe className="h-8 w-8 text-blue-600" />
            Sosyal Medya Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">
            Sosyal medya hesaplarınızı yönetin ve sitede görüntüleyin
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={addSocial} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Hesap
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>

      {/* Sosyal Medya Listesi */}
      <div className="grid gap-4">
        {socials.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Globe className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Henüz sosyal medya hesabı eklenmemiş</h3>
              <p className="text-muted-foreground mb-4">
                İlk sosyal medya hesabınızı ekleyerek başlayın
              </p>
              <Button onClick={addSocial}>
                <Plus className="h-4 w-4 mr-2" />
                İlk Hesabı Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          socials.map((social) => {
            const IconComponent = socialIcons[social.icon as keyof typeof socialIcons] || Globe
            const isEditing = editingId === social.id

            return (
              <Card key={social.id} className={`transition-all ${!social.active ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Icon */}
                    <div className={`w-12 h-12 rounded-full flex items-center justify-center ${
                      social.active ? 'bg-blue-100 text-blue-600' : 'bg-gray-100 text-gray-400'
                    }`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 space-y-3">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`name-${social.id}`}>Platform Adı</Label>
                            <Input
                              id={`name-${social.id}`}
                              value={social.name}
                              onChange={(e) => updateSocial(social.id, 'name', e.target.value)}
                              placeholder="Facebook"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`icon-${social.id}`}>İkon</Label>
                            <select
                              id={`icon-${social.id}`}
                              value={social.icon}
                              onChange={(e) => updateSocial(social.id, 'icon', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            >
                              {iconOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                  {option.label}
                                </option>
                              ))}
                            </select>
                          </div>
                          
                          <div className="md:col-span-2">
                            <Label htmlFor={`url-${social.id}`}>URL</Label>
                            <Input
                              id={`url-${social.id}`}
                              value={social.url}
                              onChange={(e) => updateSocial(social.id, 'url', e.target.value)}
                              placeholder="https://facebook.com/kultursanatis"
                            />
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{social.name}</h3>
                            {social.active ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Aktif
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                Pasif
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {social.url || 'URL belirtilmemiş'}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Eylemler */}
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => setEditingId(null)}
                          >
                            Tamam
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            İptal
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(social.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleActive(social.id)}
                          >
                            {social.active ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteSocial(social.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Önizleme */}
      {socials.filter(s => s.active).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sitede Nasıl Görünecek</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-gray-50 rounded-lg">
              <h3 className="font-semibold mb-4">Sosyal Medya Hesaplarımız</h3>
              <div className="flex gap-3">
                {socials
                  .filter(social => social.active && social.url)
                  .map((social) => {
                    const IconComponent = socialIcons[social.icon as keyof typeof socialIcons] || Globe
                    return (
                      <a
                        key={social.id}
                        href={social.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-full flex items-center justify-center transition-colors"
                        title={social.name}
                      >
                        <IconComponent className="h-5 w-5" />
                      </a>
                    )
                  })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kullanım Talimatları */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanım Talimatları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium">Sosyal medya hesabı ekleyin</p>
              <p className="text-sm text-muted-foreground">
                "Yeni Hesap" butonuna tıklayarak sosyal medya platformlarınızı ekleyin
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium">Bilgileri doldurun</p>
              <p className="text-sm text-muted-foreground">
                Platform adı, ikon ve tam URL adresini girin
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium">Aktiflik durumunu ayarlayın</p>
              <p className="text-sm text-muted-foreground">
                Göz ikonuyla hesabın sitede görünüp görünmeyeceğini belirleyin
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              4
            </div>
            <div>
              <p className="font-medium">Kaydedin</p>
              <p className="text-sm text-muted-foreground">
                "Kaydet" butonuna tıklayarak değişiklikleri sitede yayınlayın
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}