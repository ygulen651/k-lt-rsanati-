'use client'

import { useEffect, useRef, useState } from 'react'
import { 
  Settings, 
  Globe, 
  Palette, 
  Image, 
  Mail, 
  Shield, 
  Database, 
  Download,
  Upload,
  Save,
  Eye,
  EyeOff,
  Trash2,
  Plus,
  Edit,
  Search,
  Bell,
  Share,
  Home,
  FileText,
  Calendar,
  Users,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

export default function AdminSettings() {
  const [activeTab, setActiveTab] = useState('general')
  const [settings, setSettings] = useState({
    siteTitle: 'Sendika Website',
    siteDescription: 'Sendika resmi web sitesi',
    logo: '/Logo-png-beyaz.png',
    favicon: '/kültür.png',
    primaryColor: '#dc2626',
    secondaryColor: '#1f2937',
    contactEmail: 'info@sendika.org',
    contactPhone: '+90 212 123 45 67',
    address: 'İstanbul, Türkiye',
    socialMedia: {
      facebook: 'https://facebook.com/sendika',
      twitter: 'https://twitter.com/sendika',
      instagram: 'https://instagram.com/sendika',
      linkedin: 'https://linkedin.com/company/sendika'
    }
  })

  const [saving, setSaving] = useState(false)
  const [uploading, setUploading] = useState<{logo:boolean; favicon:boolean}>({logo:false, favicon:false})
  const logoInputRef = useRef<HTMLInputElement | null>(null)
  const faviconInputRef = useRef<HTMLInputElement | null>(null)

  // Site verilerini yükle
  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch('/api/admin/site-data', { cache: 'no-store' })
        const json = await res.json()
        if (json.success && json.data?.settings) {
          setSettings((prev) => ({ ...prev, ...json.data.settings }))
        }
      } catch {}
    }
    load()
  }, [])

  const tabs = [
    { id: 'general', title: 'Genel Ayarlar', icon: Settings },
    { id: 'appearance', title: 'Görünüm', icon: Palette },
    { id: 'content', title: 'İçerik Ayarları', icon: FileText },
    { id: 'contact', title: 'İletişim', icon: Mail },
    { id: 'social', title: 'Sosyal Medya', icon: Share },
    { id: 'security', title: 'Güvenlik', icon: Shield },
    { id: 'backup', title: 'Yedekleme', icon: Download },
    { id: 'advanced', title: 'Gelişmiş', icon: Database }
  ]

  const handleSave = async () => {
    try {
      setSaving(true)
      const res = await fetch('/api/admin/site-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'settings', data: settings })
      })
      const json = await res.json()
      if (res.ok && json.success) alert('Ayarlar kaydedildi')
      else alert(json.message || 'Kaydedilemedi')
    } catch {
      alert('Kaydetme sırasında hata oluştu')
    } finally { setSaving(false) }
  }

  const handleUpload = async (file: File, kind: 'logo' | 'favicon') => {
    try {
      setUploading((p) => ({ ...p, [kind]: true }))
      const token = typeof window !== 'undefined' ? localStorage.getItem('auth-token') : ''
      if (!token) return alert('Oturum gerekli')
      const fd = new FormData()
      fd.append('file', file)
      fd.append('title', kind)
      fd.append('type', 'image')
      fd.append('category', 'Site')
      const res = await fetch('/api/media', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: fd })
      const json = await res.json()
      if (res.ok && json.success) {
        const url: string = json.data?.url || json.data?.thumbnail
        setSettings((prev) => ({ ...prev, [kind]: url }))
      } else {
        alert(json.message || 'Yüklenemedi')
      }
    } catch {
      alert('Yükleme sırasında hata oluştu')
    } finally {
      setUploading((p) => ({ ...p, [kind]: false }))
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Site Ayarları</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Website'in tüm ayarlarını buradan yönetebilirsiniz
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" className="flex items-center space-x-2">
            <Eye className="h-4 w-4" />
            <span>Önizleme</span>
          </Button>
          <Button onClick={handleSave} disabled={saving} className="flex items-center space-x-2 bg-red-600 hover:bg-red-700">
            <Save className="h-4 w-4" />
            <span>{saving ? 'Kaydediliyor...' : 'Kaydet'}</span>
          </Button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <nav className="flex space-x-8 overflow-x-auto">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap flex items-center space-x-2 ${
                activeTab === tab.id
                  ? 'border-red-500 text-red-600 dark:text-red-400'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
              }`}
            >
              <tab.icon className="h-4 w-4" />
              <span>{tab.title}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* General Settings Tab */}
      {activeTab === 'general' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Globe className="h-5 w-5" />
                <span>Genel Site Bilgileri</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Başlığı
                  </label>
                  <Input
                    value={settings.siteTitle}
                    onChange={(e) => setSettings({...settings, siteTitle: e.target.value})}
                    placeholder="Site başlığını girin"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Site Açıklaması
                  </label>
                  <Input
                    value={settings.siteDescription}
                    onChange={(e) => setSettings({...settings, siteDescription: e.target.value})}
                    placeholder="Site açıklamasını girin"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Logo
                  </label>
                  <div className="flex items-center space-x-3">
                    <img src={settings.logo} alt="Logo" className="h-12 w-auto rounded" />
                    <input ref={logoInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>{
                      const f=e.target.files?.[0]; if (f) handleUpload(f,'logo')
                    }} />
                    <Button variant="outline" size="sm" onClick={()=>logoInputRef.current?.click()} disabled={uploading.logo}>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading.logo ? 'Yükleniyor...' : 'Değiştir'}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Favicon
                  </label>
                  <div className="flex items-center space-x-3">
                    <img src={settings.favicon} alt="" className="h-8 w-8 rounded" />
                    <input ref={faviconInputRef} type="file" accept="image/*" className="hidden" onChange={(e)=>{
                      const f=e.target.files?.[0]; if (f) handleUpload(f,'favicon')
                    }} />
                    <Button variant="outline" size="sm" onClick={()=>faviconInputRef.current?.click()} disabled={uploading.favicon}>
                      <Upload className="h-4 w-4 mr-2" />
                      {uploading.favicon ? 'Yükleniyor...' : 'Değiştir'}
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Mail className="h-5 w-5" />
                <span>İletişim Bilgileri</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    E-posta
                  </label>
                  <Input
                    value={settings.contactEmail}
                    onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                    type="email"
                    placeholder="info@sendika.org"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Telefon
                  </label>
                  <Input
                    value={settings.contactPhone}
                    onChange={(e) => setSettings({...settings, contactPhone: e.target.value})}
                    placeholder="+90 212 123 45 67"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Adres
                </label>
                <Textarea
                  value={settings.address}
                  onChange={(e) => setSettings({...settings, address: e.target.value})}
                  placeholder="Adres bilgisini girin"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Appearance Tab */}
      {activeTab === 'appearance' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Palette className="h-5 w-5" />
                <span>Tema ve Renkler</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Ana Renk
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                      className="h-10 w-20 rounded border"
                    />
                    <Input
                      value={settings.primaryColor}
                      onChange={(e) => setSettings({...settings, primaryColor: e.target.value})}
                      placeholder="#dc2626"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    İkincil Renk
                  </label>
                  <div className="flex items-center space-x-3">
                    <input
                      type="color"
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                      className="h-10 w-20 rounded border"
                    />
                    <Input
                      value={settings.secondaryColor}
                      onChange={(e) => setSettings({...settings, secondaryColor: e.target.value})}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Image className="h-5 w-5" />
                <span>Görsel Ayarlar</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Hero Carousel
                  </label>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Carousel Düzenle
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Arka Plan Görselleri
                  </label>
                  <Button variant="outline" className="w-full">
                    <Image className="h-4 w-4 mr-2" />
                    Görselleri Yönet
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Content Settings Tab */}
      {activeTab === 'content' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <FileText className="h-5 w-5" />
                <span>Ana Sayfa İçerikleri</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Misyon & Vizyon
                  </label>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Düzenle
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Öne Çıkan İçerikler
                  </label>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Yönet
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Footer İçeriği
                  </label>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Düzenle
                  </Button>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Menü Yapısı
                  </label>
                  <Button variant="outline" className="w-full">
                    <Edit className="h-4 w-4 mr-2" />
                    Düzenle
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Social Media Tab */}
      {activeTab === 'social' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Share className="h-5 w-5" />
                <span>Sosyal Medya Hesapları</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Facebook
                  </label>
                  <Input
                    value={settings.socialMedia.facebook}
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialMedia: {...settings.socialMedia, facebook: e.target.value}
                    })}
                    placeholder="https://facebook.com/sendika"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Twitter
                  </label>
                  <Input
                    value={settings.socialMedia.twitter}
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialMedia: {...settings.socialMedia, twitter: e.target.value}
                    })}
                    placeholder="https://twitter.com/sendika"
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Instagram
                  </label>
                  <Input
                    value={settings.socialMedia.instagram}
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialMedia: {...settings.socialMedia, instagram: e.target.value}
                    })}
                    placeholder="https://instagram.com/sendika"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    LinkedIn
                  </label>
                  <Input
                    value={settings.socialMedia.linkedin}
                    onChange={(e) => setSettings({
                      ...settings, 
                      socialMedia: {...settings.socialMedia, linkedin: e.target.value}
                    })}
                    placeholder="https://linkedin.com/company/sendika"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Security Tab */}
      {activeTab === 'security' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Shield className="h-5 w-5" />
                <span>Güvenlik Ayarları</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">SSL Sertifikası</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">HTTPS bağlantısı aktif</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">Aktif</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Firewall</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Güvenlik duvarı koruması</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">Aktif</span>
                  </div>
                </div>
                
                <div className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div>
                    <h4 className="font-medium text-gray-900 dark:text-white">Yedekleme</h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">Otomatik yedekleme sistemi</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span className="text-sm text-green-600 dark:text-green-400">Aktif</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Backup Tab */}
      {activeTab === 'backup' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Yedekleme ve Geri Yükleme</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Manuel Yedekleme</h4>
                  <Button className="w-full bg-green-600 hover:bg-green-700">
                    <Download className="h-4 w-4 mr-2" />
                    Yedek Oluştur
                  </Button>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Geri Yükleme</h4>
                  <Button variant="outline" className="w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    Yedekten Geri Yükle
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Otomatik Yedekleme</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Günlük yedekleme</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Haftalık yedekleme</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Aylık yedekleme</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Advanced Tab */}
      {activeTab === 'advanced' && (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Database className="h-5 w-5" />
                <span>Gelişmiş Ayarlar</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Veritabanı</h4>
                  <Button variant="outline" className="w-full">
                    <Database className="h-4 w-4 mr-2" />
                    Veritabanı Yönetimi
                  </Button>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">Sistem Logları</h4>
                  <Button variant="outline" className="w-full">
                    <Activity className="h-4 w-4 mr-2" />
                    Logları Görüntüle
                  </Button>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium text-gray-900 dark:text-white mb-3">Performans</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Cache sistemi</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">CDN entegrasyonu</span>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 dark:bg-gray-700 rounded">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Görsel optimizasyonu</span>
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
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
