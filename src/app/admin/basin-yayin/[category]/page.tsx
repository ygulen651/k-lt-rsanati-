"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useParams, useRouter } from 'next/navigation'
import { Plus, Edit, Trash2, ExternalLink } from 'lucide-react'

export default function BasinKategoriListesi() {
  const params = useParams() as { category?: string }
  const router = useRouter()
  const category = (params?.category || '').toString()
  const [items, setItems] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (!category) return
    const load = async () => {
      try {
        setLoading(true)
        setError('')
        const res = await fetch(`/api/press?category=${encodeURIComponent(category)}`, { cache: 'no-store' })
        const json = await res.json()
        if (json.success) setItems(json.data)
        else setItems([])
      } catch {
        setError('Veriler yüklenemedi')
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [category])

  const handleDelete = async (id: string) => {
    if (!confirm('Bu kaydı silmek istiyor musunuz?')) return
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
        router.push('/admin/login')
        return
      }
      const res = await fetch(`/api/press/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setItems(prev => prev.filter(i => i._id !== id))
      } else {
        alert(json.message || 'Silme başarısız')
      }
    } catch {
      alert('Bir hata oluştu')
    }
  }

  const titleMap: Record<string, string> = {
    afis: 'Afişler',
    brosur: 'Broşürler',
    fotograf: 'Fotoğraflar',
    video: 'Videolar',
    rapor: 'Raporlar',
    takvim: 'Çalışma Takvimi'
  }

  const pageTitle = titleMap[category] || 'İçerikler'

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">{pageTitle}</h1>
          <p className="text-gray-500">Kategori: {category}</p>
        </div>
        <Link
          href={`/admin/basin-yayin/${category}/yeni`}
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg"
        >
          <Plus className="h-4 w-4 mr-2" /> Yeni Ekle
        </Link>
      </div>

      {loading ? (
        <div>Yükleniyor...</div>
      ) : error ? (
        <div className="text-red-600">{error}</div>
      ) : items.length === 0 ? (
        <div className="border rounded-lg p-8 text-center text-gray-500">Henüz içerik yok.</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item) => (
            <div key={item._id} className="border rounded-lg overflow-hidden bg-white dark:bg-gray-800">
              <div className="aspect-video bg-gray-100">
                <img src={item.thumbnail || item.images?.[0] || '/placeholder.png'} alt={item.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-4 space-y-2">
                <div className="font-semibold line-clamp-2">{item.title}</div>
                <div className="text-sm text-gray-500">{new Date(item.date).toLocaleDateString('tr-TR')}</div>
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-2">
                    {item.url && (
                      <a href={item.url} target="_blank" className="p-2 rounded hover:bg-gray-100" title="Bağlantı">
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/admin/basin-yayin/${category}/${item._id}/duzenle`} className="px-3 py-1 text-sm bg-green-600 text-white rounded">
                      <Edit className="h-3 w-3 inline mr-1" /> Düzenle
                    </Link>
                    <button onClick={() => handleDelete(item._id)} className="px-3 py-1 text-sm bg-red-600 text-white rounded">
                      <Trash2 className="h-3 w-3 inline mr-1" /> Sil
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

