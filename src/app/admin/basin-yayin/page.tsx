"use client"

import { useEffect, useState } from 'react'
import { 
  Plus, 
  Search, 
  Newspaper,
  Tv,
  Radio,
  Globe,
  Calendar,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  TrendingUp,
  Users,
  Share2,
  ExternalLink
} from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

type PressItem = {
  _id: string
  title: string
  type: 'tv' | 'radio' | 'newspaper' | 'online'
  outlet: string
  date: string
  status: 'draft' | 'published' | 'archived'
  views: number
  shares: number
  url: string
  thumbnail?: string
  summary?: string
  category?: string
}

const typeColors = {
  tv: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  radio: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  newspaper: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400',
  online: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
}

const typeLabels = {
  tv: 'Televizyon',
  radio: 'Radyo',
  newspaper: 'Gazete',
  online: 'Online'
}

const typeIcons = {
  tv: Tv,
  radio: Radio,
  newspaper: Newspaper,
  online: Globe
}

export default function PressPage() {
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedType, setSelectedType] = useState<'all' | 'tv' | 'radio' | 'newspaper' | 'online'>('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [items, setItems] = useState<PressItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadItems()
  }, [selectedType, searchTerm])

  const loadItems = async () => {
    try {
      setIsLoading(true)
      setError('')
      const params = new URLSearchParams()
      if (selectedType !== 'all') params.append('type', selectedType)
      if (searchTerm) params.append('search', searchTerm)
      const res = await fetch(`/api/press?${params.toString()}`, { cache: 'no-store' })
      const json = await res.json()
      if (json.success) setItems(json.data)
      else setItems([])
    } catch (e) {
      setError('Veriler yüklenemedi')
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = (item.title || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.outlet || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.summary || '').toLowerCase().includes(searchTerm.toLowerCase())
    const matchesType = selectedType === 'all' || item.type === selectedType
    return matchesSearch && matchesType
  })

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredItems.map(item => item._id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const totalViews = items.reduce((sum, item) => sum + (item.views || 0), 0)
  const totalShares = items.reduce((sum, item) => sum + (item.shares || 0), 0)

  const handleDelete = async (id: string) => {
    if (!confirm('Bu yayını silmek istiyor musunuz?')) return
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
        setSelectedItems(prev => prev.filter(s => s !== id))
      } else {
        alert(json.message || 'Silme başarısız')
      }
    } catch (e) {
      alert('Bir hata oluştu')
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Basın-Yayın</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Medya yayınlarını ve basın faaliyetlerini yönetin
          </p>
        </div>
        <Link 
          href="/admin/basin-yayin/yeni"
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Basın Yayını
        </Link>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <Newspaper className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Yayın</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Görüntülenme</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalViews.toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <Share2 className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Paylaşım</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalShares.toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
              <TrendingUp className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bu Ay</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {items.filter(item => new Date(item.date).getMonth() === new Date().getMonth()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Basın yayını ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          <div className="sm:w-48">
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value as "tv" | "radio" | "newspaper" | "online" | "all")}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tüm Medya Tipleri</option>
              <option value="tv">Televizyon</option>
              <option value="radio">Radyo</option>
              <option value="newspaper">Gazete</option>
              <option value="online">Online</option>
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
                <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
                  Rapor Oluştur
                </button>
                <button className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors">
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Press Items Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const IconComponent = typeIcons[item.type as keyof typeof typeIcons]
          return (
            <div key={item._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
              {/* Header */}
              <div className="relative">
                <img 
                  src={item.thumbnail} 
                  alt={item.title}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-3 left-3 flex items-center space-x-2">
                  <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${typeColors[item.type as keyof typeof typeColors]}`}>
                    <IconComponent className="h-3 w-3 mr-1" />
                    {typeLabels[item.type as keyof typeof typeLabels]}
                  </span>
                  <span className="inline-block px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 rounded-full">
                    {item.category}
                  </span>
                </div>
                <div className="absolute top-3 right-3">
                  <input
                    type="checkbox"
                    checked={selectedItems.includes(item._id)}
                    onChange={() => handleSelectItem(item._id)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500 bg-white shadow-sm"
                  />
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white line-clamp-2">
                    {item.title}
                  </h3>
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                    title="Dış bağlantıyı aç"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </a>
                </div>

                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                  {item.summary}
                </p>

                {/* Meta Info */}
                <div className="space-y-2 mb-4">
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Globe className="h-4 w-4 mr-2" />
                    <span>{item.outlet}</span>
                  </div>
                  
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                    <Calendar className="h-4 w-4 mr-2" />
                    <span>{new Date(item.date).toLocaleDateString('tr-TR')}</span>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <div className="flex items-center">
                      <Eye className="h-4 w-4 mr-1" />
                      <span>{item.views.toLocaleString('tr-TR')}</span>
                    </div>
                    <div className="flex items-center">
                      <Share2 className="h-4 w-4 mr-1" />
                      <span>{item.shares}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                      <Link
                       href={`/admin/basin-yayin/${item._id}`}
                      className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                      title="Görüntüle"
                    >
                      <Eye className="h-4 w-4" />
                    </Link>
                      <Link
                        href={`/admin/basin-yayin/${item._id}/duzenle`}
                      className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                      title="Düzenle"
                    >
                      <Edit className="h-4 w-4" />
                    </Link>
                      <button
                      className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                      title="Sil"
                        onClick={() => handleDelete(item._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <button
                      className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors"
                      title="Daha fazla"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Empty State */}
      {filteredItems.length === 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-12 text-center">
          <Newspaper className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Basın yayını bulunamadı
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {searchTerm || selectedType !== 'all'
              ? 'Arama kriterlerinize uygun basın yayını bulunamadı.'
              : 'Henüz hiç basın yayını eklenmemiş.'}
          </p>
          <Link
            href="/admin/basin-yayin/yeni"
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            İlk Basın Yayınını Ekle
          </Link>
        </div>
      )}

      {/* Pagination */}
      {filteredItems.length > 0 && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Toplam {filteredItems.length} basın yayını
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
