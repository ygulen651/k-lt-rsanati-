"use client"

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Plus, User } from 'lucide-react'

interface Member { id: string; name: string; position: string; photo: string; bio: string }

export default function GroupManagement({ group, showActions = false, apiPath }: { group: string; showActions?: boolean; apiPath?: string }) {
  const [members, setMembers] = useState<Member[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { load() }, [group, apiPath])

  async function load() {
    try {
      setLoading(true)
      const url = apiPath ? apiPath : `/api/management?group=${encodeURIComponent(group)}`
      const res = await fetch(url)
      const json = await res.json()
      if (json.success) {
        setMembers(json.data as any[])
      } else setMembers([])
    } finally { setLoading(false) }
  }

  async function addEmptyCard() {
    const token = localStorage.getItem('auth-token')
    if (!token) return alert('Oturum kapalı')
    const url = apiPath ? apiPath : '/api/management'
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ group, name: '', position: '', email: '' })
    })
    const json = await res.json()
    if (res.ok && json.success) {
      await load()
      alert('Boş kart eklendi')
    } else alert(json.message || 'Eklenemedi')
  }

  const titleMap: Record<string, string> = {
    'merkez-yonetim-kurulu': 'Merkez Yönetim Kurulu',
    'merkez-denetleme-kurulu': 'Merkez Denetleme Kurulu',
    'merkez-disiplin-kurulu': 'Merkez Disiplin Kurulu'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">{titleMap[group] || 'Yönetim'}</h1>
        {showActions && (
          <div className="flex items-center gap-2">
            <button onClick={addEmptyCard} className="inline-flex items-center px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg">
              <Plus className="h-4 w-4 mr-2" /> Boş Kart Ekle
            </button>
            <Link href="/admin/yonetim/yeni" className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg">
              <Plus className="h-4 w-4 mr-2" /> Yeni Üye
            </Link>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {members.map(m => (
          <div key={m.id} className="bg-white dark:bg-gray-800 rounded-xl border p-6">
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {m.photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={m.photo} alt={m.name} className="w-16 h-16 rounded-full object-cover" />
                ) : (
                  <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                    <User className="h-8 w-8 text-gray-400" />
                  </div>
                )}
              </div>
              <div>
                <div className="font-semibold">{m.name || '(İsim Yok)'}</div>
                <div className="text-sm text-red-600">{m.position || '(Pozisyon Yok)'}</div>
              </div>
            </div>
            {m.bio && <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{m.bio}</p>}
          </div>
        ))}
      </div>
    </div>
  )
}
