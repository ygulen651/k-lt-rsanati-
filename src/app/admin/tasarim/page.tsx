'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { 
  Save, 
  Palette,
  Type,
  Image as ImageIcon,
  Upload,
  RefreshCw,
  Monitor,
  Smartphone,
  Tablet
} from 'lucide-react'

interface ThemeData {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  backgroundColor: string
  textColor: string
  fontFamily: string
  logoUrl: string
  customCss: string
}

export default function TasarimPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [themeData, setThemeData] = useState<ThemeData>({
    primaryColor: '#dc2626',
    secondaryColor: '#2563eb',
    accentColor: '#7c3aed',
    backgroundColor: '#ffffff',
    textColor: '#1f2937',
    fontFamily: 'Inter',
    logoUrl: '/Logo-png-beyaz.png',
    customCss: ''
  })

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/admin/site-data')
        const result = await response.json()
        
        if (result.success && result.data.theme) {
          setThemeData(result.data.theme)
        }
      } catch (error) {
        console.error('Veri yükleme hatası:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const handleSave = async () => {
    setSaving(true)
    try {
      const response = await fetch('/api/admin/site-data', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ section: 'theme', data: themeData })
      })

      if (response.ok) {
        alert('Tasarım ayarları başarıyla kaydedildi!')
        // CSS değişkenlerini güncelle
        updateCSSVariables()
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

  const updateCSSVariables = () => {
    const root = document.documentElement
    root.style.setProperty('--primary-color', themeData.primaryColor)
    root.style.setProperty('--secondary-color', themeData.secondaryColor)
    root.style.setProperty('--accent-color', themeData.accentColor)
    root.style.setProperty('--background-color', themeData.backgroundColor)
    root.style.setProperty('--text-color', themeData.textColor)
  }

  const handleLogoUpload = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    
    try {
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        setThemeData({ ...themeData, logoUrl: result.url })
        alert('Logo başarıyla yüklendi!')
      } else {
        alert('Logo yükleme hatası!')
      }
    } catch (error) {
      console.error('Logo yükleme hatası:', error)
      alert('Logo yükleme hatası!')
    }
  }

  const presetThemes = [
    {
      name: 'Kültür-İş (Varsayılan)',
      colors: {
        primaryColor: '#dc2626',
        secondaryColor: '#2563eb',
        accentColor: '#7c3aed',
        backgroundColor: '#ffffff',
        textColor: '#1f2937'
      }
    },
    {
      name: 'Koyu Tema',
      colors: {
        primaryColor: '#ef4444',
        secondaryColor: '#3b82f6',
        accentColor: '#8b5cf6',
        backgroundColor: '#1f2937',
        textColor: '#f9fafb'
      }
    },
    {
      name: 'Yeşil Tema',
      colors: {
        primaryColor: '#059669',
        secondaryColor: '#0d9488',
        accentColor: '#0891b2',
        backgroundColor: '#ffffff',
        textColor: '#1f2937'
      }
    }
  ]

  const applyPreset = (preset: typeof presetThemes[0]) => {
    setThemeData({ ...themeData, ...preset.colors })
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Tasarım ayarları yükleniyor...</p>
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
            <Palette className="h-8 w-8 text-purple-600" />
            Tasarım & Tema
          </h1>
          <p className="text-muted-foreground mt-2">
            Sitenizin görsel tasarımını özelleştirin
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={updateCSSVariables} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Önizleme
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Sol Kolon - Renk Ayarları */}
        <div className="lg:col-span-2 space-y-6">
          {/* Renk Paleti */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Renk Paleti
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="primaryColor">Ana Renk</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="primaryColor"
                      type="color"
                      value={themeData.primaryColor}
                      onChange={(e) => setThemeData({ ...themeData, primaryColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={themeData.primaryColor}
                      onChange={(e) => setThemeData({ ...themeData, primaryColor: e.target.value })}
                      placeholder="#dc2626"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="secondaryColor">İkincil Renk</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="secondaryColor"
                      type="color"
                      value={themeData.secondaryColor}
                      onChange={(e) => setThemeData({ ...themeData, secondaryColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={themeData.secondaryColor}
                      onChange={(e) => setThemeData({ ...themeData, secondaryColor: e.target.value })}
                      placeholder="#2563eb"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="accentColor">Vurgu Rengi</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="accentColor"
                      type="color"
                      value={themeData.accentColor}
                      onChange={(e) => setThemeData({ ...themeData, accentColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={themeData.accentColor}
                      onChange={(e) => setThemeData({ ...themeData, accentColor: e.target.value })}
                      placeholder="#7c3aed"
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="backgroundColor">Arkaplan Rengi</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="backgroundColor"
                      type="color"
                      value={themeData.backgroundColor}
                      onChange={(e) => setThemeData({ ...themeData, backgroundColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={themeData.backgroundColor}
                      onChange={(e) => setThemeData({ ...themeData, backgroundColor: e.target.value })}
                      placeholder="#ffffff"
                    />
                  </div>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="textColor">Metin Rengi</Label>
                  <div className="flex items-center gap-2 mt-1">
                    <Input
                      id="textColor"
                      type="color"
                      value={themeData.textColor}
                      onChange={(e) => setThemeData({ ...themeData, textColor: e.target.value })}
                      className="w-16 h-10 p-1 rounded"
                    />
                    <Input
                      value={themeData.textColor}
                      onChange={(e) => setThemeData({ ...themeData, textColor: e.target.value })}
                      placeholder="#1f2937"
                    />
                  </div>
                </div>
              </div>

              {/* Hazır Temalar */}
              <div className="pt-4 border-t">
                <Label className="mb-3 block">Hazır Temalar</Label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {presetThemes.map((preset) => (
                    <Button
                      key={preset.name}
                      variant="outline"
                      className="h-auto p-3 flex flex-col items-start"
                      onClick={() => applyPreset(preset)}
                    >
                      <div className="flex gap-1 mb-2">
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: preset.colors.primaryColor }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: preset.colors.secondaryColor }}
                        />
                        <div 
                          className="w-4 h-4 rounded-full border"
                          style={{ backgroundColor: preset.colors.accentColor }}
                        />
                      </div>
                      <span className="text-sm font-medium">{preset.name}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Logo ve Tipografi */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Type className="h-5 w-5" />
                Logo & Tipografi
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Logo Yönetimi */}
              <div>
                <Label>Site Logosu</Label>
                <div className="mt-2 space-y-3">
                  <div className="flex items-center gap-4 p-4 border rounded-lg">
                    <div className="w-16 h-16 bg-gray-100 rounded flex items-center justify-center overflow-hidden">
                      <img
                        src={themeData.logoUrl}
                        alt="Logo"
                        className="max-w-full max-h-full object-contain"
                      />
                    </div>
                    <div className="flex-1">
                      <Input
                        placeholder="Logo URL'si"
                        value={themeData.logoUrl}
                        onChange={(e) => setThemeData({ ...themeData, logoUrl: e.target.value })}
                      />
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(e) => {
                        const file = e.target.files?.[0]
                        if (file) handleLogoUpload(file)
                      }}
                      className="hidden"
                      id="logo-upload"
                    />
                    <Button
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Upload className="h-4 w-4 mr-2" />
                      Logo Yükle
                    </Button>
                  </div>
                </div>
              </div>

              {/* Font Seçimi */}
              <div>
                <Label htmlFor="fontFamily">Font Ailesi</Label>
                <select
                  id="fontFamily"
                  value={themeData.fontFamily}
                  onChange={(e) => setThemeData({ ...themeData, fontFamily: e.target.value })}
                  className="mt-1 w-full p-2 border rounded-md"
                >
                  <option value="Inter">Inter</option>
                  <option value="Roboto">Roboto</option>
                  <option value="Open Sans">Open Sans</option>
                  <option value="Poppins">Poppins</option>
                  <option value="Lato">Lato</option>
                  <option value="Montserrat">Montserrat</option>
                </select>
              </div>
            </CardContent>
          </Card>

          {/* Özel CSS */}
          <Card>
            <CardHeader>
              <CardTitle>Özel CSS</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="/* Özel CSS kodlarınızı buraya yazın */"
                value={themeData.customCss}
                onChange={(e) => setThemeData({ ...themeData, customCss: e.target.value })}
                className="min-h-[200px] font-mono text-sm"
              />
              <p className="text-sm text-muted-foreground mt-2">
                Özel CSS kodları site genelinde uygulanacaktır. Dikkatli kullanın.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Sağ Kolon - Önizleme */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Monitor className="h-5 w-5" />
                Canlı Önizleme
              </CardTitle>
            </CardHeader>
            <CardContent>
              {/* Renk Önizleme */}
              <div className="space-y-4">
                <div className="p-4 rounded-lg border" style={{ backgroundColor: themeData.backgroundColor }}>
                  <h3 
                    className="font-bold text-lg mb-2"
                    style={{ color: themeData.primaryColor }}
                  >
                    Ana Başlık
                  </h3>
                  <p 
                    className="text-sm mb-3"
                    style={{ color: themeData.textColor }}
                  >
                    Bu bir örnek metin parçasıdır. Seçtiğiniz renkler böyle görünecektir.
                  </p>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 rounded text-white text-sm"
                      style={{ backgroundColor: themeData.primaryColor }}
                    >
                      Ana Buton
                    </button>
                    <button
                      className="px-4 py-2 rounded text-white text-sm"
                      style={{ backgroundColor: themeData.secondaryColor }}
                    >
                      İkincil Buton
                    </button>
                  </div>
                </div>

                {/* Responsive Önizleme */}
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium mb-2 block">Responsive Görünüm</Label>
                  <div className="flex gap-2 mb-3">
                    <Button size="sm" variant="outline">
                      <Monitor className="h-4 w-4 mr-1" />
                      Desktop
                    </Button>
                    <Button size="sm" variant="outline">
                      <Tablet className="h-4 w-4 mr-1" />
                      Tablet
                    </Button>
                    <Button size="sm" variant="outline">
                      <Smartphone className="h-4 w-4 mr-1" />
                      Mobil
                    </Button>
                  </div>
                  <div className="border rounded p-2 bg-gray-50">
                    <div className="bg-white rounded border p-3 text-xs">
                      <div className="h-2 bg-gray-200 rounded mb-2" style={{ backgroundColor: themeData.primaryColor, opacity: 0.3 }}></div>
                      <div className="h-1 bg-gray-200 rounded mb-1" style={{ backgroundColor: themeData.textColor, opacity: 0.2 }}></div>
                      <div className="h-1 bg-gray-200 rounded mb-2" style={{ backgroundColor: themeData.textColor, opacity: 0.2 }}></div>
                      <div className="h-4 bg-gray-200 rounded" style={{ backgroundColor: themeData.secondaryColor, opacity: 0.3 }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Renk Kodları */}
          <Card>
            <CardHeader>
              <CardTitle>Renk Kodları</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span>Ana Renk:</span>
                <code className="bg-gray-100 px-2 py-1 rounded">{themeData.primaryColor}</code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>İkincil:</span>
                <code className="bg-gray-100 px-2 py-1 rounded">{themeData.secondaryColor}</code>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span>Vurgu:</span>
                <code className="bg-gray-100 px-2 py-1 rounded">{themeData.accentColor}</code>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}