'use client'

import { useState } from 'react'
import { 
  Search, Filter, Download, AlertTriangle, Info, CheckCircle, 
  XCircle, Clock, User, Shield, Database, Globe, RefreshCw
} from 'lucide-react'

export default function SystemLogsPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedLevel, setSelectedLevel] = useState('all')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [dateRange, setDateRange] = useState('today')
  const [isMigrating, setIsMigrating] = useState(false)
  const [migrateResult, setMigrateResult] = useState<any | null>(null)

  const logLevels = [
    { value: 'all', label: 'Tümü', count: 1247 },
    { value: 'error', label: 'Hata', count: 23, color: 'red' },
    { value: 'warning', label: 'Uyarı', count: 156, color: 'yellow' },
    { value: 'info', label: 'Bilgi', count: 892, color: 'blue' },
    { value: 'success', label: 'Başarılı', count: 176, color: 'green' }
  ]

  const logCategories = [
    { value: 'all', label: 'Tüm Kategoriler' },
    { value: 'auth', label: 'Kimlik Doğrulama' },
    { value: 'database', label: 'Veritabanı' },
    { value: 'api', label: 'API İstekleri' },
    { value: 'security', label: 'Güvenlik' },
    { value: 'system', label: 'Sistem' },
    { value: 'user', label: 'Kullanıcı İşlemleri' }
  ]

  const systemLogs = [
    {
      id: 1,
      timestamp: '2024-01-08 17:15:23',
      level: 'error',
      category: 'database',
      message: 'Veritabanı bağlantısı başarısız: Connection timeout',
      user: 'sistem',
      ip: '192.168.1.100',
      details: 'PostgreSQL bağlantı havuzu dolu. Max connections: 100'
    },
    {
      id: 2,
      timestamp: '2024-01-08 17:14:45',
      level: 'warning',
      category: 'auth',
      message: 'Başarısız giriş denemesi',
      user: 'admin@example.com',
      ip: '203.0.113.45',
      details: 'Yanlış şifre girişi. 3. deneme.'
    },
    {
      id: 3,
      timestamp: '2024-01-08 17:13:12',
      level: 'info',
      category: 'user',
      message: 'Yeni duyuru oluşturuldu',
      user: 'editor@example.com',
      ip: '192.168.1.105',
      details: 'Duyuru ID: 456, Başlık: "Yeni Etkinlik Duyurusu"'
    },
    {
      id: 4,
      timestamp: '2024-01-08 17:12:30',
      level: 'success',
      category: 'api',
      message: 'API isteği başarıyla tamamlandı',
      user: 'sistem',
      ip: '192.168.1.1',
      details: 'GET /api/announcements - 200 OK - 145ms'
    },
    {
      id: 5,
      timestamp: '2024-01-08 17:11:55',
      level: 'warning',
      category: 'security',
      message: 'Şüpheli IP adresi tespit edildi',
      user: 'güvenlik sistemi',
      ip: '198.51.100.42',
      details: 'Kısa sürede çok fazla istek. Rate limiting aktif.'
    },
    {
      id: 6,
      timestamp: '2024-01-08 17:10:18',
      level: 'info',
      category: 'system',
      message: 'Sistem yedeklemesi tamamlandı',
      user: 'sistem',
      ip: 'localhost',
      details: 'Veritabanı ve dosya yedeklemesi başarılı. Boyut: 2.3GB'
    },
    {
      id: 7,
      timestamp: '2024-01-08 17:09:42',
      level: 'error',
      category: 'api',
      message: 'API rate limit aşıldı',
      user: 'anonymous',
      ip: '203.0.113.123',
      details: 'Dakikada 100 istek limiti aşıldı. IP geçici olarak engellendi.'
    },
    {
      id: 8,
      timestamp: '2024-01-08 17:08:15',
      level: 'success',
      category: 'auth',
      message: 'Kullanıcı başarıyla giriş yaptı',
      user: 'moderator@example.com',
      ip: '192.168.1.110',
      details: 'Session ID: abc123, Browser: Chrome 120.0'
    }
  ]

  const getLogIcon = (level: string) => {
    switch (level) {
      case 'error':
        return <XCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-yellow-500" />
      case 'info':
        return <Info className="h-4 w-4 text-blue-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Info className="h-4 w-4 text-gray-500" />
    }
  }

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'auth':
        return <Shield className="h-4 w-4" />
      case 'database':
        return <Database className="h-4 w-4" />
      case 'api':
        return <Globe className="h-4 w-4" />
      case 'security':
        return <Shield className="h-4 w-4" />
      case 'user':
        return <User className="h-4 w-4" />
      default:
        return <Info className="h-4 w-4" />
    }
  }

  const filteredLogs = systemLogs.filter(log => {
    const matchesSearch = log.message.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.user.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         log.details.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesLevel = selectedLevel === 'all' || log.level === selectedLevel
    const matchesCategory = selectedCategory === 'all' || log.category === selectedCategory
    
    return matchesSearch && matchesLevel && matchesCategory
  })

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Sistem Logları</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">Sistem aktiviteleri ve hata kayıtları</p>
        </div>
        
        <div className="flex items-center space-x-3">
          <button className="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <RefreshCw className="h-4 w-4 mr-2" />
            Yenile
          </button>
          <button className="inline-flex items-center px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors">
            <Download className="h-4 w-4 mr-2" />
            Logları İndir
          </button>
          <button
            onClick={async () => {
              try {
                setIsMigrating(true)
                setMigrateResult(null)
                const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : ''
                const res = await fetch('/api/admin/migrate', { method: 'POST', headers: { Authorization: `Bearer ${token || ''}` } })
                const json = await res.json()
                setMigrateResult(json)
              } catch {
                setMigrateResult({ success: false, message: 'İçe aktarma sırasında hata oluştu' })
              } finally {
                setIsMigrating(false)
              }
            }}
            className={`inline-flex items-center px-4 py-2 rounded-lg transition-colors ${isMigrating ? 'bg-gray-400 cursor-not-allowed text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
            disabled={isMigrating}
            title="data/*.json ve içerikleri DB'ye ekler, mevcutları atlar"
          >
            {isMigrating ? (
              <>
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" /> İçe Aktarılıyor
              </>
            ) : (
              <>
                <Download className="h-4 w-4 mr-2" /> Veriyi İçe Aktar
              </>
            )}
          </button>
        </div>
      </div>

      {migrateResult && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
          <div className="flex items-center justify-between">
            <div className="text-sm font-medium">İçe Aktarma Sonucu</div>
            <button className="text-xs text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200" onClick={() => setMigrateResult(null)}>Kapat</button>
          </div>
          {migrateResult.success ? (
            <div className="mt-3 grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              {Object.entries(migrateResult.report || {}).map(([k, v]) => (
                <div key={k} className="p-3 rounded-lg bg-gray-50 dark:bg-gray-700 flex items-center justify-between">
                  <span className="capitalize">{k}</span>
                  <span className="font-semibold">{String(v)}</span>
                </div>
              ))}
              {(!migrateResult.report || Object.keys(migrateResult.report).length === 0) && (
                <div className="col-span-full text-gray-500 dark:text-gray-400">Yeni eklenen kayıt yok.</div>
              )}
            </div>
          ) : (
            <div className="mt-3 text-red-600 dark:text-red-400 text-sm">{migrateResult.message || 'Başarısız'}</div>
          )}
        </div>
      )}

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {logLevels.map((level) => (
          <div 
            key={level.value}
            className={`bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 transition-all cursor-pointer ${
              selectedLevel === level.value 
                ? 'border-red-500 dark:border-red-400' 
                : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600'
            }`}
            onClick={() => setSelectedLevel(level.value)}
          >
            <div className="p-4">
              <div className="flex items-center justify-between">
                <div className={`p-2 rounded-lg ${
                  level.color === 'red' ? 'bg-red-100 dark:bg-red-900/20' :
                  level.color === 'yellow' ? 'bg-yellow-100 dark:bg-yellow-900/20' :
                  level.color === 'blue' ? 'bg-blue-100 dark:bg-blue-900/20' :
                  level.color === 'green' ? 'bg-green-100 dark:bg-green-900/20' :
                  'bg-gray-100 dark:bg-gray-700'
                }`}>
                  {getLogIcon(level.value)}
                </div>
                <span className="text-2xl font-bold text-gray-900 dark:text-white">{level.count}</span>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{level.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Arama
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Log mesajlarında ara..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Kategori
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              {logCategories.map(category => (
                <option key={category.value} value={category.value}>{category.label}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Tarih Aralığı
            </label>
            <select
              value={dateRange}
              onChange={(e) => setDateRange(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="today">Bugün</option>
              <option value="yesterday">Dün</option>
              <option value="week">Son 7 Gün</option>
              <option value="month">Son 30 Gün</option>
              <option value="custom">Özel Tarih</option>
            </select>
          </div>

          <div className="flex items-end">
            <button className="w-full inline-flex items-center justify-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="h-4 w-4 mr-2" />
              Filtrele
            </button>
          </div>
        </div>
      </div>

      {/* Logs Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">
            Log Kayıtları ({filteredLogs.length})
          </h3>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Seviye
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Zaman
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Mesaj
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  Kullanıcı
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  IP
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLogs.map((log) => (
                <tr key={log.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getLogIcon(log.level)}
                      <span className={`ml-2 text-sm font-medium capitalize ${
                        log.level === 'error' ? 'text-red-600 dark:text-red-400' :
                        log.level === 'warning' ? 'text-yellow-600 dark:text-yellow-400' :
                        log.level === 'info' ? 'text-blue-600 dark:text-blue-400' :
                        log.level === 'success' ? 'text-green-600 dark:text-green-400' :
                        'text-gray-600 dark:text-gray-400'
                      }`}>
                        {log.level}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center text-sm text-gray-900 dark:text-gray-100">
                      <Clock className="h-4 w-4 text-gray-400 mr-2" />
                      {log.timestamp}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getCategoryIcon(log.category)}
                      <span className="ml-2 text-sm text-gray-900 dark:text-gray-100 capitalize">
                        {log.category}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{log.message}</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">{log.details}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User className="h-4 w-4 text-gray-400 mr-2" />
                      <span className="text-sm text-gray-900 dark:text-gray-100">{log.user}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {log.ip}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {filteredLogs.length === 0 && (
          <div className="text-center py-12">
            <Info className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 dark:text-gray-400">Filtrelere uygun log kaydı bulunamadı</p>
          </div>
        )}
      </div>
    </div>
  )
}
