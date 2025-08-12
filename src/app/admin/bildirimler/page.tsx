'use client'

import { useState } from 'react'
import { 
  Bell, Send, Users, Eye, Clock, CheckCircle, X, Plus, 
  Mail, MessageSquare, Smartphone, Filter, Search
} from 'lucide-react'

export default function NotificationsPage() {
  const [selectedTab, setSelectedTab] = useState('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [showNewNotification, setShowNewNotification] = useState(false)

  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'info',
    recipients: 'all',
    channels: ['web'],
    scheduledFor: '',
    priority: 'normal'
  })

  const notifications = [
    {
      id: 1,
      title: 'Yeni Etkinlik Duyurusu',
      message: 'Yarın saat 14:00\'te genel kurul toplantısı yapılacaktır.',
      type: 'info',
      status: 'sent',
      recipients: 1247,
      opened: 892,
      clicked: 234,
      channels: ['web', 'email', 'sms'],
      createdAt: '2024-01-08 15:30:00',
      sentAt: '2024-01-08 15:35:00',
      createdBy: 'Admin'
    },
    {
      id: 2,
      title: 'Acil Güvenlik Uyarısı',
      message: 'Sistem bakımı nedeniyle geçici erişim sorunu yaşanabilir.',
      type: 'warning',
      status: 'scheduled',
      recipients: 156,
      opened: 0,
      clicked: 0,
      channels: ['web', 'email'],
      createdAt: '2024-01-08 14:15:00',
      scheduledFor: '2024-01-08 18:00:00',
      createdBy: 'Moderatör'
    },
    {
      id: 3,
      title: 'Başarılı Yedekleme',
      message: 'Sistem yedeklemesi başarıyla tamamlandı.',
      type: 'success',
      status: 'sent',
      recipients: 23,
      opened: 23,
      clicked: 12,
      channels: ['web'],
      createdAt: '2024-01-08 12:00:00',
      sentAt: '2024-01-08 12:01:00',
      createdBy: 'Sistem'
    },
    {
      id: 4,
      title: 'Kritik Hata Bildirimi',
      message: 'Veritabanı bağlantısında sorun tespit edildi.',
      type: 'error',
      status: 'failed',
      recipients: 5,
      opened: 0,
      clicked: 0,
      channels: ['web', 'email'],
      createdAt: '2024-01-08 11:45:00',
      failedAt: '2024-01-08 11:46:00',
      createdBy: 'Sistem'
    }
  ]

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'warning':
        return <Bell className="h-4 w-4 text-yellow-500" />
      case 'error':
        return <X className="h-4 w-4 text-red-500" />
      default:
        return <Bell className="h-4 w-4 text-blue-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    const badges = {
      sent: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
      scheduled: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
      draft: 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300',
      failed: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400'
    }
    
    const labels = {
      sent: 'Gönderildi',
      scheduled: 'Zamanlandı',
      draft: 'Taslak',
      failed: 'Başarısız'
    }

    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${badges[status as keyof typeof badges]}`}>
        {labels[status as keyof typeof labels]}
      </span>
    )
  }

  const handleSendNotification = () => {
    console.log('Sending notification:', newNotification)
    alert('Bildirim gönderildi!')
    setShowNewNotification(false)
    setNewNotification({
      title: '',
      message: '',
      type: 'info',
      recipients: 'all',
      channels: ['web'],
      scheduledFor: '',
      priority: 'normal'
    })
  }

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesTab = selectedTab === 'all' || notification.status === selectedTab
    
    return matchesSearch && matchesTab
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Bildirimler</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Sistem bildirimleri ve kullanıcı mesajları</p>
        </div>
        
        <button
          onClick={() => setShowNewNotification(true)}
          className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
        >
          <Plus className="h-4 w-4 mr-2" />
          Yeni Bildirim
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
              <Send className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1,426</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Toplam Gönderim</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
              <Eye className="h-6 w-6 text-green-600 dark:text-green-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">915</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Açılma Oranı</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
              <Users className="h-6 w-6 text-purple-600 dark:text-purple-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">1,247</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Aktif Kullanıcı</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center">
            <div className="p-3 rounded-lg bg-orange-100 dark:bg-orange-900/20">
              <Clock className="h-6 w-6 text-orange-600 dark:text-orange-400" />
            </div>
            <div className="ml-4">
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white">3</h3>
              <p className="text-gray-600 dark:text-gray-400 text-sm">Zamanlanmış</p>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              {[
                { key: 'all', label: 'Tümü' },
                { key: 'sent', label: 'Gönderildi' },
                { key: 'scheduled', label: 'Zamanlandı' },
                { key: 'draft', label: 'Taslak' },
                { key: 'failed', label: 'Başarısız' }
              ].map(tab => (
                <button
                  key={tab.key}
                  onClick={() => setSelectedTab(tab.key)}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    selectedTab === tab.key
                      ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                      : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Bildirimlerde ara..."
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            />
          </div>
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Bildirim Geçmişi ({filteredNotifications.length})
          </h3>
        </div>

        <div className="divide-y divide-gray-200 dark:divide-gray-700">
          {filteredNotifications.map((notification) => (
            <div key={notification.id} className="p-6 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex items-start space-x-4 flex-1">
                  <div className="flex-shrink-0">
                    {getTypeIcon(notification.type)}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 mb-2">
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white truncate">
                        {notification.title}
                      </h4>
                      {getStatusBadge(notification.status)}
                    </div>
                    
                    <p className="text-gray-600 dark:text-gray-400 mb-3">
                      {notification.message}
                    </p>
                    
                    <div className="flex items-center space-x-6 text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-1" />
                        {notification.recipients} alıcı
                      </div>
                      
                      {notification.status === 'sent' && (
                        <>
                          <div className="flex items-center">
                            <Eye className="h-4 w-4 mr-1" />
                            {notification.opened} açılma
                          </div>
                          <div className="flex items-center">
                            <MessageSquare className="h-4 w-4 mr-1" />
                            {notification.clicked} tıklama
                          </div>
                        </>
                      )}
                      
                      <div className="flex items-center">
                        <Clock className="h-4 w-4 mr-1" />
                        {notification.sentAt || notification.scheduledFor || notification.createdAt}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 mt-3">
                      {notification.channels.map(channel => (
                        <span key={channel} className="inline-flex items-center px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded text-xs">
                          {channel === 'web' && <Bell className="h-3 w-3 mr-1" />}
                          {channel === 'email' && <Mail className="h-3 w-3 mr-1" />}
                          {channel === 'sms' && <Smartphone className="h-3 w-3 mr-1" />}
                          {channel}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="text-right text-sm text-gray-500 dark:text-gray-400">
                  <p>{notification.createdBy}</p>
                  <p className="mt-1">
                    {notification.status === 'sent' && `${((notification.opened / notification.recipients) * 100).toFixed(1)}% açılma`}
                    {notification.status === 'scheduled' && 'Beklemede'}
                    {notification.status === 'failed' && 'Hata'}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredNotifications.length === 0 && (
          <div className="text-center py-12">
            <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Bildirim bulunamadı</p>
          </div>
        )}
      </div>

      {/* New Notification Modal */}
      {showNewNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Yeni Bildirim</h3>
              <button
                onClick={() => setShowNewNotification(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Başlık *
                </label>
                <input
                  type="text"
                  value={newNotification.title}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, title: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Bildirim başlığı..."
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Mesaj *
                </label>
                <textarea
                  value={newNotification.message}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, message: e.target.value }))}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  placeholder="Bildirim mesajı..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tip
                  </label>
                  <select
                    value={newNotification.type}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, type: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="info">Bilgi</option>
                    <option value="success">Başarı</option>
                    <option value="warning">Uyarı</option>
                    <option value="error">Hata</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Öncelik
                  </label>
                  <select
                    value={newNotification.priority}
                    onChange={(e) => setNewNotification(prev => ({ ...prev, priority: e.target.value }))}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                  >
                    <option value="low">Düşük</option>
                    <option value="normal">Normal</option>
                    <option value="high">Yüksek</option>
                    <option value="urgent">Acil</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Alıcılar
                </label>
                <select
                  value={newNotification.recipients}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, recipients: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                >
                  <option value="all">Tüm Kullanıcılar</option>
                  <option value="admins">Sadece Adminler</option>
                  <option value="members">Sadece Üyeler</option>
                  <option value="active">Aktif Kullanıcılar</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Gönderim Kanalları
                </label>
                <div className="space-y-2">
                  {[
                    { value: 'web', label: 'Web Bildirimi', icon: Bell },
                    { value: 'email', label: 'E-posta', icon: Mail },
                    { value: 'sms', label: 'SMS', icon: Smartphone }
                  ].map(channel => {
                    const Icon = channel.icon
                    return (
                      <label key={channel.value} className="flex items-center">
                        <input
                          type="checkbox"
                          checked={newNotification.channels.includes(channel.value)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              setNewNotification(prev => ({
                                ...prev,
                                channels: [...prev.channels, channel.value]
                              }))
                            } else {
                              setNewNotification(prev => ({
                                ...prev,
                                channels: prev.channels.filter(c => c !== channel.value)
                              }))
                            }
                          }}
                          className="rounded border-gray-300 text-red-600 focus:ring-red-500"
                        />
                        <Icon className="h-4 w-4 ml-2 mr-1 text-gray-500" />
                        <span className="text-sm text-gray-700 dark:text-gray-300">{channel.label}</span>
                      </label>
                    )
                  })}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Zamanlama (İsteğe bağlı)
                </label>
                <input
                  type="datetime-local"
                  value={newNotification.scheduledFor}
                  onChange={(e) => setNewNotification(prev => ({ ...prev, scheduledFor: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
                />
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  Boş bırakırsanız hemen gönderilir
                </p>
              </div>
            </div>
            
            <div className="flex items-center justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => setShowNewNotification(false)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                İptal
              </button>
              <button
                onClick={handleSendNotification}
                disabled={!newNotification.title || !newNotification.message}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-400 text-white rounded-lg transition-colors"
              >
                <Send className="h-4 w-4 mr-2 inline" />
                {newNotification.scheduledFor ? 'Zamanla' : 'Gönder'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
