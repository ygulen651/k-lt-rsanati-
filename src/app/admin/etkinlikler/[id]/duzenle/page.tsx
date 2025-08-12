'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  ArrowLeft, 
  Save, 
  Trash2, 
  Calendar,
  Clock,
  MapPin,
  Users,
  Edit
} from 'lucide-react'

export default function EtkinlikDuzenlePage() {
  const params = useParams()
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Toplantı',
    status: 'draft'
  })

  // Etkinlik verilerini yükle
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const response = await fetch(`/api/events/${params.id}`)
        if (response.ok) {
          const result = await response.json()
          if (result.success) {
            setFormData(result.data)
          } else {
            alert('Etkinlik bulunamadı!')
            router.push('/admin/etkinlikler')
          }
        }
      } catch (error) {
        console.error('Etkinlik yükleme hatası:', error)
        alert('Etkinlik yüklenemedi!')
      } finally {
        setLoading(false)
      }
    }

    if (params.id) {
      loadEvent()
    }
  }, [params.id, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)

    try {
      const response = await fetch(`/api/events/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()

      if (result.success) {
        alert('Etkinlik başarıyla güncellendi!')
        router.push('/admin/etkinlikler')
      } else {
        alert('Etkinlik güncellenemedi: ' + result.error)
      }
    } catch (error) {
      console.error('Güncelleme hatası:', error)
      alert('Etkinlik güncellenirken bir hata oluştu!')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = async () => {
    if (!confirm('Bu etkinliği silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const response = await fetch(`/api/events/${params.id}`, {
        method: 'DELETE'
      })

      const result = await response.json()

      if (result.success) {
        alert('Etkinlik başarıyla silindi!')
        router.push('/admin/etkinlikler')
      } else {
        alert('Etkinlik silinemedi: ' + result.error)
      }
    } catch (error) {
      console.error('Silme hatası:', error)
      alert('Etkinlik silinirken bir hata oluştu!')
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Etkinlik yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link 
            href="/admin/etkinlikler"
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <ArrowLeft className="h-5 w-5 text-gray-600 dark:text-gray-400" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold flex items-center gap-2">
              <Edit className="h-8 w-8 text-blue-600" />
              Etkinlik Düzenle
            </h1>
            <p className="text-muted-foreground mt-2">
              Mevcut etkinliği düzenleyin
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </Button>
        </div>
      </div>

      {/* Form */}
      <Card>
        <CardHeader>
          <CardTitle>Etkinlik Bilgileri</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Başlık */}
            <div>
              <Label htmlFor="title">Etkinlik Başlığı *</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                placeholder="Etkinlik başlığını girin"
                required
              />
            </div>

            {/* Açıklama */}
            <div>
              <Label htmlFor="description">Açıklama *</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Etkinlik açıklamasını girin"
                rows={6}
                required
              />
            </div>

            {/* Tarih ve Saat */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="date">Tarih *</Label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="date"
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    className="pl-10"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="time">Saat</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="time"
                    type="time"
                    value={formData.time}
                    onChange={(e) => setFormData(prev => ({ ...prev, time: e.target.value }))}
                    className="pl-10"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="location">Konum</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                    placeholder="Etkinlik konumu"
                    className="pl-10"
                  />
                </div>
              </div>
            </div>

            {/* Kategori ve Durum */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  value={formData.category}
                  onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="Toplantı">Toplantı</option>
                  <option value="Eğitim">Eğitim</option>
                  <option value="Sosyal">Sosyal Etkinlik</option>
                  <option value="Kutlama">Kutlama</option>
                  <option value="Protesto">Protesto</option>
                  <option value="Konferans">Konferans</option>
                  <option value="Diğer">Diğer</option>
                </select>
              </div>

              <div>
                <Label htmlFor="status">Durum</Label>
                <select
                  id="status"
                  value={formData.status}
                  onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
                  className="w-full p-2 border rounded-md"
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayınlandı</option>
                  <option value="cancelled">İptal Edildi</option>
                </select>
              </div>
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Güncelleniyor...' : 'Güncelle'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}



