'use client'

import { 
  Users, 
  FileText, 
  Calendar, 
  Eye, 
  TrendingUp, 
  Activity,
  Plus,
  MoreVertical,
  Image,
  Newspaper,
  FolderOpen,
  Settings,
  Globe,
  Palette,
  Shield,
  Database,
  BarChart3,
  Mail,
  Bell,
  Search,
  Edit,
  Trash2,
  Eye as EyeIcon,
  Download,
  Upload,
  Home,
  Zap,
  Server,
  CheckCircle,
  AlertTriangle,
  Clock,
  ArrowUpRight,
  Sparkles
} from 'lucide-react'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'

// Modern stats data with real-time updates
const stats = [
  {
    title: 'Toplam Üye',
    value: '1,234',
    change: '+12%',
    changeType: 'increase' as const,
    icon: Users,
    color: 'from-blue-500 to-blue-600',
    bgColor: 'bg-blue-50 dark:bg-blue-950/20',
    textColor: 'text-blue-600 dark:text-blue-400',
    href: '/admin/uyeler',
    description: 'Aktif üye sayısı'
  },
  {
    title: 'Aktif Duyuru',
    value: '45',
    change: '+3',
    changeType: 'increase' as const,
    icon: FileText,
    color: 'from-emerald-500 to-emerald-600',
    bgColor: 'bg-emerald-50 dark:bg-emerald-950/20',
    textColor: 'text-emerald-600 dark:text-emerald-400',
    href: '/admin/duyurular',
    description: 'Yayınlanan duyurular'
  },
  {
    title: 'Bu Ay Etkinlik',
    value: '8',
    change: '+2',
    changeType: 'increase' as const,
    icon: Calendar,
    color: 'from-purple-500 to-purple-600',
    bgColor: 'bg-purple-50 dark:bg-purple-950/20',
    textColor: 'text-purple-600 dark:text-purple-400',
    href: '/admin/etkinlikler',
    description: 'Planlanan etkinlikler'
  },
  {
    title: 'Aylık Ziyaretçi',
    value: '12.5K',
    change: '+8.2%',
    changeType: 'increase' as const,
    icon: Eye,
    color: 'from-orange-500 to-orange-600',
    bgColor: 'bg-orange-50 dark:bg-orange-950/20',
    textColor: 'text-orange-600 dark:text-orange-400',
    href: '/admin/analytics',
    description: 'Benzersiz ziyaretçi'
  }
]

const siteSections = [
  {
    title: 'Ana Sayfa',
    description: 'Hero carousel, misyon-vizyon, öne çıkan içerikler',
    icon: Home,
    href: '/admin/ayarlar#homepage',
    color: 'bg-red-500'
  },
  {
    title: 'Duyurular',
    description: 'Duyuru ekleme, düzenleme, yayınlama',
    icon: FileText,
    href: '/admin/duyurular',
    color: 'bg-green-500'
  },
  {
    title: 'Etkinlikler',
    description: 'Etkinlik planlama ve yönetimi',
    icon: Calendar,
    href: '/admin/etkinlikler',
    color: 'bg-blue-500'
  },
  {
    title: 'Galeri',
    description: 'Fotoğraf ve medya yönetimi',
    icon: Image,
    href: '/admin/galeri',
    color: 'bg-purple-500'
  },
  {
    title: 'Basın-Yayın',
    description: 'Haber ve medya içerikleri',
    icon: Newspaper,
    href: '/admin/basin-yayin',
    color: 'bg-yellow-500'
  },
  {
    title: 'Bilgi-Belge',
    description: 'Doküman ve form yönetimi',
    icon: FolderOpen,
    href: '/admin/bilgi-belge',
    color: 'bg-indigo-500'
  },
  {
    title: 'Üyeler',
    description: 'Üye kayıtları ve yönetimi',
    icon: Users,
    href: '/admin/uyeler',
    color: 'bg-pink-500'
  },
  {
    title: 'Yönetim',
    description: 'Yönetim kurulu bilgileri',
    icon: Shield,
    href: '/admin/yonetim',
    color: 'bg-gray-500'
  }
]

