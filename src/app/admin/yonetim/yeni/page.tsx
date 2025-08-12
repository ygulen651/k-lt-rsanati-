'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Save, 
  User, 
  Mail, 
  Phone, 
  Briefcase,
  GraduationCap,
  FileText,
  Upload,
  X
} from 'lucide-react'

export default function YeniYonetimUyesiPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    position: '',
    bio: '',
    photo: '',
    email: '',
    phone: '',
    experience: '',
    education: ''
  })
  const [photoPreview, setPhotoPreview] = useState('')

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onloadend = () => {
        const result = reader.result as string
        setPhotoPreview(result)
        setFormData(prev => ({
          ...prev,
          photo: result
        }))
      }
      reader.readAsDataURL(file)
    }
  }

  const removePhoto = () => {
    setPhotoPreview('')
    setFormData(prev => ({
      ...prev,
      photo: ''
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasyon
    if (!formData.name.trim() || !formData.position.trim() || !formData.email.trim()) {
      alert('Zorunlu alanları doldurun!')
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

      console.log('Yönetim kurulu üyesi verisi:', formData)

      const response = await fetch('/api/boards/yonetim-kurulu', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (response.ok && result.success) {
        alert('Yönetim kurulu üyesi başarıyla oluşturuldu!')
        router.push('/admin/yonetim')
      } else {
        alert(result.message || 'Üye oluşturulamadı')
      }
      
    } catch (error) {
      console.error('Submit error:', error)
      alert('Bir hata oluştu: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const positions = [
    'Genel Başkan',
    'Genel Başkan Yardımcısı',
    'Genel Basın Sekreteri',
    'Genel Sekreter',
    'Mali Sekreter',
    'Sosyal Sekreter',
    'Eğitim Sekreteri',
    'Örgütlenme Sekreteri',
    'Basın Sözcüsü',
    'Yönetim Kurulu Üyesi'
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/yonetim"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yeni Yönetim Kurulu Üyesi</h1>
          <p className="text-gray-600 dark:text-gray-400">Yeni yönetim kurulu üyesi ekleyin</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Temel Bilgiler */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="h-5 w-5" />
            Temel Bilgiler
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Ad Soyad *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Ahmet Yılmaz"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Görev/Pozisyon *
              </label>
              <select
                name="position"
                value={formData.position}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              >
                <option value="">Pozisyon seçin</option>
                {positions.map(position => (
                  <option key={position} value={position}>{position}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                E-posta *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="ahmet@example.com"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Telefon
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="+90 212 123 45 67"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Deneyim
              </label>
              <input
                type="text"
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="15 yıl"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Eğitim
              </label>
              <input
                type="text"
                name="education"
                value={formData.education}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="İstanbul Üniversitesi İktisat Fakültesi"
              />
            </div>
          </div>
        </div>

        {/* Fotoğraf */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Upload className="h-5 w-5" />
            Profil Fotoğrafı <span className="text-sm font-normal text-gray-500">(Opsiyonel)</span>
          </h3>
          
          <div className="space-y-4">
            {photoPreview ? (
              <div className="relative inline-block">
                <Image
                  src={photoPreview}
                  alt="Profil fotoğrafı önizleme"
                  width={120}
                  height={120}
                  className="rounded-full object-cover border-4 border-gray-200 dark:border-gray-600"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-1 transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            ) : (
              <div className="w-32 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-full flex items-center justify-center">
                <Upload className="h-8 w-8 text-gray-400" />
              </div>
            )}
            
            <div>
              <input
                type="file"
                id="photo"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
              <label
                htmlFor="photo"
                className="inline-flex items-center px-4 py-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-lg cursor-pointer transition-colors"
              >
                <Upload className="h-4 w-4 mr-2" />
                Fotoğraf Seç
              </label>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                JPG, PNG veya GIF (Max: 5MB) - Fotoğraf eklenmezse varsayılan avatar gösterilecek
              </p>
            </div>
          </div>
        </div>

        {/* Biyografi */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Biyografi
          </h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kısa Biyografi
            </label>
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={6}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              placeholder="Kişinin deneyimi, uzmanlık alanları ve sendikadaki rolü hakkında kısa bilgi..."
            />
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Kişi hakkında genel bilgiler, deneyimi ve sendikadaki rolü
            </p>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <Link
            href="/admin/yonetim"
            className="px-6 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100 transition-colors"
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
                Üyeyi Kaydet
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
