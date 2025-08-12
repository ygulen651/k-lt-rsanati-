'use client'

import { useEffect, useState } from 'react'
import { 
  Plus, 
  Search, 
  Upload,
  Image as ImageIcon,
  Video,
  Trash2,
  Edit,
  Eye,
  Download,
  Filter,
  Grid3X3,
  List,
  Calendar,
  Tag,
  Folder,
  MoreVertical
} from 'lucide-react'

// Media type aligned with API
type MediaItem = {
  _id: string
  title: string
  type: 'image' | 'video'
  url: string
  thumbnail?: string
  category?: string
  tags: string[]
  uploadDate: string
  size?: string
  width?: number
  height?: number
}

export default function GalleryPage() {
  const [items, setItems] = useState<MediaItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [selectedType, setSelectedType] = useState<'all' | 'image' | 'video'>('all')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const [selectedItems, setSelectedItems] = useState<string[]>([])

  const categories = Array.from(new Set(items.map(i => i.category || 'Genel')))

  useEffect(() => { load() }, [])

  async function load() {
    const res = await fetch('/api/media?status=published', { cache: 'no-store' })
    const json = await res.json()
    setItems(json.success ? json.data : [])
  }

  const filteredItems = items.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (item.tags || []).some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'Tümü' || (item.category || 'Genel') === selectedCategory
    const matchesType = selectedType === 'all' || item.type === selectedType
    return matchesSearch && matchesCategory && matchesType
  })

  const handleSelectAll = () => {
    if (selectedItems.length === filteredItems.length) setSelectedItems([])
    else setSelectedItems(filteredItems.map(item => item._id))
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])
  }

  async function handleDelete(id: string) {
    if (!confirm('Seçili medyayı silmek istiyor musunuz?')) return
    const token = localStorage.getItem('auth-token')
    if (!token) return alert('Oturum kapalı')
    const res = await fetch(`/api/media/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
    const json = await res.json()
    if (res.ok && json.success) setItems(prev => prev.filter(i => i._id !== id))
    else alert(json.message || 'Silinemedi')
  }

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    const title = prompt('Başlık giriniz:', file.name) || file.name
    const isImage = file.type.startsWith('image')
    const token = localStorage.getItem('auth-token')
    if (!token) return alert('Oturum kapalı')

    const fd = new FormData()
    fd.append('file', file)
    fd.append('title', title)
    fd.append('type', isImage ? 'image' : 'video')

    const res = await fetch('/api/media', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
    const json = await res.json()
    if (res.ok && json.success) {
      alert('Yüklendi')
      load()
    } else alert(json.message || 'Yüklenemedi')
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Galeri Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Fotoğraf ve videoları yönetin</p>
        </div>
        <div className="flex items-center space-x-3">
          <label className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors cursor-pointer">
            <Upload className="h-4 w-4 mr-2" /> Dosya Yükle
            <input type="file" accept="image/*,video/*" className="hidden" onChange={handleUpload} />
          </label>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <ImageIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Fotoğraf</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {items.filter(item => item.type === 'image').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <Video className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Video</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {items.filter(item => item.type === 'video').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Medya</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{items.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
              <Folder className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kategoriler</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{categories.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Medya ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {['Tümü', ...categories].map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${selectedCategory === category ? 'bg-red-600 text-white' : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'}`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Type Filter */}
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value as any)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tüm Tipler</option>
            <option value="image">Fotoğraflar</option>
            <option value="video">Videolar</option>
          </select>

          {/* View Mode Toggle */}
          <div className="flex items-center border border-gray-300 dark:border-gray-600 rounded-lg">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded-l-lg transition-colors ${viewMode === 'grid' ? 'bg-red-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <Grid3X3 className="h-4 w-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-r-lg transition-colors ${viewMode === 'list' ? 'bg-red-600 text-white' : 'text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700'}`}
            >
              <List className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Media Grid/List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        {viewMode === 'grid' ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => (
              <div key={item._id} className="group relative bg-gray-50 dark:bg-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <div className="absolute top-2 left-2 z-10">
                  <input type="checkbox" checked={selectedItems.includes(item._id)} onChange={() => handleSelectItem(item._id)} className="rounded border-gray-300 text-red-600 focus:ring-red-500 bg-white shadow-sm" />
                </div>
                <div className="relative aspect-video">
                  <img src={item.thumbnail || item.url} alt={item.title} className="w-full h-full object-cover" />
                  {item.type === 'video' && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="bg-black/50 rounded-full p-3"><Video className="h-6 w-6 text-white" /></div>
                    </div>
                  )}
                  <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-2">
                    <a href={item.url} target="_blank" className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors"><Eye className="h-4 w-4" /></a>
                    <button className="p-2 bg-white/20 rounded-lg text-white hover:bg-white/30 transition-colors" onClick={() => handleDelete(item._id)}><Trash2 className="h-4 w-4" /></button>
                  </div>
                </div>
                <div className="p-4">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.title}</h3>
                  <div className="mt-2 space-y-1 text-xs text-gray-500 dark:text-gray-400">
                    <div className="flex items-center justify-between"><span>{item.category || 'Genel'}</span><span>{new Date(item.uploadDate).toLocaleDateString('tr-TR')}</span></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredItems.map((item) => (
              <div key={item._id} className="flex items-center space-x-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <input type="checkbox" checked={selectedItems.includes(item._id)} onChange={() => handleSelectItem(item._id)} className="rounded border-gray-300 text-red-600 focus:ring-red-500" />
                <div className="w-16 h-16 relative"><img src={item.thumbnail || item.url} alt={item.title} className="w-full h-full object-cover rounded" /></div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium text-gray-900 dark:text-white truncate">{item.title}</h3>
                  <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500 dark:text-gray-400"><span>{item.category || 'Genel'}</span><span>{new Date(item.uploadDate).toLocaleDateString('tr-TR')}</span></div>
                </div>
                <div className="flex items-center space-x-2">
                  <a href={item.url} target="_blank" className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"><Eye className="h-4 w-4" /></a>
                  <button className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" onClick={() => handleDelete(item._id)}><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <ImageIcon className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Medya bulunamadı</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">{searchTerm || selectedCategory !== 'Tümü' || selectedType !== 'all' ? 'Arama kriterlerinize uygun medya bulunamadı.' : 'Henüz hiç medya yüklenmemiş.'}</p>
            <label className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors cursor-pointer"><Upload className="h-4 w-4 mr-2" /> İlk Medyayı Yükle<input type="file" className="hidden" accept="image/*,video/*" onChange={handleUpload} /></label>
          </div>
        )}
      </div>
    </div>
  )
}
