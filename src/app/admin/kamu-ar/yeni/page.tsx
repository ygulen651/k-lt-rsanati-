"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'

export default function YeniKamuAr() {
  const router = useRouter()
  const [form, setForm] = useState({
    title: '',
    slug: '',
    excerpt: '',
    content: '',
    category: 'genel',
    tags: '',
    featured: false,
    publishDate: new Date().toISOString().split('T')[0],
    coverImageUrl: ''
  })
  const [coverFile, setCoverFile] = useState<File | null>(null)
  const [images, setImages] = useState<File[]>([])
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!form.title) return alert('Başlık zorunlu')
    try {
      setLoading(true)
      const token = localStorage.getItem('auth-token')
      if (!token) return router.push('/admin/login')
      const fd = new FormData()
      Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)))
      if (coverFile) fd.append('coverImageFile', coverFile)
      images.forEach(img => fd.append('images', img))
      if (file) fd.append('file', file)
      const res = await fetch('/api/kamu-ar', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
      const json = await res.json()
      if (res.ok && json.success) {
        alert('Kayıt oluşturuldu')
        router.push('/admin/kamu-ar')
      } else alert(json.message || 'Hata')
    } finally { setLoading(false) }
  }

  return (
    <div className="space-y-6">
      <button onClick={() => router.push('/admin/kamu-ar')} className="inline-flex items-center text-red-600"><ArrowLeft className="h-4 w-4 mr-2" />Geri</button>
      <h1 className="text-2xl font-bold">Yeni Kamu-AR</h1>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input name="title" placeholder="Başlık" value={form.title} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          <input name="slug" placeholder="Slug (opsiyonel)" value={form.slug} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          <input name="excerpt" placeholder="Kısa özet" value={form.excerpt} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          <textarea name="content" placeholder="İçerik" value={form.content} onChange={handleChange} rows={8} className="w-full border rounded-lg px-3 py-2" />
          <input name="category" value={form.category} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          <input name="tags" placeholder="etiket1, etiket2" value={form.tags} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Öne çıkar</label>
          <input type="date" name="publishDate" value={form.publishDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="space-y-4">
          <input type="file" accept="image/*" onChange={(e) => setCoverFile(e.target.files?.[0] || null)} className="w-full border rounded-lg px-3 py-2" />
          <input type="text" name="coverImageUrl" placeholder="Kapak Görseli URL (opsiyonel)" value={form.coverImageUrl} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          <input type="file" accept="image/*" multiple onChange={(e) => setImages(Array.from(e.target.files || []).slice(0, 8))} className="w-full border rounded-lg px-3 py-2" />
          <input type="file" accept="application/pdf,video/*,audio/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full border rounded-lg px-3 py-2" />
          <button disabled={loading} className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg"><Save className="h-4 w-4 mr-2" />Kaydet</button>
        </div>
      </form>
    </div>
  )
}


