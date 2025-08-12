'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  Plus, 
  Edit, 
  Trash2, 
  Search, 
  Filter, 
  User, 
  Mail, 
  Phone, 
  Briefcase,
  GraduationCap,
  Calendar,
  Loader2
} from 'lucide-react'

interface ManagementMember {
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

export default function AdminYonetimPage() {
  const router = useRouter()
  const [members, setMembers] = useState<ManagementMember[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    loadMembers()
  }, [])

  const loadMembers = async () => {
    try {
      const response = await fetch('/api/boards/yonetim-kurulu')
      
      if (response.ok) {
        const result = await response.json()
        if (result.success) {
          setMembers(result.data)
        } else {
          setError('Yönetim kurulu verileri yüklenemedi')
        }
      } else {
        setError('API hatası')
      }
    } catch (error) {
      console.error('Load error:', error)
      setError('Bir hata oluştu')
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMember = async (id: string) => {
    if (!confirm('Bu yönetim kurulu üyesini silmek istediğinizden emin misiniz?')) {
      return
    }

    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        alert('Oturum süresi dolmuş. Lütfen tekrar giriş yapın.')
        return
      }

      const response = await fetch(`/api/boards/yonetim-kurulu/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const result = await response.json()

      if (response.ok && result.success) {
        setMembers(prev => prev.filter(m => m.id !== id))
        alert('Üye başarıyla silindi')
      } else {
        alert(result.message || 'Üye silinemedi')
      }
    } catch (error) {
      console.error('Delete error:', error)
      alert('Bir hata oluştu')
    }
  }

  const filteredMembers = members.filter(member =>
    (member.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.position || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
    (member.bio || '').toLowerCase().includes(searchTerm.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Yönetim kurulu yükleniyor...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Yönetim Kurulu</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Yönetim kurulu üyelerini yönetin ({members.length} üye)
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={loadMembers}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            🔄 Yenile
          </button>
          <Link 
            href="/admin/yonetim/yeni"
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Yeni Üye
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Toplam Üye</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{members.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Briefcase className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Aktif Görevler</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{members.length}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-purple-100 dark:bg-purple-900/20 rounded-lg">
              <GraduationCap className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Ortalama Deneyim</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {members.length > 0 ? Math.round(
                  members.reduce((acc, m) => acc + parseInt(m.experience), 0) / members.length
                ) : 0} yıl
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Üye ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>
          <button className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors">
            <Filter className="h-4 w-4 mr-2 inline" />
            Filtrele
          </button>
        </div>
      </div>

      {/* Members Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredMembers.map((member) => (
          <div key={member.id} className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-lg transition-shadow">
            {/* Header with Photo */}
            <div className="p-6 pb-4">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  {member.photo ? (
                    <Image
                      src={member.photo}
                      alt={member.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-gray-200 dark:bg-gray-700 rounded-full flex items-center justify-center">
                      <User className="h-8 w-8 text-gray-400" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {member.name}
                  </h3>
                  <p className="text-red-600 dark:text-red-400 font-medium">
                    {member.position}
                  </p>
                </div>
              </div>
            </div>

            {/* Bio */}
            <div className="px-6 pb-4">
              <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">
                {member.bio}
              </p>
            </div>

            {/* Contact Info */}
            <div className="px-6 pb-4 space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Mail className="h-4 w-4" />
                <span className="truncate">{member.email}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Phone className="h-4 w-4" />
                <span>{member.phone}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <Calendar className="h-4 w-4" />
                <span>{member.experience} deneyim</span>
              </div>
            </div>

            {/* Education */}
            <div className="px-6 pb-4">
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <GraduationCap className="h-4 w-4" />
                <span className="text-xs truncate">{member.education}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="px-6 pb-6 flex items-center justify-end gap-2">
              <Link
                href={`/admin/yonetim/uye/${member.id}`}
                className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
              >
                <Edit className="h-4 w-4" />
              </Link>
              <button
                onClick={() => deleteMember(member.id)}
                className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {filteredMembers.length === 0 && !isLoading && (
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
            {searchTerm ? 'Arama sonucu bulunamadı' : 'Yönetim kurulu üyesi bulunamadı'}
          </h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {searchTerm ? 'Farklı arama terimlerini deneyin.' : 'Yeni yönetim kurulu üyesi ekleyerek başlayın.'}
          </p>
          {!searchTerm && (
            <div className="mt-6">
              <Link
                href="/admin/yonetim/yeni"
                className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
              >
                <Plus className="h-4 w-4 mr-2" />
                İlk Üyeyi Ekle
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
