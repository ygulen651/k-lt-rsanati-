'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  CreditCard, 
  FileText, 
  Loader2,
  CheckCircle,
  XCircle,
  Clock
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { cn } from '@/lib/utils'

interface MemberDetail {
  _id: string
  memberNumber: string
  firstName: string
  lastName: string
  email: string
  phone: string
  tcNumber: string
  birthDate?: string
  profileImage?: string
  address: {
    street?: string
    city?: string
    district?: string
    zipCode?: string
  }
  workInfo: {
    workplace: string
    position: string
    department?: string
    startDate?: string
    salary?: number
  }
  membershipInfo: {
    membershipType: 'active' | 'passive' | 'retired' | 'suspended'
    joinDate: string
    dues: {
      amount: number
      status: 'paid' | 'unpaid' | 'overdue'
      lastPayment?: string
    }
  }
  emergencyContact?: {
    name: string
    phone: string
    relationship: string
  }
  status: 'active' | 'inactive' | 'pending'
  notes?: string
  createdAt: string
  updatedAt: string
}

export default function UyeDetayPage() {
  const router = useRouter()
  const params = useParams()
  const [member, setMember] = useState<MemberDetail | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (params.id) {
      loadMember(params.id as string)
    }
  }, [params.id])

  const loadMember = async (id: string) => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      console.log('Loading member:', id)
      const response = await fetch(`/api/members/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('API Result:', result)

        if (result.success) {
          console.log('Member loaded:', result.data)
          setMember(result.data)
        } else {
          console.error('API Error:', result.message)
          setError('Üye yüklenemedi: ' + result.message)
        }
      } else {
        const errorText = await response.text()
        console.error('HTTP Error:', response.status, errorText)
        setError(`Üye yüklenemedi (${response.status})`)
      }
    } catch (error) {
      console.error('Load error:', error)
      setError('Bir hata oluştu: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const deleteMember = async () => {
    if (!member || !confirm('Bu üyeyi silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.')) {
      return
    }

    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/members/${member._id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      if (response.ok) {
        alert('Üye başarıyla silindi')
        router.push('/admin/uyeler')
      } else {
        const result = await response.json()
        alert(result.message || 'Üye silinemedi')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'inactive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'active': return 'Aktif'
      case 'inactive': return 'Pasif'
      case 'pending': return 'Beklemede'
      default: return 'Bilinmeyen'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return CheckCircle
      case 'inactive': return XCircle
      case 'pending': return Clock
      default: return XCircle
    }
  }

  const getMembershipTypeColor = (type: string) => {
    switch (type) {
      case 'active': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      case 'passive': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
      case 'retired': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400'
      case 'suspended': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getMembershipTypeLabel = (type: string) => {
    switch (type) {
      case 'active': return 'Aktif Üye'
      case 'passive': return 'Pasif Üye'
      case 'retired': return 'Emekli Üye'
      case 'suspended': return 'Askıya Alınmış'
      default: return 'Bilinmeyen'
    }
  }

  const getDuesStatusColor = (status: string) => {
    switch (status) {
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'unpaid': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getDuesStatusLabel = (status: string) => {
    switch (status) {
      case 'paid': return 'Ödendi'
      case 'unpaid': return 'Ödenmedi'
      case 'overdue': return 'Gecikmiş'
      default: return 'Bilinmeyen'
    }
  }

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Üye bilgileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/uyeler"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Üye Detayı</h1>
        </div>
        
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
          {error}
        </div>
      </div>
    )
  }

  if (!member) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/uyeler"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Link>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Üye Detayı</h1>
        </div>
        
        <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
          <User className="mx-auto h-12 w-12 text-gray-400" />
          <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Üye bulunamadı</h3>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            Aranan üye kaydı bulunamadı.
          </p>
        </div>
      </div>
    )
  }

  const StatusIcon = getStatusIcon(member.status)

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/uyeler"
            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Geri
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              {member.firstName} {member.lastName}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">#{member.memberNumber}</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href={`/admin/uyeler/${member._id}/duzenle`}
            className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Düzenle
          </Link>
          <button
            onClick={deleteMember}
            className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Sil
          </button>
        </div>
      </div>

      {/* Ana Bilgiler */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex items-start gap-6">
          {/* Avatar */}
          <div className="flex-shrink-0">
            {member.profileImage ? (
              <Image
                src={member.profileImage}
                alt={`${member.firstName} ${member.lastName}`}
                width={120}
                height={120}
                className="rounded-xl object-cover"
              />
            ) : (
              <div className="w-30 h-30 bg-red-100 dark:bg-red-900/20 rounded-xl flex items-center justify-center">
                <span className="text-red-600 dark:text-red-400 font-medium text-3xl">
                  {getInitials(member.firstName, member.lastName)}
                </span>
              </div>
            )}
          </div>

          {/* Temel Bilgiler */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <Badge className={cn("text-sm", getStatusColor(member.status))}>
                <StatusIcon className="h-4 w-4 mr-1" />
                {getStatusLabel(member.status)}
              </Badge>
              
              <Badge className={cn("text-sm", getMembershipTypeColor(member.membershipInfo.membershipType))}>
                {getMembershipTypeLabel(member.membershipInfo.membershipType)}
              </Badge>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Mail className="h-5 w-5" />
                <span>{member.email}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Phone className="h-5 w-5" />
                <span>{member.phone}</span>
              </div>
              
              <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                <Briefcase className="h-5 w-5" />
                <span>{member.workInfo.workplace}</span>
              </div>
              
              {member.address.city && (
                <div className="flex items-center gap-3 text-gray-600 dark:text-gray-400">
                  <MapPin className="h-5 w-5" />
                  <span>
                    {member.address.district && `${member.address.district}, `}{member.address.city}
                  </span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kişisel Bilgiler */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <User className="h-5 w-5" />
            Kişisel Bilgiler
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">TC Kimlik No</label>
              <p className="text-gray-900 dark:text-white">{member.tcNumber}</p>
            </div>
            
            {member.birthDate && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Doğum Tarihi</label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(member.birthDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )}
            
            {member.address.street && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Adres</label>
                <p className="text-gray-900 dark:text-white">
                  {member.address.street}
                  {member.address.district && `, ${member.address.district}`}
                  {member.address.city && `, ${member.address.city}`}
                  {member.address.zipCode && ` ${member.address.zipCode}`}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* İş Bilgileri */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            İş Bilgileri
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">İşyeri</label>
              <p className="text-gray-900 dark:text-white">{member.workInfo.workplace}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Pozisyon</label>
              <p className="text-gray-900 dark:text-white">{member.workInfo.position}</p>
            </div>
            
            {member.workInfo.department && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Departman</label>
                <p className="text-gray-900 dark:text-white">{member.workInfo.department}</p>
              </div>
            )}
            
            {member.workInfo.startDate && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">İşe Başlama Tarihi</label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(member.workInfo.startDate).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Üyelik Bilgileri */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Üyelik Bilgileri
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Üye Olma Tarihi</label>
              <p className="text-gray-900 dark:text-white">
                {new Date(member.membershipInfo.joinDate).toLocaleDateString('tr-TR')}
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Üyelik Türü</label>
              <Badge className={cn("text-sm", getMembershipTypeColor(member.membershipInfo.membershipType))}>
                {getMembershipTypeLabel(member.membershipInfo.membershipType)}
              </Badge>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Kayıt Tarihi</label>
              <p className="text-gray-900 dark:text-white">
                {new Date(member.createdAt).toLocaleDateString('tr-TR')}
              </p>
            </div>
          </div>
        </div>

        {/* Aidat Bilgileri */}
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Aidat Bilgileri
          </h3>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Aylık Aidat</label>
              <p className="text-gray-900 dark:text-white">
                {member.membershipInfo.dues.amount} TL
              </p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Aidat Durumu</label>
              <Badge className={cn("text-sm", getDuesStatusColor(member.membershipInfo.dues.status))}>
                {getDuesStatusLabel(member.membershipInfo.dues.status)}
              </Badge>
            </div>
            
            {member.membershipInfo.dues.lastPayment && (
              <div>
                <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Son Ödeme</label>
                <p className="text-gray-900 dark:text-white">
                  {new Date(member.membershipInfo.dues.lastPayment).toLocaleDateString('tr-TR')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Acil Durum İletişim */}
      {member.emergencyContact && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <Phone className="h-5 w-5" />
            Acil Durum İletişim
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Ad Soyad</label>
              <p className="text-gray-900 dark:text-white">{member.emergencyContact.name}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Telefon</label>
              <p className="text-gray-900 dark:text-white">{member.emergencyContact.phone}</p>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-500 dark:text-gray-400">Yakınlık</label>
              <p className="text-gray-900 dark:text-white">{member.emergencyContact.relationship}</p>
            </div>
          </div>
        </div>
      )}

      {/* Notlar */}
      {member.notes && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6 flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Notlar
          </h3>
          
          <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
            {member.notes}
          </p>
        </div>
      )}
    </div>
  )
}


