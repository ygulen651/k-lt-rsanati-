'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Save, UserPlus, Eye, Edit, Trash2 } from 'lucide-react'

export default function UyelikFormuPage() {
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [formSettings, setFormSettings] = useState({
    title: 'Üyelik Başvuru Formu',
    description: 'Sendikamıza üye olmak için aşağıdaki formu doldurun.',
    active: true,
    requireApproval: true,
    emailNotification: true,
    autoReply: true,
    autoReplyMessage: 'Üyelik başvurunuz alınmıştır. En kısa sürede değerlendirilip size dönüş yapılacaktır.'
  })

  const [formFields] = useState([
    { id: 1, name: 'Ad Soyad', type: 'text', required: true, active: true },
    { id: 2, name: 'E-posta', type: 'email', required: true, active: true },
    { id: 3, name: 'Telefon', type: 'tel', required: true, active: true },
    { id: 4, name: 'TC Kimlik No', type: 'text', required: true, active: true },
    { id: 5, name: 'Doğum Tarihi', type: 'date', required: true, active: true },
    { id: 6, name: 'Çalıştığı Kurum', type: 'text', required: true, active: true },
    { id: 7, name: 'Görevi', type: 'text', required: true, active: true },
    { id: 8, name: 'Çalışma Yılı', type: 'number', required: false, active: true },
    { id: 9, name: 'Adres', type: 'textarea', required: true, active: true },
    { id: 10, name: 'Üyelik Nedeni', type: 'textarea', required: false, active: true }
  ])

  const handleSave = async () => {
    setSaving(true)
    try {
      // Simulated save
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Üyelik formu ayarları başarıyla kaydedildi!')
    } catch (error) {
      alert('Kaydetme sırasında bir hata oluştu!')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserPlus className="h-8 w-8 text-blue-600" />
            Üyelik Formu Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">Üyelik başvuru formunu düzenleyin</p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="h-4 w-4 mr-2" />
          {saving ? 'Kaydediliyor...' : 'Kaydet'}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Form Ayarları */}
        <Card>
          <CardHeader>
            <CardTitle>Form Ayarları</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="title">Form Başlığı</Label>
              <Input
                id="title"
                value={formSettings.title}
                onChange={(e) => setFormSettings({ ...formSettings, title: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="description">Form Açıklaması</Label>
              <Textarea
                id="description"
                value={formSettings.description}
                onChange={(e) => setFormSettings({ ...formSettings, description: e.target.value })}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label>Form Aktif</Label>
                  <p className="text-sm text-muted-foreground">Üyelik formunu sitede göster</p>
                </div>
                <Switch
                  checked={formSettings.active}
                  onCheckedChange={(checked) => setFormSettings({ ...formSettings, active: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label>Onay Gerektir</Label>
                  <p className="text-sm text-muted-foreground">Başvurular manuel onay beklesin</p>
                </div>
                <Switch
                  checked={formSettings.requireApproval}
                  onCheckedChange={(checked) => setFormSettings({ ...formSettings, requireApproval: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label>E-posta Bildirimi</Label>
                  <p className="text-sm text-muted-foreground">Yeni başvuru geldiğinde bildirim gönder</p>
                </div>
                <Switch
                  checked={formSettings.emailNotification}
                  onCheckedChange={(checked) => setFormSettings({ ...formSettings, emailNotification: checked })}
                />
              </div>

              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <Label>Otomatik Yanıt</Label>
                  <p className="text-sm text-muted-foreground">Başvuru sahiplerine otomatik yanıt gönder</p>
                </div>
                <Switch
                  checked={formSettings.autoReply}
                  onCheckedChange={(checked) => setFormSettings({ ...formSettings, autoReply: checked })}
                />
              </div>
            </div>

            {formSettings.autoReply && (
              <div>
                <Label htmlFor="autoReplyMessage">Otomatik Yanıt Mesajı</Label>
                <Textarea
                  id="autoReplyMessage"
                  value={formSettings.autoReplyMessage}
                  onChange={(e) => setFormSettings({ ...formSettings, autoReplyMessage: e.target.value })}
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Form Alanları */}
        <Card>
          <CardHeader>
            <CardTitle>Form Alanları</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {formFields.map((field) => (
                <div key={field.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${field.active ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <div>
                      <p className="font-medium">{field.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {field.type} • {field.required ? 'Zorunlu' : 'Opsiyonel'}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3" />
                    </Button>
                    <Button size="sm" variant="outline">
                      {field.active ? <Eye className="h-3 w-3" /> : <Eye className="h-3 w-3 opacity-50" />}
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <Button className="w-full mt-4" variant="outline">
              <UserPlus className="h-4 w-4 mr-2" />
              Yeni Alan Ekle
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Başvuru İstatistikleri */}
      <Card>
        <CardHeader>
          <CardTitle>Başvuru İstatistikleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">23</div>
              <div className="text-sm text-muted-foreground">Toplam Başvuru</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">18</div>
              <div className="text-sm text-muted-foreground">Onaylanan</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">3</div>
              <div className="text-sm text-muted-foreground">Bekleyen</div>
            </div>
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-2xl font-bold text-red-600">2</div>
              <div className="text-sm text-muted-foreground">Reddedilen</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
