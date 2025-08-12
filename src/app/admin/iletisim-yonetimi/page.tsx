'use client'

import { useState, useEffect } from 'react'
import { 
  Mail, 
  Phone, 
  Calendar, 
  User, 
  MessageCircle, 
  Filter,
  Search,
  Eye,
  Trash2,
  Download,
  RefreshCw
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'

interface ContactMessage {
  id: string
  name: string
  email: string
  phone?: string
  subject: string
  message: string
  category: string
  createdAt: string
  status: 'new' | 'read' | 'replied' | 'archived'
}

// Mock data - gerçek projede API'den gelecek
const mockMessages: ContactMessage[] = [
  {
    id: '1',
    name: 'Ahmet Yılmaz',
    email: 'ahmet@email.com',
    phone: '0555 123 45 67',
    subject: 'Üyelik Başvurusu',
    message: 'Sendikanıza üye olmak istiyorum. Gerekli evraklar nelerdir?',
    category: 'uyelik',
    createdAt: '2024-01-15T10:30:00Z',
    status: 'new'
  },
  {
    id: '2',
    name: 'Fatma Demir',
    email: 'fatma@email.com',
    subject: 'Hukuki Destek Talebi',
    message: 'İş yerinde yaşadığım sorunlar hakkında hukuki destek almak istiyorum.',
    category: 'hukuk',
    createdAt: '2024-01-14T14:15:00Z',
    status: 'read'
  },
  {
    id: '3',
    name: 'Mehmet Kaya',
    email: 'mehmet@email.com',
    phone: '0532 987 65 43',
    subject: 'Etkinlik Önerisi',
    message: 'Kültür etkinlikleri için önerilerim var. Görüşmek isterim.',
    category: 'etkinlik',
    createdAt: '2024-01-13T09:45:00Z',
    status: 'replied'
  }
]

const categoryLabels = {
  genel: 'Genel Bilgi',
  uyelik: 'Üyelik',
  hukuk: 'Hukuki Destek',
  etkinlik: 'Etkinlikler',
  basin: 'Basın',
  sikayet: 'Şikayet',
  oneri: 'Öneri'
}

const statusLabels = {
  new: 'Yeni',
  read: 'Okundu',
  replied: 'Yanıtlandı',
  archived: 'Arşivlendi'
}

const statusColors = {
  new: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400',
  read: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400',
  replied: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400',
  archived: 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
}

export default function IletisimYonetimiPage() {
  const [messages, setMessages] = useState<ContactMessage[]>(mockMessages)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null)

  const filteredMessages = messages.filter(message => {
    const matchesSearch = message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         message.subject.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = filterCategory === 'all' || message.category === filterCategory
    const matchesStatus = filterStatus === 'all' || message.status === filterStatus
    
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleMarkAsRead = (messageId: string) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, status: 'read' as const } : msg
    ))
  }

  const handleDelete = (messageId: string) => {
    setMessages(prev => prev.filter(msg => msg.id !== messageId))
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const newMessagesCount = messages.filter(msg => msg.status === 'new').length

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">İletişim Yönetimi</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Gelen mesajları görüntüleyin ve yönetin
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Dışa Aktar
          </Button>
          <Button>
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Toplam Mesaj</p>
                <p className="text-3xl font-bold text-gray-900 dark:text-white">{messages.length}</p>
              </div>
              <MessageCircle className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Yeni Mesajlar</p>
                <p className="text-3xl font-bold text-red-600">{newMessagesCount}</p>
              </div>
              <Mail className="h-8 w-8 text-red-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Yanıtlanan</p>
                <p className="text-3xl font-bold text-green-600">
                  {messages.filter(msg => msg.status === 'replied').length}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Bu Hafta</p>
                <p className="text-3xl font-bold text-purple-600">
                  {messages.filter(msg => 
                    new Date(msg.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                  ).length}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Mesajlarda ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">Tüm Kategoriler</option>
              {Object.entries(categoryLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-input bg-background rounded-md text-sm"
            >
              <option value="all">Tüm Durumlar</option>
              {Object.entries(statusLabels).map(([key, label]) => (
                <option key={key} value={key}>{label}</option>
              ))}
            </select>
          </div>
        </CardContent>
      </Card>

      {/* Messages List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {filteredMessages.map((message) => (
            <Card 
              key={message.id} 
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedMessage?.id === message.id ? 'ring-2 ring-blue-500' : ''
              }`}
              onClick={() => {
                setSelectedMessage(message)
                if (message.status === 'new') {
                  handleMarkAsRead(message.id)
                }
              }}
            >
              <CardContent className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-5 w-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 dark:text-white">{message.name}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400">{message.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={statusColors[message.status]}>
                      {statusLabels[message.status]}
                    </Badge>
                    <Badge variant="outline">
                      {categoryLabels[message.category as keyof typeof categoryLabels]}
                    </Badge>
                  </div>
                </div>

                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {message.subject}
                </h4>
                <p className="text-gray-600 dark:text-gray-400 text-sm line-clamp-2 mb-4">
                  {message.message}
                </p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {formatDate(message.createdAt)}
                    </span>
                    {message.phone && (
                      <span className="flex items-center gap-1">
                        <Phone className="h-3 w-3" />
                        {message.phone}
                      </span>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button size="sm" variant="ghost">
                      <Eye className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="ghost" onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(message.id)
                    }}>
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          {filteredMessages.length === 0 && (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Mesaj bulunamadı
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Arama kriterlerinize uygun mesaj bulunmamaktadır.
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Message Detail */}
        <div>
          {selectedMessage ? (
            <Card className="sticky top-6">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageCircle className="h-5 w-5" />
                  Mesaj Detayı
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white mb-2">
                    {selectedMessage.subject}
                  </h4>
                  <div className="flex gap-2 mb-4">
                    <Badge className={statusColors[selectedMessage.status]}>
                      {statusLabels[selectedMessage.status]}
                    </Badge>
                    <Badge variant="outline">
                      {categoryLabels[selectedMessage.category as keyof typeof categoryLabels]}
                    </Badge>
                  </div>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedMessage.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{selectedMessage.email}</span>
                  </div>
                  {selectedMessage.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <span className="text-sm">{selectedMessage.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-400" />
                    <span className="text-sm">{formatDate(selectedMessage.createdAt)}</span>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Mesaj</h5>
                  <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">
                      {selectedMessage.message}
                    </p>
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <Button className="w-full">
                    <Mail className="h-4 w-4 mr-2" />
                    Yanıtla
                  </Button>
                  <Button variant="outline" className="w-full">
                    Arşivle
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Mesaj Seçin
                </h3>
                <p className="text-gray-500 dark:text-gray-400">
                  Detaylarını görmek için bir mesaj seçin.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}