const quickActions = [
  {
    title: 'Yeni Duyuru',
    description: 'Hızlıca duyuru ekle',
    href: '/admin/duyurular/yeni',
    icon: FileText,
    color: 'bg-red-500'
  },
  {
    title: 'Yeni Etkinlik',
    description: 'Etkinlik planla',
    href: '/admin/etkinlikler/yeni',
    icon: Calendar,
    color: 'bg-blue-500'
  },
  {
    title: 'Üye Ekle',
    description: 'Yeni üye kaydı',
    href: '/admin/uyeler/yeni',
    icon: Users,
    color: 'bg-green-500'
  },
  {
    title: 'Galeri Yükle',
    description: 'Fotoğraf ekle',
    href: '/admin/galeri',
    icon: Upload,
    color: 'bg-purple-500'
  }
]

const systemStatus = [
  { name: 'Veritabanı', status: 'online', color: 'text-green-500' },
  { name: 'API Servisleri', status: 'online', color: 'text-green-500' },
  { name: 'Dosya Yükleme', status: 'online', color: 'text-green-500' },
  { name: 'E-posta Servisi', status: 'warning', color: 'text-yellow-500' },
  { name: 'Yedekleme', status: 'online', color: 'text-green-500' }
]

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview')
  const [currentTime, setCurrentTime] = useState(new Date())

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date())
    }, 1000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      {/* Modern Page Header */}
      <div className="relative">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-red-600/5 rounded-3xl blur-3xl"></div>
        
        <div className="relative bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-8 shadow-xl">
          <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
            <div className="space-y-2">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent dark:from-white dark:via-blue-400 dark:to-purple-400">
                    Admin Dashboard
                  </h1>
                  <p className="text-lg text-gray-600 dark:text-gray-300">
                    Profesyonel Sendika Yönetim Sistemi
                  </p>
                </div>
              </div>
              <p className="text-gray-500 dark:text-gray-400 max-w-2xl leading-relaxed">
                Tüm site özelliklerini buradan kontrol edebilir, içeriklerinizi yönetebilir ve sisteminizi izleyebilirsiniz
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900 dark:text-white">
                  {currentTime.toLocaleDateString('tr-TR', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </div>
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                  {currentTime.toLocaleTimeString('tr-TR', { 
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              
              <div className="flex gap-3">
                <Button variant="outline" size="lg" className="group">
                  <Globe className="h-4 w-4 mr-2 group-hover:rotate-12 transition-transform" />
                  Site Önizleme
                </Button>
                <Button size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg">
                  <Plus className="h-4 w-4 mr-2" />
                  Hızlı Ekle
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modern Tab Navigation */}
      <div className="bg-white/60 dark:bg-gray-900/60 backdrop-blur-xl rounded-2xl border border-white/20 dark:border-gray-700/20 p-2 shadow-lg">
        <nav className="flex space-x-2">
          {[
            { key: 'overview', label: 'Genel Bakış', icon: Home },
            { key: 'content', label: 'İçerik Yönetimi', icon: FileText },
            { key: 'settings', label: 'Site Ayarları', icon: Settings },
            { key: 'analytics', label: 'Analitik', icon: BarChart3 }
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium text-sm transition-all duration-300 ${
                activeTab === tab.key
                  ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg scale-105'
                  : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <>
          {/* Modern Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Link
                key={stat.title}
                href={stat.href}
                className="group relative overflow-hidden"
              >
                {/* Glow Effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r opacity-0 group-hover:opacity-100 blur transition-all duration-500 rounded-2xl" 
                     style={{ background: `linear-gradient(135deg, ${stat.color.replace('from-', '').replace('to-', ', ')})` }}></div>
                
                {/* Card */}
                <Card className="relative bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl group-hover:shadow-2xl transition-all duration-500 group-hover:scale-105">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className={`p-3 rounded-2xl ${stat.bgColor} group-hover:scale-110 transition-transform duration-300`}>
                        <stat.icon className={`h-6 w-6 ${stat.textColor}`} />
                      </div>
                      <Badge variant="secondary" className="text-xs font-bold">
                        {stat.change}
                      </Badge>
                    </div>
                    
                    <div className="space-y-1">
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {stat.title}
                      </p>
                      <p className="text-3xl font-black text-gray-900 dark:text-white">
                        {stat.value}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        {stat.description}
                      </p>
                    </div>
                    
                    {/* Progress indicator */}
                    <div className="mt-4 flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                        <div 
                          className={`h-full bg-gradient-to-r ${stat.color} rounded-full transition-all duration-1000 ease-out`}
                          style={{ 
                            width: `${Math.min(100, parseInt(stat.change.replace('%', '').replace('+', '')) * 10)}%`,
                            animationDelay: `${index * 100}ms`
                          }}
                        ></div>
                      </div>
                      <ArrowUpRight className={`h-3 w-3 ${stat.textColor} group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform`} />
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>

          {/* Modern Site Sections Grid */}
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <Globe className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                    Site Bölümleri
                  </CardTitle>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tüm içerik türlerini yönetin</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {siteSections.map((section, index) => (
                  <Link
                    key={section.title}
                    href={section.href}
                    className="group relative p-4 rounded-2xl border border-gray-200/50 dark:border-gray-700/50 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-lg transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <div className="flex items-center space-x-3 mb-3">
                      <div className={`${section.color} p-2.5 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                        <section.icon className="h-5 w-5 text-white" />
                      </div>
                      <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {section.title}
                      </h3>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 leading-relaxed">
                      {section.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <Badge variant="outline" className="text-xs">
                        Yönet
                      </Badge>
                      <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Modern Quick Actions */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-lg flex items-center justify-center">
                    <Zap className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold">Hızlı İşlemler</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-2">
                {quickActions.map((action, index) => (
                  <Link
                    key={action.title}
                    href={action.href}
                    className="flex items-center p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className={`${action.color} p-2.5 rounded-xl mr-3 group-hover:scale-110 transition-transform duration-300 shadow-lg`}>
                      <action.icon className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                        {action.title}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{action.description}</p>
                    </div>
                    <ArrowUpRight className="h-4 w-4 text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 group-hover:-translate-y-1 transition-all" />
                  </Link>
                ))}
              </CardContent>
            </Card>

            {/* Modern System Status */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-r from-green-600 to-emerald-600 rounded-lg flex items-center justify-center">
                    <Server className="h-4 w-4 text-white" />
                  </div>
                  <CardTitle className="text-lg font-bold">Sistem Durumu</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {systemStatus.map((item, index) => (
                  <div 
                    key={item.name} 
                    className="flex items-center justify-between p-3 rounded-xl bg-gray-50 dark:bg-gray-800/50"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      {item.status === 'online' ? (
                        <CheckCircle className="h-4 w-4 text-green-500" />
                      ) : (
                        <AlertTriangle className="h-4 w-4 text-yellow-500" />
                      )}
                      <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{item.name}</span>
                    </div>
                    <Badge 
                      variant={item.status === 'online' ? 'default' : 'secondary'}
                      className={`text-xs ${item.status === 'online' ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400' : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'}`}
                    >
                      {item.status === 'online' ? 'Çevrimiçi' : 'Uyarı'}
                    </Badge>
                  </div>
                ))}
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-blue-600 hover:text-blue-700 hover:bg-blue-50 dark:hover:bg-blue-950/20">
                    <Activity className="h-4 w-4 mr-2" />
                    Detaylı Durum Raporu
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Modern Recent Activities */}
            <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader className="pb-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-pink-600 rounded-lg flex items-center justify-center">
                      <Activity className="h-4 w-4 text-white" />
                    </div>
                    <CardTitle className="text-lg font-bold">Son Aktiviteler</CardTitle>
                  </div>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group">
                  <div className="bg-red-100 dark:bg-red-900/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <FileText className="h-4 w-4 text-red-600 dark:text-red-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-red-400 transition-colors">
                      Yeni duyuru eklendi
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Sendika Genel Kurulu Toplantısı</p>
                    <div className="flex items-center mt-2 gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        2 saat önce
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group">
                  <div className="bg-blue-100 dark:bg-blue-900/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Calendar className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      Etkinlik güncellendi
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">İşçi Hakları Semineri</p>
                    <div className="flex items-center mt-2 gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        4 saat önce
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Admin
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start space-x-3 p-3 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group">
                  <div className="bg-green-100 dark:bg-green-900/20 p-2.5 rounded-xl group-hover:scale-110 transition-transform duration-300">
                    <Users className="h-4 w-4 text-green-600 dark:text-green-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-gray-900 dark:text-white group-hover:text-green-600 dark:group-hover:text-green-400 transition-colors">
                      Yeni üye kaydı
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">5 yeni üye başvurusu onaylandı</p>
                    <div className="flex items-center mt-2 gap-2">
                      <Badge variant="outline" className="text-xs">
                        <Clock className="h-3 w-3 mr-1" />
                        6 saat önce
                      </Badge>
                      <Badge variant="secondary" className="text-xs">
                        Sistem
                      </Badge>
                    </div>
                  </div>
                </div>
                
                <div className="pt-3 border-t border-gray-200 dark:border-gray-700">
                  <Button variant="ghost" size="sm" className="w-full justify-start text-purple-600 hover:text-purple-700 hover:bg-purple-50 dark:hover:bg-purple-950/20">
                    <Eye className="h-4 w-4 mr-2" />
                    Tüm Aktiviteleri Görüntüle
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}

      {/* Modern Content Management Tab */}
      {activeTab === 'content' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <FileText className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                      İçerik Yönetimi
                    </CardTitle>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Tüm içerik türlerini buradan yönetebilirsiniz
                    </p>
                  </div>
                </div>
                <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="h-4 w-4 mr-2" />
                  Toplu İşlem
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {siteSections.slice(1, 8).map((section, index) => (
                  <div 
                    key={section.title} 
                    className="group relative p-6 border border-gray-200/50 dark:border-gray-700/50 rounded-2xl hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-white to-gray-50 dark:from-gray-800 dark:to-gray-900"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-600/20 to-purple-600/20 rounded-2xl opacity-0 group-hover:opacity-100 blur transition-all duration-500"></div>
                    
                    <div className="relative">
                      <div className="flex items-center space-x-3 mb-4">
                        <div className={`${section.color} p-3 rounded-xl shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                          <section.icon className="h-6 w-6 text-white" />
                        </div>
                        <div>
                          <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                            {section.title}
                          </h3>
                          <Badge variant="outline" className="text-xs mt-1">
                            Aktif
                          </Badge>
                        </div>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-6 leading-relaxed">
                        {section.description}
                      </p>
                      
                      <div className="flex flex-col space-y-2">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="w-full justify-start group-hover:border-blue-300 group-hover:text-blue-600 transition-colors"
                          asChild
                        >
                          <Link href={section.href}>
                            <Eye className="h-4 w-4 mr-2" />
                            Görüntüle & Düzenle
                          </Link>
                        </Button>
                        <Button 
                          size="sm" 
                          className="w-full justify-start bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          asChild
                        >
                          <Link href={`${section.href}/yeni`}>
                            <Plus className="h-4 w-4 mr-2" />
                            Yeni Ekle
                          </Link>
                        </Button>
                      </div>
                      
                      {/* Stats */}
                      <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
                          <span>Toplam: {Math.floor(Math.random() * 50) + 10}</span>
                          <span>Bu ay: +{Math.floor(Math.random() * 10) + 1}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modern Settings Tab */}
      {activeTab === 'settings' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg">
                  <Settings className="h-6 w-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                    Site Ayarları
                  </CardTitle>
                  <p className="text-gray-500 dark:text-gray-400 mt-1">
                    Sitenizin genel ayarlarını buradan yönetebilirsiniz
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <Globe className="h-5 w-5 text-blue-600" />
                      Genel Ayarlar
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Site Başlığı', value: 'Kültür Sanat-İş Sendikası', action: 'Düzenle' },
                        { label: 'Site Açıklaması', value: 'Resmi website', action: 'Düzenle' },
                        { label: 'Logo', value: 'logo.png', action: 'Değiştir' },
                        { label: 'Favicon', value: 'kültür.png', action: 'Değiştir' },
                        { label: 'Tema Rengi', value: '#dc2626', action: 'Ayarla' }
                      ].map((item, index) => (
                        <div 
                          key={item.label}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                          style={{ animationDelay: `${index * 100}ms` }}
                        >
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.value}</p>
                          </div>
                          <Button variant="outline" size="sm" className="group-hover:border-blue-300 group-hover:text-blue-600">
                            <Edit className="h-3 w-3 mr-1" />
                            {item.action}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                      <FileText className="h-5 w-5 text-purple-600" />
                      İçerik Ayarları
                    </h3>
                    <div className="space-y-3">
                      {[
                        { label: 'Ana Sayfa Slider', value: '5 aktif slide', action: 'Düzenle' },
                        { label: 'Misyon-Vizyon', value: 'Güncel', action: 'Düzenle' },
                        { label: 'İletişim Bilgileri', value: 'Güncel', action: 'Düzenle' },
                        { label: 'Sosyal Medya', value: '4 platform', action: 'Düzenle' },
                        { label: 'Footer Metni', value: 'Özelleştirilmiş', action: 'Düzenle' }
                      ].map((item, index) => (
                        <div 
                          key={item.label}
                          className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800/50 rounded-xl hover:bg-gray-100 dark:hover:bg-gray-800 transition-all duration-300 group"
                          style={{ animationDelay: `${(index + 5) * 100}ms` }}
                        >
                          <div>
                            <span className="font-medium text-gray-900 dark:text-white">{item.label}</span>
                            <p className="text-sm text-gray-500 dark:text-gray-400">{item.value}</p>
                          </div>
                          <Button variant="outline" size="sm" className="group-hover:border-purple-300 group-hover:text-purple-600">
                            <Edit className="h-3 w-3 mr-1" />
                            {item.action}
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Modern Analytics Tab */}
      {activeTab === 'analytics' && (
        <div className="space-y-8 animate-in fade-in duration-500">
          <Card className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl border-0 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-gradient-to-r from-orange-600 to-red-600 rounded-2xl flex items-center justify-center shadow-lg">
                    <BarChart3 className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                      Site Analitikleri
                    </CardTitle>
                    <p className="text-gray-500 dark:text-gray-400 mt-1">
                      Detaylı ziyaretçi ve performans istatistikleri
                    </p>
                  </div>
                </div>
                <Button variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Rapor İndir
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Analytics Placeholder */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div className="h-80 bg-gradient-to-br from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 rounded-2xl flex items-center justify-center border border-blue-200/30 dark:border-blue-700/30">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <BarChart3 className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Ziyaretçi Grafiği</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">Son 30 günlük ziyaretçi trendi</p>
                    <Button variant="outline" size="sm">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Detaylı Görünüm
                    </Button>
                  </div>
                </div>
                
                <div className="h-80 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950/20 dark:to-teal-950/20 rounded-2xl flex items-center justify-center border border-emerald-200/30 dark:border-emerald-700/30">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                      <Eye className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Sayfa Görüntülemeleri</h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">En popüler sayfalar ve içerikler</p>
                    <Button variant="outline" size="sm">
                      <Activity className="h-4 w-4 mr-2" />
                      İstatistikleri Gör
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 p-6 bg-gradient-to-r from-gray-50 to-blue-50 dark:from-gray-800 dark:to-blue-900/20 rounded-2xl border border-gray-200/50 dark:border-gray-700/50">
                <div className="flex items-center justify-center text-center">
                  <div>
                    <Badge variant="outline" className="mb-3">
                      Yakında
                    </Badge>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                      Google Analytics Entegrasyonu
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Detaylı analitik raporları ve gerçek zamanlı veriler için Google Analytics entegrasyonu yakında aktif olacak
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}
