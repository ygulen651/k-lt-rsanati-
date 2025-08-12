'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart3,
  Users,
  Eye,
  Clock,
  TrendingUp,
  TrendingDown,
  Globe,
  Smartphone,
  Monitor,
  RefreshCw,
  Download,
  Calendar,
  FileText,
  Image as ImageIcon,
  Video,
  Activity
} from 'lucide-react'

interface AnalyticsData {
  visitors: number
  pageViews: number
  bounceRate: number
  avgSessionDuration: number
  topPages: Array<{ page: string; views: number }>
  topSources: Array<{ source: string; visitors: number }>
  deviceStats: Array<{ device: string; percentage: number }>
  contentStats: {
    announcements: number
    events: number
    media: number
    press: number
  }
}

export default function AnalitikPage() {
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData>({
    visitors: 0,
    pageViews: 0,
    bounceRate: 0,
    avgSessionDuration: 0,
    topPages: [],
    topSources: [],
    deviceStats: [],
    contentStats: {
      announcements: 0,
      events: 0,
      media: 0,
      press: 0
    }
  })

  // Simulated data - gerçek projede API'den gelecek
  useEffect(() => {
    const loadAnalytics = async () => {
      try {
        // Simulated API call
        await new Promise(resolve => setTimeout(resolve, 1000))
        
        const mockData: AnalyticsData = {
          visitors: 2847,
          pageViews: 8923,
          bounceRate: 42.3,
          avgSessionDuration: 3.2,
          topPages: [
            { page: '/ana-sayfa', views: 1523 },
            { page: '/hakkimizda', views: 892 },
            { page: '/basin-yayin', views: 743 },
            { page: '/etkinlikler', views: 651 },
            { page: '/iletisim', views: 432 }
          ],
          topSources: [
            { source: 'Doğrudan Erişim', visitors: 1247 },
            { source: 'Google', visitors: 892 },
            { source: 'Facebook', visitors: 456 },
            { source: 'Twitter', visitors: 152 },
            { source: 'Diğer', visitors: 100 }
          ],
          deviceStats: [
            { device: 'Masaüstü', percentage: 45.2 },
            { device: 'Mobil', percentage: 38.7 },
            { device: 'Tablet', percentage: 16.1 }
          ],
          contentStats: {
            announcements: 45,
            events: 23,
            media: 156,
            press: 89
          }
        }
        
        setAnalyticsData(mockData)
      } catch (error) {
        console.error('Analytics yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    loadAnalytics()
  }, [])

  const handleRefresh = async () => {
    setRefreshing(true)
    // Simulate refresh
    await new Promise(resolve => setTimeout(resolve, 1000))
    setRefreshing(false)
  }

  const exportReport = () => {
    // Simulate export
    alert('Rapor indirme özelliği yakında aktif olacak!')
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Analytics verileri yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            Analitik & Raporlar
          </h1>
          <p className="text-muted-foreground mt-2">
            Site performansı ve ziyaretçi istatistikleri
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={handleRefresh} variant="outline" disabled={refreshing}>
            <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Yenileniyor...' : 'Yenile'}
          </Button>
          <Button onClick={exportReport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Rapor İndir
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Genel Bakış</TabsTrigger>
          <TabsTrigger value="traffic">Trafik</TabsTrigger>
          <TabsTrigger value="content">İçerik</TabsTrigger>
          <TabsTrigger value="reports">Raporlar</TabsTrigger>
        </TabsList>

        {/* Genel Bakış */}
        <TabsContent value="overview" className="space-y-6">
          {/* Ana Metrikler */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Toplam Ziyaretçi</p>
                    <p className="text-2xl font-bold">{analyticsData.visitors.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+12.5%</span>
                    </div>
                  </div>
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Sayfa Görüntüleme</p>
                    <p className="text-2xl font-bold">{analyticsData.pageViews.toLocaleString()}</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+8.2%</span>
                    </div>
                  </div>
                  <Eye className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Çıkış Oranı</p>
                    <p className="text-2xl font-bold">{analyticsData.bounceRate}%</p>
                    <div className="flex items-center mt-1">
                      <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                      <span className="text-sm text-red-600">-3.1%</span>
                    </div>
                  </div>
                  <Activity className="h-8 w-8 text-orange-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Ort. Oturum Süresi</p>
                    <p className="text-2xl font-bold">{analyticsData.avgSessionDuration}dk</p>
                    <div className="flex items-center mt-1">
                      <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                      <span className="text-sm text-green-600">+0.4dk</span>
                    </div>
                  </div>
                  <Clock className="h-8 w-8 text-purple-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cihaz İstatistikleri */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Cihaz Dağılımı
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {analyticsData.deviceStats.map((device) => (
                  <div key={device.device} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {device.device === 'Masaüstü' && <Monitor className="h-5 w-5 text-blue-600" />}
                      {device.device === 'Mobil' && <Smartphone className="h-5 w-5 text-green-600" />}
                      {device.device === 'Tablet' && <Globe className="h-5 w-5 text-orange-600" />}
                      <span className="font-medium">{device.device}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-32 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full" 
                          style={{ width: `${device.percentage}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium w-12">{device.percentage}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Trafik */}
        <TabsContent value="traffic" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* En Popüler Sayfalar */}
            <Card>
              <CardHeader>
                <CardTitle>En Popüler Sayfalar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.topPages.map((page, index) => (
                    <div key={page.page} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{page.page}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{page.views} görüntüleme</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Trafik Kaynakları */}
            <Card>
              <CardHeader>
                <CardTitle>Trafik Kaynakları</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {analyticsData.topSources.map((source, index) => (
                    <div key={source.source} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-6 h-6 bg-green-100 text-green-600 rounded-full flex items-center justify-center text-sm font-bold">
                          {index + 1}
                        </div>
                        <span className="font-medium">{source.source}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">{source.visitors} ziyaretçi</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* İçerik */}
        <TabsContent value="content" className="space-y-6">
          {/* İçerik İstatistikleri */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6 text-center">
                <FileText className="h-12 w-12 text-blue-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Duyurular</h3>
                <p className="text-2xl font-bold">{analyticsData.contentStats.announcements}</p>
                <p className="text-sm text-muted-foreground">Toplam duyuru</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-12 w-12 text-green-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Etkinlikler</h3>
                <p className="text-2xl font-bold">{analyticsData.contentStats.events}</p>
                <p className="text-sm text-muted-foreground">Toplam etkinlik</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <ImageIcon className="h-12 w-12 text-purple-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Medya</h3>
                <p className="text-2xl font-bold">{analyticsData.contentStats.media}</p>
                <p className="text-sm text-muted-foreground">Toplam medya</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Video className="h-12 w-12 text-red-600 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Basın Yayın</h3>
                <p className="text-2xl font-bold">{analyticsData.contentStats.press}</p>
                <p className="text-sm text-muted-foreground">Toplam içerik</p>
              </CardContent>
            </Card>
          </div>

          {/* İçerik Performansı */}
          <Card>
            <CardHeader>
              <CardTitle>İçerik Performansı</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">En Çok Okunan Duyuru</h4>
                    <p className="text-sm text-muted-foreground">2025 Olağan Genel Kurul Toplantısı</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">1,234 görüntüleme</p>
                    <p className="text-sm text-green-600">+24% bu ay</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">En Popüler Etkinlik</h4>
                    <p className="text-sm text-muted-foreground">Kültür ve Sanat Festivali</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">892 görüntüleme</p>
                    <p className="text-sm text-green-600">+18% bu ay</p>
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div>
                    <h4 className="font-medium">En Çok İndirilen Medya</h4>
                    <p className="text-sm text-muted-foreground">Sendika Tanıtım Broşürü</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold">567 indirme</p>
                    <p className="text-sm text-green-600">+31% bu ay</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Raporlar */}
        <TabsContent value="reports" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Haftalık Rapor */}
            <Card>
              <CardHeader>
                <CardTitle>Haftalık Rapor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span>Bu Hafta Ziyaretçi</span>
                  <span className="font-semibold">2,847</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>Sayfa Görüntüleme</span>
                  <span className="font-semibold">8,923</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span>Yeni İçerik</span>
                  <span className="font-semibold">12</span>
                </div>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Haftalık Rapor İndir
                </Button>
              </CardContent>
            </Card>

            {/* Aylık Rapor */}
            <Card>
              <CardHeader>
                <CardTitle>Aylık Rapor</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center p-3 bg-blue-50 rounded-lg">
                  <span>Bu Ay Ziyaretçi</span>
                  <span className="font-semibold">12,456</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg">
                  <span>Sayfa Görüntüleme</span>
                  <span className="font-semibold">38,921</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                  <span>Yeni İçerik</span>
                  <span className="font-semibold">47</span>
                </div>
                <Button className="w-full" variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Aylık Rapor İndir
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Özel Raporlar */}
          <Card>
            <CardHeader>
              <CardTitle>Özel Raporlar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <Users className="h-6 w-6 mb-2" />
                  <span>Kullanıcı Raporu</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <FileText className="h-6 w-6 mb-2" />
                  <span>İçerik Raporu</span>
                </Button>
                <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
                  <BarChart3 className="h-6 w-6 mb-2" />
                  <span>Performans Raporu</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
