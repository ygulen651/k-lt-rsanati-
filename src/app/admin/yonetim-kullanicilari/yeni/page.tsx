'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, Save, Shield, User, Crown, Edit, Eye } from 'lucide-react'

export default function YeniYonetimKullanicisiPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'viewer'
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    // Validasyon
    if (!formData.name.trim() || !formData.email.trim() || !formData.password.trim()) {
      alert('Tüm alanları doldurun!')
      return
    }

    if (formData.password !== formData.confirmPassword) {
      alert('Şifreler eşleşmiyor!')
      return
    }

    if (formData.password.length < 6) {
      alert('Şifre en az 6 karakter olmalıdır!')
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
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role
      }

      console.log('Submitting admin user data:', submitData)

      const response = await fetch('/api/admin-users', {
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
        alert('Yönetim kullanıcısı başarıyla oluşturuldu!')
        router.push('/admin/yonetim-kullanicilari')
      } else {
        alert(result.message || 'Kullanıcı oluşturulamadı')
      }
    } catch (error) {
      console.error('Submit error:', error)
      alert('Bir hata oluştu: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const getRoleInfo = (role: string) => {
    switch (role) {
      case 'admin':
        return {
          icon: Crown,
          label: 'Yönetici',
          description: 'Tüm yetkilere sahip',
          color: 'text-red-600 dark:text-red-400'
        }
      case 'editor':
        return {
          icon: Edit,
          label: 'Editör',
          description: 'İçerik oluşturabilir ve düzenleyebilir',
          color: 'text-blue-600 dark:text-blue-400'
        }
      case 'viewer':
        return {
          icon: Eye,
          label: 'Görüntüleyici',
          description: 'Sadece görüntüleme yetkisi',
          color: 'text-green-600 dark:text-green-400'
        }
      default:
        return {
          icon: User,
          label: 'Bilinmeyen',
          description: '',
          color: 'text-gray-600 dark:text-gray-400'
        }
    }
  }

  const selectedRoleInfo = getRoleInfo(formData.role)
  const SelectedRoleIcon = selectedRoleInfo.icon

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/admin/yonetim-kullanicilari"
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Geri
        </Link>
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yeni Yönetim Kullanıcısı</h1>
          <p className="text-gray-600 dark:text-gray-400">Admin panel için yeni kullanıcı oluşturun</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Kullanıcı Bilgileri */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="h-5 w-5" />
            Kullanıcı Bilgileri
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
                Şifre *
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="En az 6 karakter"
                minLength={6}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Şifre Tekrar *
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                placeholder="Şifreyi tekrar girin"
                required
              />
            </div>
          </div>
        </div>

        {/* Rol Seçimi */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Rol ve Yetkiler
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                Kullanıcı Rolü *
              </label>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {['admin', 'editor', 'viewer'].map((role) => {
                  const roleInfo = getRoleInfo(role)
                  const RoleIcon = roleInfo.icon
                  const isSelected = formData.role === role
                  
                  return (
                    <div
                      key={role}
                      className={`relative p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-red-500 bg-red-50 dark:bg-red-900/20' 
                          : 'border-gray-300 dark:border-gray-600 hover:border-red-300 dark:hover:border-red-400'
                      }`}
                      onClick={() => setFormData(prev => ({ ...prev, role }))}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`p-2 rounded-lg ${
                          isSelected ? 'bg-red-100 dark:bg-red-900/40' : 'bg-gray-100 dark:bg-gray-700'
                        }`}>
                          <RoleIcon className={`h-5 w-5 ${isSelected ? 'text-red-600 dark:text-red-400' : 'text-gray-600 dark:text-gray-400'}`} />
                        </div>
                        <div>
                          <h4 className={`font-medium ${isSelected ? 'text-red-900 dark:text-red-100' : 'text-gray-900 dark:text-white'}`}>
                            {roleInfo.label}
                          </h4>
                          <p className={`text-sm ${isSelected ? 'text-red-700 dark:text-red-300' : 'text-gray-500 dark:text-gray-400'}`}>
                            {roleInfo.description}
                          </p>
                        </div>
                      </div>
                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={isSelected}
                        onChange={handleInputChange}
                        className="absolute top-4 right-4"
                      />
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Seçilen Rol Bilgisi */}
            <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
              <div className="flex items-center gap-3">
                <SelectedRoleIcon className={`h-5 w-5 ${selectedRoleInfo.color}`} />
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    Seçilen Rol: {selectedRoleInfo.label}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedRoleInfo.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Rol Açıklamaları */}
        <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800 p-6">
          <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-4">Rol Açıklamaları</h4>
          <div className="space-y-3 text-sm">
            <div className="flex items-start gap-3">
              <Crown className="h-4 w-4 text-red-600 dark:text-red-400 mt-0.5" />
              <div>
                <strong className="text-red-900 dark:text-red-100">Yönetici:</strong>
                <span className="text-blue-800 dark:text-blue-200 ml-1">
                  Tüm işlemleri yapabilir, kullanıcı ekleyip silebilir, sistem ayarlarını değiştirebilir.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Edit className="h-4 w-4 text-blue-600 dark:text-blue-400 mt-0.5" />
              <div>
                <strong className="text-blue-900 dark:text-blue-100">Editör:</strong>
                <span className="text-blue-800 dark:text-blue-200 ml-1">
                  İçerik oluşturabilir, düzenleyebilir ve yayınlayabilir. Kullanıcı işlemleri yapamaz.
                </span>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <Eye className="h-4 w-4 text-green-600 dark:text-green-400 mt-0.5" />
              <div>
                <strong className="text-green-900 dark:text-green-100">Görüntüleyici:</strong>
                <span className="text-blue-800 dark:text-blue-200 ml-1">
                  Sadece içerikleri görüntüleyebilir. Hiçbir değişiklik yapamaz.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex items-center justify-end gap-4 pt-6">
          <Link
            href="/admin/yonetim-kullanicilari"
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
                Oluşturuluyor...
              </>
            ) : (
              <>
                <Save className="h-4 w-4" />
                Kullanıcı Oluştur
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
