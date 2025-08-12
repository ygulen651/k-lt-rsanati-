'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, Edit, Trash2 } from 'lucide-react'

type Item = {
  _id: string
  title: string
  slug: string
  publishDate: string
  status: 'draft' | 'published' | 'archived'
}

export default function KulturSanatIsAdminList() {
  const [items, setItems] = useState<Item[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [])

  async function load() {
    try {
      setLoading(true)
      const res = await fetch('/api/kultur-sanat-is?status=published', { cache: 'no-store' })
      const json = await res.json()
      setItems(json.success ? json.data : [])
    } finally { setLoading(false) }
  }

  async function handleDelete(slug: string) {
    if (!confirm('Bu içeriği silmek istiyor musunuz?')) return
    const token = localStorage.getItem('auth-token')
    if (!token) return alert('Oturum kapalı')
    const res = await fetch(`/api/kultur-sanat-is/${slug}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    const json = await res.json()
    if (res.ok && json.success) setItems(prev => prev.filter(i => i.slug !== slug))
    else alert(json.message || 'Silinemedi')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Kültür Sanat-İş</h1>
        <Link href="/admin/kultur-sanat-is/yeni" className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg"><Plus className="h-4 w-4 mr-2" />Yeni</Link>
      </div>

      {loading ? (
        <div>Yükleniyor…</div>
      ) : (
        <div className="bg-white dark:bg-gray-900 rounded-xl border">
          <table className="min-w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-3">Başlık</th>
                <th className="text-left p-3">Slug</th>
                <th className="text-left p-3">Tarih</th>
                <th className="p-3" />
              </tr>
            </thead>
            <tbody>
              {items.map(it => (
                <tr key={it._id} className="border-b">
                  <td className="p-3">{it.title}</td>
                  <td className="p-3">{it.slug}</td>
                  <td className="p-3">{new Date(it.publishDate).toLocaleDateString('tr-TR')}</td>
                  <td className="p-3 text-right">
                    <Link href={`/admin/kultur-sanat-is/${it.slug}/duzenle`} className="inline-flex p-2 hover:text-green-600"><Edit className="h-4 w-4" /></Link>
                    <button onClick={() => handleDelete(it.slug)} className="inline-flex p-2 hover:text-red-600"><Trash2 className="h-4 w-4" /></button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
