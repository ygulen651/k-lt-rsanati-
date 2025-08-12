'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowLeft, Upload, Save, Eye } from 'lucide-react'

export default function YeniSliderPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    title: '',
    subtitle: '',
    description: '',
    image: '',
    buttonText: '',
    buttonLink: '',
    order: 0,
    backgroundColor: '#000000',
    textColor: '#ffffff'
  })
  const [isActive, setIsActive] = useState(true)
  const [showPreview, setShowPreview] = useState(false)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.image.trim()) {
      alert('Başlık ve görsel gereklidir!')
      return
    }

    setIsLoading(true)

    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      const submitData = {
        ...formData,
        isActive,
        order: parseInt(formData.order.toString()) || 0
      }

      console.log('Submitting slider data:', submitData)

      const response = await fetch('/api/sliders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submitData)
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (response.ok && result.success) {
        alert('Slider başarıyla oluşturuldu!')
        router.push('/admin/slider')
      } else {
        alert(result.message || 'Slider oluşturulamadı')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Bir hata oluştu: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/slider"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yeni Slider</h1>
            <p className="text-gray-600 dark:text-gray-400">Ana sayfa için yeni slider oluşturun</p>
          </div>
        </div>
        
        <button
          onClick={() => setShowPreview(!showPreview)}
          className="flex items-center gap-2 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          <Eye className="h-4 w-4" />
          {showPreview ? 'Formu Göster' : 'Önizleme'}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Form */}
        <div className={showPreview ? 'hidden lg:block' : ''}>
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6 space-y-6">
            {/* Temel Bilgiler */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Temel Bilgiler</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Başlık *
                  </label>
                  <input
                    type="text"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Slider başlığı"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Alt Başlık
                  </label>
                  <input
                    type="text"
                    name="subtitle"
                    value={formData.subtitle}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Alt başlık (opsiyonel)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Açıklama
                  </label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Kısa açıklama (opsiyonel)"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Görsel URL *
                  </label>
                  <input
                    type="url"
                    name="image"
                    value={formData.image}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="https://example.com/image.jpg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Buton Ayarları */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Buton Ayarları</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Buton Metni
                  </label>
                  <input
                    type="text"
                    name="buttonText"
                    value={formData.buttonText}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="Daha Fazla Bilgi"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Buton Linki
                  </label>
                  <input
                    type="text"
                    name="buttonLink"
                    value={formData.buttonLink}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="/hakkimizda"
                  />
                </div>
              </div>
            </div>

            {/* Tasarım Ayarları */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tasarım Ayarları</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Arka Plan Rengi
                  </label>
                  <input
                    type="color"
                    name="backgroundColor"
                    value={formData.backgroundColor}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Metin Rengi
                  </label>
                  <input
                    type="color"
                    name="textColor"
                    value={formData.textColor}
                    onChange={handleInputChange}
                    className="w-full h-10 rounded-lg border border-gray-300 dark:border-gray-600"
                  />
                </div>
              </div>
            </div>

            {/* Diğer Ayarlar */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Diğer Ayarlar</h3>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Sıra Numarası
                  </label>
                  <input
                    type="number"
                    name="order"
                    value={formData.order}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  />
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Aktif
                  </label>
                </div>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <Link
                href="/admin/slider"
                className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
              >
                İptal
              </Link>
              <button
                type="submit"
                disabled={isLoading}
                className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-400 text-white font-medium rounded-lg transition-colors"
              >
                {isLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Kaydediliyor...
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    Kaydet
                  </>
                )}
              </button>
            </div>
          </form>
        </div>

        {/* Preview */}
        <div className={showPreview ? '' : 'hidden lg:block'}>
          <div className="sticky top-8">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Önizleme</h3>
            
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div 
                className="relative h-64 flex items-center justify-center"
                style={{ backgroundColor: formData.backgroundColor }}
              >
                {formData.image && (
                  <Image
                    src={formData.image}
                    alt={formData.title}
                    fill
                    className="object-cover opacity-70"
                  />
                )}
                
                <div className="relative z-10 text-center p-6" style={{ color: formData.textColor }}>
                  <h2 className="text-2xl font-bold mb-2">
                    {formData.title || 'Slider Başlığı'}
                  </h2>
                  {formData.subtitle && (
                    <h3 className="text-lg mb-3 opacity-90">
                      {formData.subtitle}
                    </h3>
                  )}
                  {formData.description && (
                    <p className="text-sm mb-4 opacity-80">
                      {formData.description}
                    </p>
                  )}
                  {formData.buttonText && (
                    <button className="px-4 py-2 bg-white/20 backdrop-blur-sm rounded-lg text-sm font-medium">
                      {formData.buttonText}
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
