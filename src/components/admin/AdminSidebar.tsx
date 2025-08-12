'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  LayoutDashboard, 
  FileText, 
  Calendar, 
  Image, 
  Newspaper, 
  FolderOpen, 
  Users, 
  Settings, 
  LogOut,
  ChevronDown,
  Home,
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
  Eye,
  Download,
  Upload,
  BookOpen,
  File,
  UserCheck,
  UserX,
  Activity,
  Cog,
  Monitor,
  Server,
  HardDrive,
  Zap,
  Share,
  TrendingUp,
  Video,
  User
} from 'lucide-react'
import { useState } from 'react'

const menuItems = [
  {
    title: 'Dashboard',
    href: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'İçerik Yönetimi',
    icon: FileText,
    submenu: [
      { title: 'Duyurular', href: '/admin/duyurular', icon: FileText },
      { title: 'Etkinlikler', href: '/admin/etkinlikler', icon: Calendar },
      { title: 'Galeri', href: '/admin/galeri', icon: Image },
      { title: 'Basın-Yayın', href: '/admin/basin-yayin', icon: Newspaper },
      { title: 'Afiş', href: '/admin/basin-yayin/afis', icon: Image },
      { title: 'Broşür', href: '/admin/basin-yayin/brosur', icon: FileText },
      { title: 'Fotoğraf', href: '/admin/basin-yayin/fotograf', icon: Image },
      { title: 'Video', href: '/admin/basin-yayin/video', icon: Video },
      { title: 'Rapor', href: '/admin/basin-yayin/rapor', icon: FileText },
      { title: 'Çalışma Takvimi', href: '/admin/basin-yayin/takvim', icon: Calendar },
      
      { title: 'Kültür Sanat-İş', href: '/admin/kultur-sanat-is', icon: Newspaper },
      { title: 'Kamu-AR', href: '/admin/kamu-ar', icon: FileText },
      { title: 'Bilgi-Belge', href: '/admin/bilgi-belge', icon: FolderOpen },
      { title: 'Tüzük', href: '/admin/tuzuk', icon: BookOpen },
      { title: 'Üyelik Formu', href: '/admin/uyelik-formu', icon: UserCheck },
      { title: 'Konfederasyon', href: '/admin/konfederasyon', icon: Users },
      { title: 'Yönetim Kurulu', href: '/admin/yonetim-kurulu', icon: Shield },
      { title: 'Merkez Yönetim Kurulu', href: '/admin/merkez-yonetim-kurulu', icon: Shield },
      { title: 'Merkez Denetleme Kurulu', href: '/admin/merkez-denetleme-kurulu', icon: Shield },
      { title: 'Merkez Disiplin Kurulu', href: '/admin/merkez-disiplin-kurulu', icon: Shield },
    ]
  },
  {
    title: 'Kullanıcı Yönetimi',
    icon: Users,
    submenu: [
      { title: 'Üyeler', href: '/admin/uyeler', icon: Users },
      { title: 'Yönetim Kullanıcıları', href: '/admin/yonetim-kullanicilari', icon: UserCheck },
      { title: 'Üyelik Başvuruları', href: '/admin/uyelik-basvurulari', icon: UserX },
    ]
  },
  {
    title: 'Site Yönetimi',
    icon: Globe,
    submenu: [
      { title: 'Ana Sayfa Slider', href: '/admin/slider', icon: Image },
      { title: 'Ana Sayfa', href: '/admin/ana-sayfa', icon: Home },
      { title: 'Tasarım & Tema', href: '/admin/tasarim', icon: Palette },
      { title: 'Menü Yapısı', href: '/admin/menu', icon: Edit },
      { title: 'SEO Ayarları', href: '/admin/seo', icon: Search },
      { title: 'Sosyal Medya', href: '/admin/sosyal-medya', icon: Share },
    ]
  },
  {
    title: 'Sistem Yönetimi',
    icon: Cog,
    submenu: [
      { title: 'Genel Ayarlar', href: '/admin/ayarlar', icon: Settings },
      { title: 'Veritabanı', href: '/admin/veritabani', icon: Database },
      { title: 'Dosya Yönetimi', href: '/admin/dosyalar', icon: HardDrive },
      { title: 'Yedekleme', href: '/admin/yedekleme', icon: Download },
      { title: 'Güvenlik', href: '/admin/guvenlik', icon: Shield },
      { title: 'Sistem Logları', href: '/admin/sistem-loglari', icon: Activity },
    ]
  },
  {
    title: 'Analitik & Raporlar',
    icon: BarChart3,
    submenu: [
      { title: 'Site İstatistikleri', href: '/admin/analytics', icon: BarChart3 },
      { title: 'Ziyaretçi Analizi', href: '/admin/ziyaretci-analizi', icon: Eye },
      { title: 'İçerik Performansı', href: '/admin/icerik-performansi', icon: TrendingUp },
      { title: 'Üye Raporları', href: '/admin/uye-raporlari', icon: Users },
    ]
  },
  {
    title: 'İletişim & Bildirimler',
    icon: Mail,
    submenu: [
      { title: 'E-posta Ayarları', href: '/admin/e-posta-ayarlari', icon: Mail },
      { title: 'Bildirimler', href: '/admin/bildirimler', icon: Bell },
      { title: 'İletişim Yönetimi', href: '/admin/iletisim-yonetimi', icon: File },
      { title: 'Abonelik Yönetimi', href: '/admin/abonelik-yonetimi', icon: UserCheck },
    ]
  }
]

