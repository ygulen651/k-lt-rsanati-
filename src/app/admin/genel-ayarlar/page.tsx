'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Save, Settings, Upload, Globe, Mail, Phone } from 'lucide-react'

export default function GenelAyarlarPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [settings, setSettings] = useState({
    siteName: 'Kültür-İş',
    siteTitle: 'Kültür Sanat İş',
    siteDescription: '',
    logo: '/Logo-png-beyaz.png',
    favicon: '/kültür.png',
    contactEmail: 'info@kultursanatis.org',
    contactPhone: '0312-419 85 79',
    fax: '0312-419 85 79',
    address: 'Şehit Adem Yavuz Sokak. Hitit Apt. No:14/14 Kızılay / ANKARA',
    timezone: 'Europe/Istanbul',
    language: 'tr'
  })

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const response = await fetch('/api/admin/site-data')
        const result = await response.json()
        if (result.success && result.data.settings) {
          setSettings({ ...settings, ...result.data.settings })
        }
      } catch (error) {
        console.error('Ayarlar yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }
    loadSettings()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/site-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'settings', data: settings })
      })

      if (response.ok) {
        alert('Genel ayarlar başarıyla kaydedildi!')
      } else {
        alert('Kaydetme sırasında bir hata oluştu!')
      }
    } catch (error) {
      console.error('Kaydetme hatası:', error)
      alert('Kaydetme sırasında bir hata oluştu!')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Genel ayarlar yükleniyor...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Settings className="h-8 w-8 text-blue-600" />
            Genel Ayarlar
          </h1>
          <p className="text-muted-foreground mt-2">Site genel ayarlarını yönetin</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Globe className="h-5 w-5" />
              Site Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="siteName">Site Adı</Label>
              <Input
                id="siteName"
                value={settings.siteName}
                onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="siteTitle">Site Başlığı</Label>
              <Input
                id="siteTitle"
                value={settings.siteTitle}
                onChange={(e) => setSettings({ ...settings, siteTitle: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="siteDescription">Site Açıklaması</Label>
              <Textarea
                id="siteDescription"
                value={settings.siteDescription}
                onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              İletişim Bilgileri
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contactEmail">E-posta</Label>
              <Input
                id="contactEmail"
                type="email"
                value={settings.contactEmail}
                onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="contactPhone">Telefon</Label>
              <Input
                id="contactPhone"
                value={settings.contactPhone}
                onChange={(e) => setSettings({ ...settings, contactPhone: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="fax">Faks</Label>
              <Input
                id="fax"
                value={settings.fax}
                onChange={(e) => setSettings({ ...settings, fax: e.target.value })}
              />
            </div>
            <div>
              <Label htmlFor="address">Adres</Label>
              <Textarea
                id="address"
                value={settings.address}
                onChange={(e) => setSettings({ ...settings, address: e.target.value })}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
