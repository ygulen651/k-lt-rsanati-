'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Database, Download, Upload, RefreshCw, Trash2, Archive } from 'lucide-react'

export default function VeritabaniPage() {
  const [loading, setLoading] = useState(false)

  const handleBackup = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000)) // Simulated
      alert('Veritabanı yedeği başarıyla oluşturuldu!')
    } catch (error) {
      alert('Yedekleme sırasında hata oluştu!')
    } finally {
      setLoading(false)
    }
  }

  const handleRestore = () => {
    if (confirm('Veritabanını geri yüklemek istediğinizden emin misiniz?')) {
      alert('Geri yükleme özelliği yakında aktif olacak!')
    }
  }

  const handleOptimize = async () => {
    setLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      alert('Veritabanı optimizasyonu tamamlandı!')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Database className="h-8 w-8 text-purple-600" />
            Veritabanı Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">Veritabanı işlemlerini yönetin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Yedekleme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Veritabanının tam yedeğini alın
            </p>
            <Button onClick={handleBackup} disabled={loading} className="w-full">
              <Download className="h-4 w-4 mr-2" />
              {loading ? 'Yedekleniyor...' : 'Yedek Al'}
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Geri Yükleme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Önceki yedekten veritabanını geri yükleyin
            </p>
            <Button onClick={handleRestore} variant="outline" className="w-full">
              <Upload className="h-4 w-4 mr-2" />
              Geri Yükle
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <RefreshCw className="h-5 w-5" />
              Optimizasyon
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Veritabanı performansını optimize edin
            </p>
            <Button onClick={handleOptimize} disabled={loading} variant="secondary" className="w-full">
              <RefreshCw className="h-4 w-4 mr-2" />
              {loading ? 'Optimize Ediliyor...' : 'Optimize Et'}
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Veritabanı İstatistikleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">156</div>
              <div className="text-sm text-muted-foreground">Toplam Kayıt</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">45</div>
              <div className="text-sm text-muted-foreground">Duyurular</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">23</div>
              <div className="text-sm text-muted-foreground">Etkinlikler</div>
            </div>
            <div className="text-center p-4 bg-orange-50 rounded-lg">
              <div className="text-2xl font-bold text-orange-600">12</div>
              <div className="text-sm text-muted-foreground">Üyeler</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