export interface User {
  id: string
  email: string
  name: string
  role: 'admin' | 'editor' | 'viewer'
}

interface AdminSidebarProps {
  user: User
}

export function AdminSidebar({ user }: AdminSidebarProps) {
  const pathname = usePathname()
  const [openMenus, setOpenMenus] = useState<string[]>(['İçerik Yönetimi', 'Site Yönetimi'])
  const [isCollapsed, setIsCollapsed] = useState(false)

  const toggleMenu = (title: string) => {
    setOpenMenus(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    )
  }

  return (
    <div className={`${isCollapsed ? 'w-16' : 'w-72'} bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-r border-gray-200/50 dark:border-gray-700/50 shadow-2xl flex flex-col transition-all duration-300`}>
      {/* Modern Logo Section */}
      <div className="p-6 border-b border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-300">
              <Home className="h-5 w-5 text-white" />
            </div>
            {!isCollapsed && (
              <div>
                <h2 className="text-xl font-black bg-gradient-to-r from-gray-900 to-gray-600 bg-clip-text text-transparent dark:from-white dark:to-gray-300">
                  Admin Panel
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400 font-medium">
                  Sendika Yönetimi
                </p>
              </div>
            )}
          </Link>
          <button
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-xl transition-colors"
          >
            <ChevronDown className={`h-4 w-4 text-gray-500 transition-transform duration-300 ${isCollapsed ? 'rotate-90' : 'rotate-0'}`} />
          </button>
        </div>
      </div>

      {/* Modern Quick Stats */}
      {!isCollapsed && (
        <div className="p-4 border-b border-gray-200/50 dark:border-gray-700/50">
          <div className="grid grid-cols-2 gap-3">
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/10 to-green-500/10 rounded-xl"></div>
              <div className="relative bg-emerald-50/50 dark:bg-emerald-900/20 p-3 rounded-xl border border-emerald-200/30 dark:border-emerald-700/30 group-hover:scale-105 transition-transform duration-300">
                <div className="text-xl font-black text-emerald-600 dark:text-emerald-400">45</div>
                <div className="text-xs font-semibold text-emerald-600/80 dark:text-emerald-400/80">Aktif İçerik</div>
              </div>
            </div>
            <div className="group relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 rounded-xl"></div>
              <div className="relative bg-blue-50/50 dark:bg-blue-900/20 p-3 rounded-xl border border-blue-200/30 dark:border-blue-700/30 group-hover:scale-105 transition-transform duration-300">
                <div className="text-xl font-black text-blue-600 dark:text-blue-400">1.2K</div>
                <div className="text-xs font-semibold text-blue-600/80 dark:text-blue-400/80">Üye</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Navigation */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
        {menuItems.map((item, index) => (
          <div key={item.title} style={{ animationDelay: `${index * 50}ms` }}>
            {item.submenu ? (
              <div>
                <button
                  onClick={() => toggleMenu(item.title)}
                  className={`w-full flex items-center justify-between p-3 text-left rounded-xl transition-all duration-300 group ${
                    openMenus.includes(item.title)
                      ? 'bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-900/20 dark:to-purple-900/20 text-blue-700 dark:text-blue-300 shadow-sm'
                      : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                      openMenus.includes(item.title)
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                        : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                    }`}>
                      <item.icon className="h-4 w-4" />
                    </div>
                    {!isCollapsed && (
                      <span className="font-semibold text-sm">{item.title}</span>
                    )}
                  </div>
                  {!isCollapsed && (
                    <ChevronDown 
                      className={`h-4 w-4 transition-transform duration-300 ${
                        openMenus.includes(item.title) ? 'rotate-180' : ''
                      }`} 
                    />
                  )}
                </button>
                
                {openMenus.includes(item.title) && !isCollapsed && (
                  <div className="ml-6 mt-2 space-y-1 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                    {item.submenu.map((subItem, subIndex) => (
                      <Link
                        key={subItem.href}
                        href={subItem.href}
                        className={`flex items-center space-x-3 p-2.5 rounded-lg transition-all duration-300 group ${
                          pathname === subItem.href
                            ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50'
                            : 'text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white'
                        }`}
                        style={{ animationDelay: `${(index * 50) + (subIndex * 25)}ms` }}
                      >
                        <div className={`p-1 rounded-md transition-all duration-300 ${
                          pathname === subItem.href
                            ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white'
                            : 'bg-gray-200 dark:bg-gray-700 group-hover:bg-gray-300 dark:group-hover:bg-gray-600'
                        }`}>
                          <subItem.icon className="h-3 w-3" />
                        </div>
                        <span className="text-sm font-medium">{subItem.title}</span>
                        {pathname === subItem.href && (
                          <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full ml-auto"></div>
                        )}
                      </Link>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <Link
                href={item.href}
                className={`flex items-center space-x-3 p-3 rounded-xl transition-all duration-300 group ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 shadow-sm border border-blue-200/50 dark:border-blue-700/50'
                    : 'text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                <div className={`p-1.5 rounded-lg transition-all duration-300 ${
                  pathname === item.href
                    ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg'
                    : 'bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600'
                }`}>
                  <item.icon className="h-4 w-4" />
                </div>
                {!isCollapsed && (
                  <span className="font-semibold text-sm">{item.title}</span>
                )}
                {pathname === item.href && !isCollapsed && (
                  <div className="w-2 h-2 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full ml-auto"></div>
                )}
              </Link>
            )}
          </div>
        ))}
      </nav>

      {/* Modern System Status */}
      {!isCollapsed && (
        <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
          <div className="space-y-3 mb-4">
            <h3 className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider flex items-center gap-2">
              <Server className="h-3 w-3" />
              Sistem Durumu
            </h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between p-2 bg-green-50/50 dark:bg-green-900/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Sistem</span>
                </div>
                <span className="text-xs font-bold text-green-600 dark:text-green-400">Çevrimiçi</span>
              </div>
              <div className="flex items-center justify-between p-2 bg-blue-50/50 dark:bg-blue-900/10 rounded-lg">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">Veritabanı</span>
                </div>
                <span className="text-xs font-bold text-blue-600 dark:text-blue-400">Aktif</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Modern Footer */}
      <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50">
        <div className="flex items-center justify-between mb-3">
          {!isCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                <User className="h-4 w-4 text-white" />
              </div>
              <div>
                <p className="text-sm font-bold text-gray-900 dark:text-white">{user.name}</p>
                <p className="text-xs text-gray-500 dark:text-gray-400 capitalize">{user.role}</p>
              </div>
            </div>
          )}
        </div>
        <button className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start space-x-3'} p-3 text-gray-700 dark:text-gray-200 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 rounded-xl transition-all duration-300 group`}>
          <div className="p-1.5 rounded-lg bg-gray-100 dark:bg-gray-700 group-hover:bg-red-100 dark:group-hover:bg-red-900/20 transition-colors">
            <LogOut className="h-4 w-4" />
          </div>
          {!isCollapsed && (
            <span className="font-semibold text-sm">Çıkış Yap</span>
          )}
        </button>
      </div>
    </div>
  )
}
