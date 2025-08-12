"use client"

import { useEffect, useState } from 'react'
import { Save, Upload, Video as VideoIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'

type Props = {
  category?: string
}

export default function VideoUpload({ category = 'video' }: Props) {
  const router = useRouter()
  const [hasToken, setHasToken] = useState(false)
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [date, setDate] = useState<string>(() => new Date().toISOString().slice(0, 10))
  const [url, setUrl] = useState('')
  const [summary, setSummary] = useState('')
  const [thumbnail, setThumbnail] = useState<File | null>(null)
  const [file, setFile] = useState<File | null>(null)

  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : null
    setHasToken(!!token)
  }, [])

  if (!hasToken) return null

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      setLoading(true)
      const token = localStorage.getItem('auth-token')
      if (!token) return alert('Oturum kapalı')

      const fd = new FormData()
      fd.append('title', title)
      fd.append('type', 'online')
      fd.append('outlet', 'video')
      fd.append('date', date)
      fd.append('status', 'published')
      fd.append('category', category)
      if (url) fd.append('url', url)
      if (summary) fd.append('summary', summary)
      if (thumbnail) fd.append('thumbnailFile', thumbnail)
      if (file) fd.append('file', file)

      const res = await fetch('/api/press', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: fd
      })
      const json = await res.json()
      if (res.ok && json.success) {
        setTitle('')
        setUrl('')
        setSummary('')
        setThumbnail(null)
        setFile(null)
        router.refresh()
      } else {
        alert(json.message || 'Yükleme başarısız')
      }
    } catch (e) {
      alert('Hata oluştu')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mb-8 border rounded-xl p-4 bg-white dark:bg-gray-900">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-8 h-8 rounded bg-primary/10 flex items-center justify-center">
          <VideoIcon className="w-4 h-4 text-primary" />
        </div>
        <h2 className="font-semibold">Yeni Video Yükle (Sadece Yönetici)</h2>
      </div>
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium mb-1">Başlık</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Tarih</label>
          <input type="date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Video URL (YouTube/Vimeo) - opsiyonel</label>
          <input value={url} onChange={(e) => setUrl(e.target.value)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
        </div>
        <div className="md:col-span-2">
          <label className="block text-sm font-medium mb-1">Özet (opsiyonel)</label>
          <textarea value={summary} onChange={(e) => setSummary(e.target.value)} rows={3} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Kapak Görseli</label>
          <input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Video Dosyası (opsiyonel)</label>
          <input type="file" accept="video/*" onChange={(e) => setFile(e.target.files?.[0] || null)} className="w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-800" />
          <p className="text-xs text-muted-foreground mt-1 flex items-center gap-1"><Upload className="w-3 h-3" /> Dosya yüklemezseniz URL kullanılacaktır.</p>
        </div>
        <div className="md:col-span-2">
          <button disabled={loading} className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg">
            <Save className="h-4 w-4 mr-2" /> Kaydet
          </button>
        </div>
      </form>
    </div>
  )
}


