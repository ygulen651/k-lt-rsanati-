"use client"

import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { ArrowLeft, Save } from 'lucide-react'

export default function DuzenleKategoriIcerik() {
  const params = useParams() as { category?: string, id?: string }
  const router = useRouter()
  const category = (params?.category || '').toString()
  const id = (params?.id || '').toString()

  const [formData, setFormData] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`/api/press/${id}`, { cache: 'no-store' })
        const json = await res.json()
        if (json.success) setFormData(json.data)
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData((p: any) => ({ ...p, [name]: value }))
  }

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setSaving(true)
      const token = localStorage.getItem('auth-token')
      if (!token) {
        alert('Oturum süresi dolmuş. Lütfen giriş yapın.')
        router.push('/admin/login')
        return
      }
      const res = await fetch(`/api/press/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          title: formData.title,
          outlet: formData.outlet,
          date: formData.date?.slice(0,10),
          status: formData.status,
          url: formData.url,
          summary: formData.summary,
          category: category
        })
      })
      const json = await res.json()
      if (res.ok && json.success) {
        router.push(`/admin/basin-yayin/${category}`)
      } else {
        alert(json.message || 'Güncelleme başarısız')
      }
    } catch {
      alert('Hata oluştu')
    } finally {
      setSaving(false)
    }
  }

  if (loading || !formData) return <div>Yükleniyor...</div>

  return (
    <div className="max-w-3xl mx-auto">
      <button onClick={() => router.push(`/admin/basin-yayin/${category}`)} className="text-red-600 flex items-center gap-2 mb-4">
        <ArrowLeft className="h-4 w-4" /> Geri
      </button>
      <h1 className="text-2xl font-bold mb-6">Düzenle: {formData.title}</h1>
      <form onSubmit={handleSave} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium mb-1">Başlık</label>
            <input name="title" value={formData.title || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Kaynak/Medya</label>
            <input name="outlet" value={formData.outlet || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Tarih</label>
            <input type="date" name="date" value={(formData.date || '').slice(0,10)} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Durum</label>
            <select name="status" value={formData.status || 'published'} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800">
              <option value="published">Yayında</option>
              <option value="draft">Taslak</option>
              <option value="archived">Arşiv</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Dış URL (opsiyonel)</label>
            <input name="url" value={formData.url || ''} onChange={handleChange} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1">Özet</label>
            <textarea name="summary" value={formData.summary || ''} onChange={handleChange} rows={4} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          </div>
        </div>
        <button disabled={saving} className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg">
          <Save className="h-4 w-4 mr-2" /> Güncelle
        </button>
      </form>
    </div>
  )
}

