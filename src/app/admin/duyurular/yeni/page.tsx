'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { 
  Save, 
  Eye, 
  Upload, 
  X, 
  Calendar,
  Tag,
  FileText,
  Image as ImageIcon,
  Globe,
  AlertCircle
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Alert } from '@/components/ui/alert'

const categories = [
  'genel',
  'toplu-sozlesme', 
  'egitim',
  'sosyal',
  'hukuk',
  'basin-aciklamasi'
]

const categoryLabels = {
  'genel': 'Genel',
  'toplu-sozlesme': 'Toplu Sözleşme',
  'egitim': 'Eğitim',
  'sosyal': 'Sosyal',
  'hukuk': 'Hukuk',
  'basin-aciklamasi': 'Basın Açıklaması'
}

export default function NewAnnouncementPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [images, setImages] = useState<File[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [featuredImageFile, setFeaturedImageFile] = useState<File | null>(null)
  
  const [formData, setFormData] = useState({
    title: '',
    excerpt: '',
    content: '',
    category: 'genel',
    tags: '',
    featuredImage: '',
    status: 'draft',
    featured: false,
    publishDate: new Date().toISOString().split('T')[0]
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
    }))
  }

  const handleSubmit = async (e: React.FormEvent, status: 'draft' | 'published' = 'draft') => {
    e.preventDefault()
    setIsLoading(true)
    setError('')
    setSuccess('')

    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('excerpt', formData.excerpt)
      fd.append('content', formData.content)
      fd.append('category', formData.category)
      fd.append('status', status)
      fd.append('featured', String(formData.featured))
      fd.append('publishDate', formData.publishDate)
      fd.append('tags', formData.tags)
      if (formData.featuredImage) fd.append('featuredImage', formData.featuredImage)
      if (featuredImageFile) fd.append('featuredImageFile', featuredImageFile)
      images.forEach(img => fd.append('images', img))
      if (file) fd.append('file', file)

      const response = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      })

      const result = await response.json()

      if (result.success) {
        setSuccess(`Duyuru başarıyla ${status === 'published' ? 'yayınlandı' : 'taslak olarak kaydedildi'}!`)
        setTimeout(() => {
          router.push('/admin/duyurular')
        }, 1500)
      } else {
        setError(result.message || 'Duyuru kaydedilemedi')
      }
    } catch (error) {
      setError('Bir hata oluştu. Lütfen tekrar deneyin.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yeni Duyuru</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Yeni bir duyuru oluşturun ve yayınlayın
          </p>
        </div>
        <Button
          variant="outline"
          onClick={() => router.back()}
          className="flex items-center gap-2"
        >
          <X className="h-4 w-4" />
          İptal
        </Button>
      </div>

      {/* Success/Error Messages */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          {error}
        </Alert>
      )}
      
      {success && (
        <Alert className="border-green-200 bg-green-50 text-green-800 dark:border-green-800 dark:bg-green-900/20 dark:text-green-400">
          <AlertCircle className="h-4 w-4" />
          {success}
        </Alert>
      )}

      <form onSubmit={(e) => handleSubmit(e, 'draft')} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Temel Bilgiler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Başlık *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="Duyuru başlığını girin..."
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="excerpt">Özet *</Label>
                <Textarea
                  id="excerpt"
                  name="excerpt"
                  value={formData.excerpt}
                  onChange={handleChange}
                  placeholder="Duyuru özetini girin..."
                  rows={3}
                  required
                  disabled={isLoading}
                />
              </div>

              <div>
                <Label htmlFor="content">İçerik *</Label>
                <Textarea
                  id="content"
                  name="content"
                  value={formData.content}
                  onChange={handleChange}
                  placeholder="Duyuru içeriğini girin..."
                  rows={12}
                  required
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  HTML etiketleri kullanabilirsiniz
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Featured Image */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <ImageIcon className="h-5 w-5" />
                Görseller ve Dosya
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Öne Çıkan Görsel URL (opsiyonel)</Label>
                  <Input
                    name="featuredImage"
                    value={formData.featuredImage}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                    disabled={isLoading}
                  />
                </div>
                <div>
                  <Label>Öne Çıkan Görsel Dosya (opsiyonel)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setFeaturedImageFile(e.target.files?.[0] || null)}
                    disabled={isLoading}
                  />
                  <p className="text-xs text-gray-500 mt-1">URL girmezseniz dosya kullanılır.</p>
                </div>
                <div>
                  <Label>Ek Görseller (1-8)</Label>
                  <Input
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => {
                      const files = Array.from(e.target.files || []) as File[]
                      if (files.length > 8) {
                        alert('En fazla 8 görsel seçebilirsiniz')
                        return
                      }
                      setImages(files)
                    }}
                    disabled={isLoading}
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Ek Dosya (PDF/Video/Ses - opsiyonel)</Label>
                  <Input
                    type="file"
                    accept="application/pdf,video/*,audio/*,image/*"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    disabled={isLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Publish Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Yayın Ayarları
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Durum</Label>
                <select
                  id="status"
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={isLoading}
                >
                  <option value="draft">Taslak</option>
                  <option value="published">Yayında</option>
                </select>
              </div>

              <div>
                <Label htmlFor="publishDate">Yayın Tarihi</Label>
                <Input
                  id="publishDate"
                  name="publishDate"
                  type="date"
                  value={formData.publishDate}
                  onChange={handleChange}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <input
                  id="featured"
                  name="featured"
                  type="checkbox"
                  checked={formData.featured}
                  onChange={handleChange}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  disabled={isLoading}
                />
                <Label htmlFor="featured">Öne çıkan duyuru</Label>
              </div>
            </CardContent>
          </Card>

          {/* Category & Tags */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Tag className="h-5 w-5" />
                Kategori & Etiketler
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="category">Kategori</Label>
                <select
                  id="category"
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100"
                  disabled={isLoading}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {categoryLabels[category as keyof typeof categoryLabels]}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <Label htmlFor="tags">Etiketler</Label>
                <Input
                  id="tags"
                  name="tags"
                  value={formData.tags}
                  onChange={handleChange}
                  placeholder="etiket1, etiket2, etiket3"
                  disabled={isLoading}
                />
                <p className="text-sm text-gray-500 mt-1">
                  Virgülle ayırın
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>İşlemler</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? 'Kaydediliyor...' : 'Taslak Kaydet'}
              </Button>
              
              <Button
                type="button"
                onClick={(e) => handleSubmit(e, 'published')}
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={isLoading}
              >
                <Globe className="h-4 w-4 mr-2" />
                {isLoading ? 'Yayınlanıyor...' : 'Yayınla'}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="w-full"
                disabled={isLoading}
              >
                <Eye className="h-4 w-4 mr-2" />
                Önizle
              </Button>
            </CardContent>
          </Card>
        </div>
      </form>
    </div>
  )
}