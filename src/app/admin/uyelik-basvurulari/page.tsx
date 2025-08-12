'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Search, Filter, Eye, Check, X, Clock, AlertCircle, Loader2, FileText } from 'lucide-react'

interface MembershipApplication {
  _id: string
  firstName: string
  lastName: string
  email: string
  phone: string
  workInfo: {
    workplace: string
    position: string
  }
  status: 'pending' | 'approved' | 'rejected' | 'under_review'
  applicationReason?: string
  reviewedBy?: string
  reviewedAt?: string
  reviewNotes?: string
  createdAt: string
}

export default function UyelikBasvurulariPage() {
  const router = useRouter()
  const [applications, setApplications] = useState<MembershipApplication[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedApplication, setSelectedApplication] = useState<MembershipApplication | null>(null)
  const [reviewNotes, setReviewNotes] = useState('')
  const [isProcessing, setIsProcessing] = useState(false)

  useEffect(() => {
    loadApplications()
  }, [])

  const loadApplications = async () => {
    try {
      const token = localStorage.getItem('auth-token')
      if (!token) {
        router.push('/admin/login')
        return
      }

      console.log('Loading membership applications...')
      const params = new URLSearchParams()
      if (selectedStatus !== 'all') params.append('status', selectedStatus)
      if (searchTerm) params.append('search', searchTerm)

      const response = await fetch(`/api/membership-applications?${params.toString()}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      console.log('Response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('API Result:', result)

        if (result.success) {
          console.log('Applications loaded:', result.data.length)
          setApplications(result.data)
        } else {
          console.error('API Error:', result.message)
          setError('Başvurular yüklenemedi: ' + result.message)
        }
      } else {
        const errorText = await response.text()
        console.error('HTTP Error:', response.status, errorText)
        setError(`Başvurular yüklenemedi (${response.status})`)
      }
    } catch (error) {
      console.error('Load error:', error)
      setError('Bir hata oluştu: ' + error)
    } finally {
      setIsLoading(false)
    }
  }

  const updateApplicationStatus = async (id: string, status: string, notes: string = '') => {
    setIsProcessing(true)
    try {
      const token = localStorage.getItem('auth-token')
      const response = await fetch(`/api/membership-applications/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          status,
          reviewNotes: notes
        })
      })

      if (response.ok) {
        const result = await response.json()
        
        // Listeyi güncelle
        setApplications(prev => prev.map(app => 
          app._id === id ? { ...app, status, reviewNotes: notes, reviewedAt: new Date().toISOString() } : app
        ))

        // Modal'ı kapat
        setSelectedApplication(null)
        setReviewNotes('')

        alert(result.message || 'Başvuru durumu güncellendi')
      } else {
        const result = await response.json()
        alert(result.message || 'Başvuru güncellenemedi')
      }
    } catch (error) {
      alert('Bir hata oluştu')
    } finally {
      setIsProcessing(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
      case 'approved': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
      case 'rejected': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
      case 'under_review': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'pending': return 'Beklemede'
      case 'approved': return 'Onaylandı'
      case 'rejected': return 'Reddedildi'
      case 'under_review': return 'İncelemede'
      default: return 'Bilinmeyen'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return Clock
      case 'approved': return Check
      case 'rejected': return X
      case 'under_review': return Eye
      default: return AlertCircle
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-500">Başvurular yükleniyor...</p>
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
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Üyelik Başvuruları</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Üyelik başvurularını inceleyin ve onaylayın ({applications.length} başvuru)
          </p>
        </div>
        <button
          onClick={loadApplications}
          className="inline-flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition-colors"
        >
          🔄 Yenile
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-yellow-100 dark:bg-yellow-900/20 rounded-lg">
              <Clock className="h-6 w-6 text-yellow-600 dark:text-yellow-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Beklemede</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.filter(a => a.status === 'pending').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-blue-100 dark:bg-blue-900/20 rounded-lg">
              <Eye className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">İncelemede</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.filter(a => a.status === 'under_review').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-green-100 dark:bg-green-900/20 rounded-lg">
              <Check className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Onaylandı</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.filter(a => a.status === 'approved').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-2 bg-red-100 dark:bg-red-900/20 rounded-lg">
              <X className="h-6 w-6 text-red-600 dark:text-red-400" />
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600 dark:text-gray-400">Reddedildi</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {applications.filter(a => a.status === 'rejected').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Başvuru ara..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
              />
            </div>
          </div>

          {/* Status Filter */}
          <div className="sm:w-48">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent"
            >
              <option value="all">Tüm Durumlar</option>
              <option value="pending">Beklemede</option>
              <option value="under_review">İncelemede</option>
              <option value="approved">Onaylandı</option>
              <option value="rejected">Reddedildi</option>
            </select>
          </div>

          <button
            onClick={loadApplications}
            className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white font-medium rounded-lg transition-colors"
          >
            <Filter className="h-4 w-4 mr-2 inline" />
            Filtrele
          </button>
        </div>
      </div>

      {/* Applications Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700 border-b border-gray-200 dark:border-gray-600">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Başvuran
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İletişim
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İş Bilgileri
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Durum
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Başvuru Tarihi
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  İşlemler
                </th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {applications.map((application) => {
                const StatusIcon = getStatusIcon(application.status)
                return (
                  <tr key={application._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center">
                          <span className="text-blue-600 dark:text-blue-400 font-medium text-sm">
                            {application.firstName.charAt(0)}{application.lastName.charAt(0)}
                          </span>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900 dark:text-white">
                            {application.firstName} {application.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{application.email}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{application.phone}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">{application.workInfo.workplace}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{application.workInfo.position}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(application.status)}`}>
                        <StatusIcon className="h-3 w-3 mr-1" />
                        {getStatusLabel(application.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {new Date(application.createdAt).toLocaleDateString('tr-TR')}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right text-sm font-medium">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setSelectedApplication(application)}
                          className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded-lg transition-colors"
                        >
                          <FileText className="h-4 w-4" />
                        </button>
                        {application.status === 'pending' && (
                          <>
                            <button
                              onClick={() => updateApplicationStatus(application._id, 'approved')}
                              className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 dark:hover:bg-green-900/20 rounded-lg transition-colors"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => updateApplicationStatus(application._id, 'rejected')}
                              className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        {applications.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">Başvuru bulunamadı</h3>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              Henüz üyelik başvurusu bulunmamaktadır.
            </p>
          </div>
        )}
      </div>

      {/* Application Detail Modal */}
      {selectedApplication && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-start mb-6">
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  Başvuru Detayları
                </h3>
                <button
                  onClick={() => setSelectedApplication(null)}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="space-y-6">
                {/* Kişisel Bilgiler */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Kişisel Bilgiler</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Ad Soyad:</span>
                      <p className="font-medium text-gray-900 dark:text-white">
                        {selectedApplication.firstName} {selectedApplication.lastName}
                      </p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">E-posta:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.email}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Telefon:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.phone}</p>
                    </div>
                  </div>
                </div>

                {/* İş Bilgileri */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">İş Bilgileri</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">İşyeri:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.workInfo.workplace}</p>
                    </div>
                    <div>
                      <span className="text-gray-500 dark:text-gray-400">Pozisyon:</span>
                      <p className="font-medium text-gray-900 dark:text-white">{selectedApplication.workInfo.position}</p>
                    </div>
                  </div>
                </div>

                {/* Başvuru Sebebi */}
                {selectedApplication.applicationReason && (
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white mb-3">Başvuru Sebebi</h4>
                    <p className="text-sm text-gray-700 dark:text-gray-300 bg-gray-50 dark:bg-gray-700 p-3 rounded-lg">
                      {selectedApplication.applicationReason}
                    </p>
                  </div>
                )}

                {/* İnceleme Notları */}
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">İnceleme Notları</h4>
                  <textarea
                    value={reviewNotes}
                    onChange={(e) => setReviewNotes(e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                    placeholder="İnceleme notlarınızı yazın..."
                  />
                </div>

                {/* İşlem Butonları */}
                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button
                    onClick={() => setSelectedApplication(null)}
                    className="px-4 py-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
                  >
                    İptal
                  </button>
                  
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'under_review', reviewNotes)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
                  >
                    İncelemeye Al
                  </button>
                  
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'rejected', reviewNotes)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Reddet
                  </button>
                  
                  <button
                    onClick={() => updateApplicationStatus(selectedApplication._id, 'approved', reviewNotes)}
                    disabled={isProcessing}
                    className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg disabled:opacity-50"
                  >
                    Onayla
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}


