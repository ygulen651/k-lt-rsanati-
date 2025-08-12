'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Upload, FileText, Save, X } from 'lucide-react'

export default function YeniBelgePage() {
  const router = useRouter()
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    tags: '',
    isPrivate: false,
    file: null as File | null
  })
  const [filePreview, setFilePreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)

  const categories = [
    'Resmi Belgeler',
    'Şablonlar', 
    'Formlar',
    'Yönetmelikler',
    'Toplantı Tutanakları',
    'Mali Raporlar',
    'Eğitim Materyalleri',
    'Basın Açıklamaları',
    'Diğer'
  ]

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement
      setFormData(prev => ({
        ...prev,
        [name]: checked
      }))
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }))
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      // Dosya boyutu kontrolü (10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('Dosya boyutu 10MB\'dan küçük olmalıdır')
        return
      }

      // Dosya türü kontrolü
      const allowedTypes = [
        'application/pdf',
        'application/msword',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        'application/vnd.ms-powerpoint',
        'application/vnd.openxmlformats-officedocument.presentationml.presentation',
        'text/plain',
        'image/jpeg',
        'image/png',
        'image/gif'
      ]

      if (!allowedTypes.includes(file.type)) {
        alert('Desteklenen dosya türleri: PDF, Word, Excel, PowerPoint, Metin, Resim')
        return
      }

      setFormData(prev => ({
        ...prev,
        file: file
      }))
      setFilePreview(file.name)

      // Başlık otomatik doldur
      if (!formData.title) {
        const fileName = file.name.split('.')[0]
        setFormData(prev => ({
          ...prev,
          title: fileName
        }))
      }
    }
  }

  const removeFile = () => {
    setFormData(prev => ({
      ...prev,
      file: null
    }))
    setFilePreview('')
  }

  const getFileIcon = (fileName: string) => {
    const extension = fileName.split('.').pop()?.toLowerCase()
    switch (extension) {
      case 'pdf':
        return '📄'
      case 'doc':
      case 'docx':
        return '📝'
      case 'xls':
      case 'xlsx':
        return '📊'
      case 'ppt':
      case 'pptx':
        return '📊'
      case 'txt':
        return '📄'
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return '🖼️'
      default:
        return '📁'
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasyon
    if (!formData.title.trim()) {
      alert('Başlık zorunludur')
      return
    }
    if (!formData.category) {
      alert('Kategori seçimi zorunludur')
      return
    }
    if (!formData.file) {
      alert('Dosya seçimi zorunludur')
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
        router.push('/admin/login')
        return
      }

      // FormData oluştur (dosya yükleme için)
      const uploadData = new FormData()
      uploadData.append('title', formData.title)
      uploadData.append('category', formData.category)
      uploadData.append('description', formData.description)
      uploadData.append('tags', formData.tags)
      uploadData.append('isPrivate', formData.isPrivate.toString())
      uploadData.append('file', formData.file)

      console.log('Belge yükleniyor:', {
        title: formData.title,
        category: formData.category,
        fileName: formData.file.name,
        fileSize: formData.file.size
      })

      const response = await fetch('/api/documents', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`
        },
        body: uploadData
      })

      const result = await response.json()

      if (response.ok && result.success) {
        alert('Belge başarıyla yüklendi!')
        router.push('/admin/bilgi-belge')
      } else {
        alert(result.message || 'Belge yüklenemedi')
      }
      
    } catch (error) {
      console.error('Submit error:', error)
      alert('Bir hata oluştu: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/bilgi-belge')}
            className="inline-flex items-center text-red-600 hover:text-red-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Yeni Belge Yükle
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            Bilgi belge arşivine yeni dosya ekleyin
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Dosya Yükleme */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Dosya Seçimi
            </h3>
            
            <div className="space-y-4">
              {filePreview ? (
                <div className="border-2 border-dashed border-green-300 dark:border-green-600 rounded-lg p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{getFileIcon(filePreview)}</span>
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{filePreview}</p>
                        <p className="text-sm text-gray-500">
                          {formData.file && formatFileSize(formData.file.size)}
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={removeFile}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ) : (
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
                  <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <p className="text-gray-600 dark:text-gray-400 mb-2">
                    Dosyanızı buraya sürükleyin veya seçin
                  </p>
                  <input
                    type="file"
                    id="file"
                    onChange={handleFileChange}
                    className="hidden"
                    accept=".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt,.jpg,.jpeg,.png,.gif"
                  />
                  <label
                    htmlFor="file"
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 cursor-pointer"
                  >
                    Dosya Seç
                  </label>
                  <p className="text-xs text-gray-500 mt-2">
                    PDF, Word, Excel, PowerPoint, Metin, Resim (Max: 10MB)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Belge Bilgileri */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Belge Bilgileri
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Belge başlığı"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Kategori *
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Kategori Seçin</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Etiketler
                </label>
                <input
                  type="text"
                  name="tags"
                  value={formData.tags}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="etiket1, etiket2, etiket3"
                />
                <p className="text-xs text-gray-500 mt-1">Virgülle ayırın</p>
              </div>

              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Açıklama
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
                  placeholder="Belge hakkında kısa açıklama..."
                />
              </div>

              <div className="md:col-span-2">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    name="isPrivate"
                    checked={formData.isPrivate}
                    onChange={handleInputChange}
                    className="rounded border-gray-300 text-red-600 shadow-sm focus:border-red-300 focus:ring focus:ring-red-200 focus:ring-opacity-50"
                  />
                  <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Özel belge (Sadece yöneticiler görebilir)
                  </span>
                </label>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/bilgi-belge')}
              className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            >
              İptal
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-colors"
            >
              {isLoading ? (
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
              ) : (
                <Save className="h-4 w-4" />
              )}
              {isLoading ? 'Yükleniyor...' : 'Belgeyi Yükle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
