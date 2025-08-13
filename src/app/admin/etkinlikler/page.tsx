'use client'

import { useEffect, useState } from 'react'
import { 
  Plus, 
  Search, 
  Calendar,
  MapPin,
  Users,
  Clock,
  Edit,
  Trash2,
  Eye,
  MoreVertical
} from 'lucide-react'
import Link from 'next/link'

type AdminEvent = {
  _id: string
  title: string
  description?: string
  date: string
  time?: string
  location?: string
  category?: string
  status?: string
  featuredImage?: string
}

const statusColors = {
  upcoming: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  ongoing: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  completed: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
}

const statusLabels = {
  upcoming: 'Yaklaşan',
  ongoing: 'Devam Ediyor',
  completed: 'Tamamlandı',
  cancelled: 'İptal Edildi'
}

export default function EventsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [items, setItems] = useState<AdminEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true)
        const params = new URLSearchParams()
        if (selectedStatus !== 'all') params.set('status', selectedStatus)
        const res = await fetch(`/api/events?${params.toString()}`, { cache: 'no-store' })
        const json = await res.json()
        if (json.success) setItems(json.data)
        else setItems([])
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [selectedStatus])

  const filteredEvents = items.filter(event => {
    const matchesSearch = (event.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (event.description || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'all' || (event.status || '') === selectedStatus
    return matchesSearch && matchesStatus
  })

  const handleSelectAll = () => {
    if (selectedItems.length === filteredEvents.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredEvents.map(item => item._id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Etkinlikler</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tüm etkinlikleri yönetin ve düzenleyin
          </p>
        </div>
        <Link 
          href="/admin/etkinlikler/yeni"
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Etkinlik
        </Link>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Etkinlik ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="upcoming">Yaklaşan</option>
              <option value="ongoing">Devam Ediyor</option>
              <option value="completed">Tamamlandı</option>
              <option value="cancelled">İptal Edildi</option>
            </select>
          </div>
        </div>

        {selectedItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedItems.length} öğe seçildi
              </span>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Toplu Düzenle
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Events Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredEvents.map((event) => (
          <div key={event._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Event Image */}
            <div className="relative h-48">
              <img 
                src={event.featuredImage || 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=400&h=200&fit=crop'} 
                alt={event.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 left-3">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[(event.status as keyof typeof statusColors) || 'upcoming']}`}>
                  {statusLabels[(event.status as keyof typeof statusLabels) || 'upcoming']}
                </span>
              </div>
              <div className="absolute top-3 right-3">
                <input
                  type="checkbox"
                  checked={selectedItems.includes(event._id)}
                  onChange={() => handleSelectItem(event._id)}
                  className="rounded border-gray-300 text-red-600 focus:ring-red-500 bg-white"
                />
              </div>
            </div>

            {/* Event Content */}
            <div className="p-6">
              <div className="mb-2">
                <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded">
                  {event.category || 'Genel'}
                </span>
              </div>
              
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                {event.title}
              </h3>
              
              <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                {event.description}
              </p>

              {/* Event Details */}
              <div className="space-y-2 mb-4">
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Calendar className="h-4 w-4 mr-2" />
                   <span>{new Date(event.date).toLocaleDateString('tr-TR')} {event.time ? `- ${event.time}` : ''}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <MapPin className="h-4 w-4 mr-2" />
                   <span>{event.location || ''}</span>
                </div>
                
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <Users className="h-4 w-4 mr-2" />
                  <span>{'-'}</span>
                </div>
              </div>

              {/* Progress Bar */}
              <div className="mb-4">
                <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-1">
                  <span>Doluluk Oranı</span>
                  <span>{Math.round((((event as any).registered || 0) / ((event as any).capacity || 1)) * 100)}%</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div className="bg-red-600 h-2 rounded-full transition-all duration-300" style={{ width: `0%` }}></div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-between pt-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                  <Link
                    href={`/admin/etkinlikler/${event._id}`}
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Görüntüle"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>
                  <Link
                    href={`/admin/etkinlikler/${event._id}/duzenle`}
                    className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                    title="Düzenle"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                    title="Sil"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
                
                <button
                  className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                  title="Daha fazla"
                >
                  <MoreVertical className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredEvents.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Etkinlik bulunamadı
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || selectedStatus !== 'all' 
              ? 'Arama kriterlerinize uygun etkinlik bulunamadı.'
              : 'Henüz hiç etkinlik eklenmemiş.'}
          </p>
          <Link
            href="/admin/etkinlikler/yeni"
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            İlk Etkinliği Ekle
          </Link>
        </div>
      )}

      {/* Pagination */}
      {filteredEvents.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Toplam {filteredEvents.length} etkinlik
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Önceki
              </button>
              <button className="px-3 py-2 text-sm bg-red-600 text-white rounded-lg">
                1
              </button>
              <button className="px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                Sonraki
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
