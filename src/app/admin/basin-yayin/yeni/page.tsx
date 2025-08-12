"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

export default function YeniBasinPage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    type: 'online' as 'tv' | 'radio' | 'newspaper' | 'online',
    outlet: '',
    date: new Date().toISOString().split('T')[0],
    status: 'published' as 'draft' | 'published' | 'archived',
    url: '', // opsiyonel dış link
    thumbnailUrl: '', // opsiyonel URL
    summary: '',
    category: ''
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!formData.title || !formData.type || !formData.outlet || !formData.date) {
      alert('Başlık, tür, kaynak ve tarih zorunludur')
      return
    }

    try {
      setIsLoading(true)
      const token = localStorage.getItem('auth-token')
      if (!token) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
        router.push('/admin/login')
        return
      }

      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('type', formData.type)
      fd.append('outlet', formData.outlet)
      fd.append('date', formData.date)
      fd.append('status', formData.status)
      if (formData.url) fd.append('url', formData.url)
      if (formData.thumbnailUrl) fd.append('thumbnailUrl', formData.thumbnailUrl)
      if (thumbnailFile) fd.append('thumbnailFile', thumbnailFile)
      if (formData.summary) fd.append('summary', formData.summary)
      if (formData.category) fd.append('category', formData.category)
      // Çoklu görsel dosyaları
      images.forEach(img => fd.append('images', img))

      const res = await fetch('/api/press', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: fd
      })
      const json = await res.json()
      if (res.ok && json.success) {
        alert('Basın yayını eklendi')
        router.push('/admin/basin-yayin')
      } else {
        alert(json.message || 'Kayıt eklenemedi')
      }
    } catch (e) {
      alert('Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <button
          onClick={() => router.push('/admin/basin-yayin')}
          className="inline-flex items-center text-red-600 hover:text-red-700 mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Geri Dön
        </button>

        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-6">Yeni Basın Yayını</h1>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Başlık</label>
              <input name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tür</label>
              <select name="type" value={formData.type} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
                <option value="tv">Televizyon</option>
                <option value="radio">Radyo</option>
                <option value="newspaper">Gazete</option>
                <option value="online">Online</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kaynak/Medya</label>
              <input name="outlet" value={formData.outlet} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Tarih</label>
              <input type="date" name="date" value={formData.date} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Durum</label>
              <select name="status" value={formData.status} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
                <option value="published">Yayında</option>
                <option value="draft">Taslak</option>
                <option value="archived">Arşiv</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kategori</label>
              <input name="category" value={formData.category} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">URL</label>
              <input name="url" value={formData.url} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kapak Görseli (Dosya)</label>
              <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Ek Görseller (1-8 adet)</label>
              <input
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
                className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800"
              />
              <p className="text-xs text-gray-500 mt-1">Toplam 1-8 görsel yükleyebilirsiniz.</p>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Kapak Görseli (URL - opsiyonel)</label>
              <input name="thumbnailUrl" value={formData.thumbnailUrl} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium mb-1">Özet</label>
              <textarea name="summary" value={formData.summary} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" rows={4} />
            </div>
          </div>

          <button disabled={isLoading} className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg">
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </button>
        </form>
      </div>
    </div>
  )
}
