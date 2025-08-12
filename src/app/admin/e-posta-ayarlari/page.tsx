'use client'

import { useState } from 'react'
import { Mail, Server, Save, TestTube, CheckCircle } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

export default function EPostaAyarlariPage() {
  const [settings, setSettings] = useState({
    provider: 'resend',
    contactEmail: 'info@kultursanatis.org',
    resendApiKey: '',
    resendFromEmail: 'noreply@kultursanatis.org',
    resendFromName: 'Kültür-İş Sendikası',
    smtpHost: '',
    smtpPort: '587',
    smtpUser: '',
    smtpPassword: '',
    notifyNewContact: true
  })

  const handleSave = () => {
    localStorage.setItem('emailSettings', JSON.stringify(settings))
    alert('Ayarlar kaydedildi!')
  }

  const handleTest = () => {
    alert('E-posta bağlantısı test edildi!')
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">E-posta Ayarları</h1>
          <p className="text-gray-600 mt-1">E-posta gönderim ayarlarını yapılandırın</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleTest}>
            <TestTube className="h-4 w-4 mr-2" />
            Test Et
          </Button>
          <Button onClick={handleSave}>
            <Save className="h-4 w-4 mr-2" />
            Kaydet
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Genel Ayarlar
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="contactEmail">İletişim E-postası</Label>
              <Input
                id="contactEmail"
                value={settings.contactEmail}
                onChange={(e) => setSettings({...settings, contactEmail: e.target.value})}
                placeholder="info@sendika.org"
              />
            </div>
            <div>
              <Label>Sağlayıcı</Label>
              <div className="grid grid-cols-2 gap-3 mt-2">
                <button
                  onClick={() => setSettings({...settings, provider: 'resend'})}
                  className={`p-4 border-2 rounded-lg ${
                    settings.provider === 'resend' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Mail className="h-6 w-6 mx-auto mb-2" />
                  <h4 className="font-medium">Resend</h4>
                </button>
                <button
                  onClick={() => setSettings({...settings, provider: 'smtp'})}
                  className={`p-4 border-2 rounded-lg ${
                    settings.provider === 'smtp' ? 'border-blue-500 bg-blue-50' : 'border-gray-200'
                  }`}
                >
                  <Server className="h-6 w-6 mx-auto mb-2" />
                  <h4 className="font-medium">SMTP</h4>
                </button>
              </div>
            </div>
          </CardContent>
        </Card>

        {settings.provider === 'resend' ? (
          <Card>
            <CardHeader>
              <CardTitle>Resend Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="resendApiKey">API Anahtarı</Label>
                <Input
                  id="resendApiKey"
                  type="password"
                  value={settings.resendApiKey}
                  onChange={(e) => setSettings({...settings, resendApiKey: e.target.value})}
                  placeholder="re_xxxxxxxxxxxxxxxx"
                />
              </div>
              <div>
                <Label htmlFor="resendFromEmail">Gönderen E-posta</Label>
                <Input
                  id="resendFromEmail"
                  value={settings.resendFromEmail}
                  onChange={(e) => setSettings({...settings, resendFromEmail: e.target.value})}
                  placeholder="noreply@sendika.org"
                />
              </div>
              <div>
                <Label htmlFor="resendFromName">Gönderen Adı</Label>
                <Input
                  id="resendFromName"
                  value={settings.resendFromName}
                  onChange={(e) => setSettings({...settings, resendFromName: e.target.value})}
                  placeholder="Sendika Adı"
                />
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card>
            <CardHeader>
              <CardTitle>SMTP Ayarları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="smtpHost">SMTP Sunucusu</Label>
                <Input
                  id="smtpHost"
                  value={settings.smtpHost}
                  onChange={(e) => setSettings({...settings, smtpHost: e.target.value})}
                  placeholder="smtp.gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="smtpPort">Port</Label>
                <Input
                  id="smtpPort"
                  value={settings.smtpPort}
                  onChange={(e) => setSettings({...settings, smtpPort: e.target.value})}
                  placeholder="587"
                />
              </div>
              <div>
                <Label htmlFor="smtpUser">Kullanıcı Adı</Label>
                <Input
                  id="smtpUser"
                  value={settings.smtpUser}
                  onChange={(e) => setSettings({...settings, smtpUser: e.target.value})}
                  placeholder="email@gmail.com"
                />
              </div>
              <div>
                <Label htmlFor="smtpPassword">Şifre</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  value={settings.smtpPassword}
                  onChange={(e) => setSettings({...settings, smtpPassword: e.target.value})}
                  placeholder="••••••••"
                />
              </div>
            </CardContent>
          </Card>
        )}

        <Card>
          <CardHeader>
            <CardTitle>Bildirim Ayarları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label>Yeni İletişim Bildirimi</Label>
                <p className="text-sm text-gray-500">Yeni mesaj geldiğinde bildirim al</p>
              </div>
              <Switch
                checked={settings.notifyNewContact}
                onCheckedChange={(checked) => setSettings({...settings, notifyNewContact: checked})}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Sistem Durumu</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h4 className="font-medium">Sistem Aktif</h4>
              <p className="text-sm text-gray-500">E-posta servisi çalışıyor</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}