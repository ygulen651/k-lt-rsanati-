"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

export default function YeniKategoriIcerik() {
  const params = useParams() as { category?: string }
  const router = useRouter()
  const category = (params?.category || '').toString()

  const [formData, setFormData] = useState({
    title: '',
    outlet: '',
    date: new Date().toISOString().split('T')[0],
    status: 'published',
    url: '',
    summary: ''
  })
  const [thumbnailFile, setThumbnailFile] = useState<File | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const toType = (cat: string): string => {
    // Model enum: 'tv' | 'radio' | 'newspaper' | 'online'
    if (cat === 'video') return 'online'
    if (cat === 'afis' || cat === 'brosur' || cat === 'fotograf') return 'online'
    if (cat === 'rapor') return 'online'
    if (cat === 'takvim') return 'online'
    return 'online'
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem('auth-token')
      if (!token) {
        alert('Oturum süresi dolmuş. Lütfen giriş yapın.')
        router.push('/admin/login')
        return
      }

      const fd = new FormData()
      fd.append('title', formData.title)
      fd.append('type', toType(category))
      fd.append('outlet', formData.outlet || category)
      fd.append('date', formData.date)
      fd.append('status', formData.status)
      fd.append('category', category)
      if (formData.url) fd.append('url', formData.url)
      if (formData.summary) fd.append('summary', formData.summary)
      if (thumbnailFile) fd.append('thumbnailFile', thumbnailFile)
      images.forEach(img => fd.append('images', img))
      if (file) fd.append('file', file)

      const res = await fetch('/api/press', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      })
      const json = await res.json()
      if (res.ok && json.success) {
        router.push(`/admin/basin-yayin/${category}`)
      } else {
        alert(json.message || 'Kayıt eklenemedi')
      }
    } catch {
      alert('Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => router.push(`/admin/basin-yayin/${category}`)} className="text-red-600 flex items-center gap-2 mb-4">
        <ArrowLeft className="h-4 w-4" /> Geri
      </button>
      <h1 className="text-2xl font-bold mb-6">Yeni {category}</h1>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <input name="title" value={formData.title} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
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
            <select name="status" value={formData.status} onChange={(e) => setFormData(p => ({ ...p, status: e.target.value }))} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
              <option value="archived">Arşiv</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Dış URL (opsiyonel)</label>
            <input name="url" value={formData.url} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Özet</label>
            <textarea name="summary" value={formData.summary} onChange={handleChange} rows={4} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kapak Görseli</label>
            <input type="file" accept="image/*" onChange={(e) => setThumbnailFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Ek Görseller (1-8)</label>
            <input type="file" multiple accept="image/*" onChange={(e) => setImages(Array.from(e.target.files || []) as File[])} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Dosya (PDF/Video vb.)</label>
            <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
            <p className="text-xs text-gray-500 mt-1">Video için YouTube/Vimeo URL girebilir veya video dosyası yükleyebilirsiniz.</p>
          </div>
        </div>
        <button disabled={loading} className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg">
          <Save className="h-4 w-4 mr-2" /> Kaydet
        </button>
      </form>
    </div>
  )
}

