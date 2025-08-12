'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, Save, Upload, User, Mail, Phone, Calendar, GraduationCap, Briefcase } from 'lucide-react'

interface Member {
  id: string
  name: string
  position: string
  bio: string
  photo: string
  email: string
  phone: string
  experience: string
  education: string
}

export default function EditMemberPage() {
  const router = useRouter()
  const params = useParams()
  const [member, setMember] = useState<Member | null>(null)
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
  const [photoPreview, setPhotoPreview] = useState<string>('')
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingData, setIsLoadingData] = useState(true)

  useEffect(() => {
    if (params.id) {
      fetchMember()
    }
  }, [params.id])

  const fetchMember = async () => {
    try {
      setIsLoadingData(true)
      const response = await fetch(`/api/boards/yonetim-kurulu/${params.id}`)
      const result = await response.json()
      
      if (result.success) {
        setMember(result.data)
        setFormData(result.data)
        setPhotoPreview(result.data.photo)
      } else {
        alert('Üye bulunamadı')
        router.push('/admin/yonetim')
      }
    } catch (error) {
      console.error('Fetch error:', error)
      alert('Üye bilgileri yüklenirken hata oluştu')
    } finally {
      setIsLoadingData(false)
    }
  }

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
      // Dosya boyutu kontrolü (5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Fotoğraf boyutu 5MB\'dan küçük olmalıdır')
        return
      }

      const reader = new FileReader()
      reader.onloadend = () => {
        const base64String = reader.result as string
        setPhotoPreview(base64String)
        setFormData(prev => ({
          ...prev,
          photo: base64String
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
    if (!formData.name.trim()) {
      alert('İsim zorunludur')
      return
    }
    if (!formData.position.trim()) {
      alert('Pozisyon zorunludur')
      return
    }
    if (!formData.email.trim()) {
      alert('E-posta zorunludur')
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

      const response = await fetch(`/api/boards/yonetim-kurulu/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })

      const result = await response.json()
      console.log('API Response:', result)

      if (response.ok && result.success) {
        alert('Üye başarıyla güncellendi!')
        router.push('/admin/yonetim')
      } else {
        alert(result.message || 'Üye güncellenemedi')
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

  if (isLoadingData) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-red-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Üye bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push('/admin/yonetim')}
            className="inline-flex items-center text-red-600 hover:text-red-700 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Geri Dön
          </button>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
            Yönetim Kurulu Üyesi Düzenle
          </h1>
          <p className="mt-2 text-gray-600 dark:text-gray-400">
            {member?.name} üyesinin bilgilerini güncelleyin
          </p>
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Örn: Ahmet Yılmaz"
                  required
                />
              </div>

              <div>
                <label className="block text.sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Pozisyon *
                </label>
                <select
                  name="position"
                  value={formData.position}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  required
                >
                  <option value="">Pozisyon Seçin</option>
                  {positions.map((pos) => (
                    <option key={pos} value={pos}>{pos}</option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* İletişim Bilgileri */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
              <Mail className="h-5 w-5" />
              İletişim Bilgileri
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  E-posta *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="ornek@email.com"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="0532 123 45 67"
                />
              </div>
            </div>
          </div>

          {/* Deneyim ve Eğitim */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text.white mb-6 flex items-center gap-2">
              <Briefcase className="h-5 w-5" />
              Deneyim ve Eğitim
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Deneyim
                </label>
                <input
                  type="text"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Örn: 5 yıl"
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
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Örn: İstanbul Üniversitesi İktisat"
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
                    alt="Fotoğraf önizleme"
                    width={120}
                    height={120}
                    className="rounded-lg object-cover"
                  />
                  <button
                    type="button"
                    onClick={removePhoto}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                  <User className="h-12 w-12 text-gray-400" />
                </div>
              )}
              
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

          {/* Biyografi */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
              Biyografi
            </h3>
            
            <textarea
              name="bio"
              value={formData.bio}
              onChange={handleInputChange}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              placeholder="Üye hakkında kısa bilgi..."
            />
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => router.push('/admin/yonetim')}
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
              {isLoading ? 'Güncelleniyor...' : 'Güncelle'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
