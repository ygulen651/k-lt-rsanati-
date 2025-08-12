'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Save, ArrowLeft } from 'lucide-react'

export default function DuzenleKulturSanatIs({ params }: { params: { slug: string } }) {
  const router = useRouter()
  const { slug } = params
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState<any>(null)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      const res = await fetch(`/api/kultur-sanat-is/${slug}`, { cache: 'no-store' })
      const json = await res.json()
      if (json.success) {
        const it = json.data
        setForm({
          title: it.title, slug: it.slug, excerpt: it.excerpt || '', content: it.content || '',
          tags: (it.tags || []).join(','), featured: !!it.featured,
          publishDate: it.publishDate ? String(it.publishDate).slice(0, 10) : ''
        })
      }
    } finally { setLoading(false) }
  }

  const handleChange = (e: any) => {
    const { name, value, type, checked } = e.target
    setForm((prev: any) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }))
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem('auth-token')
    if (!token) return router.push('/admin/login')
    const res = await fetch(`/api/kultur-sanat-is/${slug}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ ...form, tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean) })
    })
    const json = await res.json()
    if (res.ok && json.success) { alert('Kaydedildi'); router.push('/admin/kultur-sanat-is') } else alert(json.message || 'Hata')
  }

  if (loading || !form) return <div>Yükleniyor…</div>

  return (
    <div className="space-y-6">
      <button onClick={() => router.push('/admin/kultur-sanat-is')} className="inline-flex items-center text-red-600"><ArrowLeft className="h-4 w-4 mr-2" />Geri</button>
      <h1 className="text-2xl font-bold">Kültür Sanat-İş Düzenle</h1>
      <form onSubmit={handleSave} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <input name="title" value={form.title} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          <input name="slug" value={form.slug} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          <input name="excerpt" value={form.excerpt} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          <textarea name="content" value={form.content} onChange={handleChange} rows={8} className="w-full border rounded-lg px-3 py-2" />
          <input name="tags" value={form.tags} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
          <label className="inline-flex items-center gap-2 text-sm"><input type="checkbox" name="featured" checked={form.featured} onChange={handleChange} /> Öne çıkar</label>
          <input type="date" name="publishDate" value={form.publishDate} onChange={handleChange} className="w-full border rounded-lg px-3 py-2" />
        </div>
        <div className="space-y-4">
          <button className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg"><Save className="h-4 w-4 mr-2" />Kaydet</button>
        </div>
      </form>
    </div>
  )
}

