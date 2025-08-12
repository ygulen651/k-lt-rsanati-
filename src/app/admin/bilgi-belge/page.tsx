'use client'

import { useState, useEffect } from 'react'
import { 
  Plus, 
  Search, 
  FileText,
  File,
  Download,
  Upload,
  Folder,
  Calendar,
  User,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Filter,
  Archive,
  Lock,
  Unlock,
  Share2
} from 'lucide-react'
import Link from 'next/link'

// Mock data - boş liste
const documentsData: any[] = []

const fileTypeColors = {
  pdf: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  docx: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  xlsx: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  pptx: 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400',
  txt: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const statusColors = {
  published: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  draft: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

const statusLabels = {
  published: 'Yayında',
  draft: 'Taslak',
  archived: 'Arşiv'
}

const categories = ['Tümü', 'Resmi Belgeler', 'Şablonlar', 'Formlar', 'Yönetim', 'Hukuki', 'Eğitim']

export default function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('Tümü')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedItems, setSelectedItems] = useState<string[]>([])
  const [showPrivate, setShowPrivate] = useState(false)
  const [documents, setDocuments] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Belgeleri API'den yükle
  useEffect(() => {
    fetchDocuments()
  }, [selectedCategory, selectedStatus, searchTerm, showPrivate])

  const fetchDocuments = async () => {
    try {
      setIsLoading(true)
      const params = new URLSearchParams()
      
      if (selectedCategory !== 'Tümü') params.append('category', selectedCategory)
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      if (searchTerm) params.append('search', searchTerm)
      if (showPrivate) params.append('showPrivate', 'true')

      const response = await fetch(`/api/documents?${params.toString()}`)
      const result = await response.json()

      if (result.success) {
        setDocuments(result.data)
      } else {
        console.error('Documents fetch error:', result.message)
        setDocuments([])
      }
    } catch (error) {
      console.error('Fetch documents error:', error)
      setDocuments([])
    } finally {
      setIsLoading(false)
    }
  }

  const filteredDocuments = documents.filter(doc => {
    const matchesSearch = doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = selectedCategory === 'Tümü' || doc.category === selectedCategory
    const matchesStatus = selectedStatus === 'all' || doc.status === selectedStatus
    const matchesPrivacy = showPrivate || !doc.isPrivate
    return matchesSearch && matchesCategory && matchesStatus && matchesPrivacy
  })

  const handleSelectAll = () => {
    if (selectedItems.length === filteredDocuments.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(filteredDocuments.map(item => item._id))
    }
  }

  const handleSelectItem = (id: string) => {
    setSelectedItems(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const totalSize = documents.reduce((sum, doc) => {
    const size = parseFloat(doc.size.split(' ')[0])
    const unit = doc.size.split(' ')[1]
    return sum + (unit === 'MB' ? size : size / 1024)
  }, 0)

  const totalDownloads = documents.reduce((sum, doc) => sum + doc.downloads, 0)

  const handleDeleteDocument = async (docId: string) => {
    const doc = documents.find(d => d._id === docId)
    if (!doc) return

    if (confirm(`"${doc.title}" belgesini silmek istediğinizden emin misiniz?`)) {
      try {
        const token = localStorage.getItem('auth-token')
        if (!token) {
          alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
          return
        }

        const response = await fetch(`/api/documents/${docId}`, {
          method: 'DELETE',
          headers: { 'Authorization': `Bearer ${token}` }
        })

        const result = await response.json()

        if (response.ok && result.success) {
          // Listeyi yeniden yükle
          fetchDocuments()
          // Seçili öğelerden de kaldır
          setSelectedItems(prev => prev.filter(id => id !== docId))
          alert('Belge başarıyla silindi!')
        } else {
          alert(result.message || 'Belge silinemedi')
        }
      } catch (error) {
        console.error('Delete error:', error)
        alert('Bir hata oluştu')
      }
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.length === 0) {
      alert('Silinecek belge seçin')
      return
    }

    const count = selectedItems.length
    if (confirm(`${count} belgeyi silmek istediğinizden emin misiniz?`)) {
      try {
        const token = localStorage.getItem('auth-token')
        if (!token) {
          alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
          return
        }

        // Tüm belgeleri sil
        const deletePromises = selectedItems.map(id =>
          fetch(`/api/documents/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${token}` }
          })
        )

        await Promise.all(deletePromises)
        
        // Listeyi yeniden yükle
        fetchDocuments()
        setSelectedItems([])
        alert(`${count} belge başarıyla silindi!`)
      } catch (error) {
        console.error('Bulk delete error:', error)
        alert('Bir hata oluştu')
      }
    }
  }



  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bilgi-Belge Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Tüm belgeleri ve dosyaları yönetin
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <Link href="/admin/bilgi-belge/yeni" className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors">
            <Upload className="h-4 w-4 mr-2" />
            Belge Yükle
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 dark:bg-blue-900/20 p-3 rounded-lg">
              <FileText className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Belge</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{documents.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-green-100 dark:bg-green-900/20 p-3 rounded-lg">
              <Download className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam İndirme</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalDownloads.toLocaleString('tr-TR')}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 dark:bg-purple-900/20 p-3 rounded-lg">
              <Archive className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Depolama</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {totalSize.toFixed(1)} MB
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="bg-orange-100 dark:bg-orange-900/20 p-3 rounded-lg">
              <Lock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Gizli Belgeler</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {documents.filter(doc => doc.isPrivate).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Belge ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-red-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          {/* Status Filter */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
          >
            <option value="all">Tüm Durumlar</option>
            <option value="published">Yayında</option>
            <option value="draft">Taslak</option>
            <option value="archived">Arşiv</option>
          </select>

          {/* Privacy Toggle */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="show-private"
              checked={showPrivate}
              onChange={(e) => setShowPrivate(e.target.checked)}
              className="rounded border-gray-300 text-red-600 focus:ring-red-500"
            />
            <label htmlFor="show-private" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              Gizli belgeleri göster
            </label>
          </div>
        </div>

        {/* Bulk Actions */}
        {selectedItems.length > 0 && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600 dark:text-gray-400">
                {selectedItems.length} belge seçildi
              </span>
              <div className="flex items-center space-x-2">
                <button className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/20 text-blue-700 dark:text-blue-400 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/30 transition-colors">
                  İndir
                </button>
                <button className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">
                  Arşivle
                </button>
                <button 
                  onClick={handleBulkDelete}
                  className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/30 transition-colors"
                >
                  Sil
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Documents Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="w-12 px-6 py-3 text-left">
                  <input
                    type="checkbox"
                    checked={selectedItems.length === filteredDocuments.length && filteredDocuments.length > 0}
                    onChange={handleSelectAll}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Belge
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Boyut
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Yazar
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İndirme
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Tarih
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredDocuments.map((doc) => (
                <tr key={doc._id} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  <td className="px-6 py-4">
                    <input
                      type="checkbox"
                      checked={selectedItems.includes(doc._id)}
                      onChange={() => handleSelectItem(doc._id)}
                      className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                    />
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <div className="bg-gray-100 dark:bg-gray-700 p-2 rounded-lg mr-3">
                        <File className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                      </div>
                      <div>
                        <div className="flex items-center">
                          <h3 className="font-medium text-gray-900 dark:text-white">
                            {doc.title}
                          </h3>
                          {doc.isPrivate && (
                            <Lock className="h-4 w-4 text-orange-500 ml-2" />
                          )}
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400 line-clamp-1">
                          {doc.description}
                        </p>
                        <div className="flex items-center mt-1">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded ${fileTypeColors[doc.type as keyof typeof fileTypeColors]}`}>
                            {doc.type.toUpperCase()}
                          </span>
                          <div className="flex flex-wrap gap-1 ml-2">
                            {doc.tags.slice(0, 2).map((tag: string) => (
                              <span key={tag} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                                #{tag}
                              </span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {doc.category}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm text-gray-900 dark:text-gray-100">
                      {doc.size}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{doc.author}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${statusColors[doc.status as keyof typeof statusColors]}`}>
                      {statusLabels[doc.status as keyof typeof statusLabels]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Download className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{doc.downloads}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">
                        {new Date(doc.uploadDate).toLocaleDateString('tr-TR')}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        className="p-2 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        title="İndir"
                      >
                        <Download className="h-4 w-4" />
                      </button>
                      <Link
                        href={`/admin/bilgi-belge/${doc._id}`}
                        className="p-2 text-gray-400 hover:text-green-600 dark:hover:text-green-400 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                        title="Görüntüle"
                      >
                        <Eye className="h-4 w-4" />
                      </Link>
                      <Link
                        href={`/admin/bilgi-belge/${doc._id}/duzenle`}
                        className="p-2 text-gray-400 hover:text-yellow-600 dark:hover:text-yellow-400 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors"
                        title="Düzenle"
                      >
                        <Edit className="h-4 w-4" />
                      </Link>
                      <button
                        onClick={() => handleDeleteDocument(doc._id)}
                        className="p-2 text-gray-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        title="Sil"
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
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="text-sm text-gray-500 dark:text-gray-400">
              Toplam {filteredDocuments.length} belge
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
      </div>
    </div>
  )
}
