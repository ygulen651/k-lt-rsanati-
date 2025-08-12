'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Plus, Edit, Trash2, Eye, EyeOff, ArrowUp, ArrowDown, Loader2 } from 'lucide-react'

interface Slider {
  _id: string
  title: string
  subtitle?: string
  description?: string
  image: string
  buttonText?: string
  buttonLink?: string
  order: number
  isActive: boolean
  backgroundColor?: string
  textColor?: string
  createdBy: string
  createdAt: string
  updatedAt: string
}

export default function SliderYonetimiPage() {
  const router = useRouter()
  const [sliders, setSliders] = useState<Slider[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadSliders()
  }, [])

  const loadSliders = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      console.log('Loading sliders...')
      const response = await fetch('/api/sliders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('API Result:', result)

        if (result.success) {
          console.log('Sliders loaded:', result.data.length)
          setSliders(result.data)
        } else {
          console.error('API Error:', result.message)
          setError('Slider\'lar yüklenemedi: ' + result.message)
        }
      } else {
        const errorText = await response.text()
        console.error('HTTP Error:', response.status, errorText)
        setError(`Slider'lar yüklenemedi (${response.status})`)
      }
    } catch (error) {
      console.error('Load error:', error)
      setError('Bir hata oluştu: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const toggleSliderStatus = async (id: string, currentStatus: boolean) => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/sliders/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ isActive: !currentStatus })
      })

      if (response.ok) {
        setSliders(prev => prev.map(slider => 
          slider._id === id ? { ...slider, isActive: !currentStatus } : slider
        ))
      } else {
        alert('Durum değiştirilemedi')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  const deleteSlider = async (id: string) => {
    if (!confirm('Bu slider\'ı silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/sliders/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        setSliders(prev => prev.filter(s => s._id !== id))
      } else {
        alert('Slider silinemedi')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  const updateOrder = async (id: string, newOrder: number) => {
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/sliders/${id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ order: newOrder })
      })

      if (response.ok) {
        loadSliders() // Yeniden yükle
      }
    } catch (error) {
      console.error('Order update error:', error)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Slider'lar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      )}

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Slider Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Ana sayfa slider'larını yönetin ({sliders.length} slider)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadSliders}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            🔄 Yenile
          </button>
          <Link 
            href="/admin/slider/yeni"
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Slider
          </Link>
        </div>
      </div>

      {/* Sliders Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sliders.map((slider) => (
          <div key={slider._id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
            {/* Slider Image */}
            <div className="relative aspect-video">
              <Image
                src={slider.image}
                alt={slider.title}
                fill
                className="object-cover"
              />
              <div className="absolute top-3 left-3 flex gap-2">
                <span className="px-2 py-1 text-xs font-medium bg-gray-900/70 text-white rounded">
                  #{slider.order}
                </span>
                <span className={`px-2 py-1 text-xs font-medium rounded ${
                  slider.isActive 
                    ? 'bg-green-500/90 text-white' 
                    : 'bg-red-500/90 text-white'
                }`}>
                  {slider.isActive ? 'Aktif' : 'Pasif'}
                </span>
              </div>
            </div>

            {/* Slider Content */}
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">
                {slider.title}
              </h3>
              {slider.subtitle && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2 line-clamp-1">
                  {slider.subtitle}
                </p>
              )}
              {slider.description && (
                <p className="text-xs text-gray-500 dark:text-gray-500 mb-3 line-clamp-2">
                  {slider.description}
                </p>
              )}
              
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => updateOrder(slider._id, slider.order - 1)}
                    disabled={slider.order === 0}
                    className="p-1 text-gray-400 hover:text-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <ArrowUp className="h-4 w-4" />
                  </button>
                  <button
                    onClick={() => updateOrder(slider._id, slider.order + 1)}
                    className="p-1 text-gray-400 hover:text-blue-600"
                  >
                    <ArrowDown className="h-4 w-4" />
                  </button>
                </div>
                
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => toggleSliderStatus(slider._id, slider.isActive)}
                    className={`p-2 rounded-lg transition-colors ${
                      slider.isActive 
                        ? 'text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20' 
                        : 'text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20'
                    }`}
                  >
                    {slider.isActive ? <Eye className="h-4 w-4" /> : <EyeOff className="h-4 w-4" />}
                  </button>
                  <Link
                    href={`/admin/slider/${slider._id}/duzenle`}
                    className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                  <button
                    onClick={() => deleteSlider(slider._id)}
                    className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sliders.length === 0 && (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
            Henüz slider yok
          </h3>
          <p className="text-gray-500 dark:text-gray-400 mb-6">
            İlk slider'ınızı oluşturun ve ana sayfanızı canlandırın.
          </p>
          <Link
            href="/admin/slider/yeni"
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            İlk Slider'ı Oluştur
          </Link>
        </div>
      )}
    </div>
  )
}
