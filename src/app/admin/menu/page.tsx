'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { 
  Save, 
  Plus,
  Trash2,
  Edit,
  Eye,
  EyeOff,
  ArrowUp,
  ArrowDown,
  Menu as MenuIcon,
  ExternalLink,
  Home,
  FileText,
  Users,
  Phone
} from 'lucide-react'

interface MenuItem {
  id: number
  title: string
  url: string
  order: number
  visible: boolean
  target: '_self' | '_blank'
}

export default function MenuPage() {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [editingId, setEditingId] = useState<number | null>(null)

  // Verileri yükle
  useEffect(() => {
    const loadData = async () => {
      try {
        const response = await fetch('/api/admin/site-data')
        const result = await response.json()
        
        if (result.success && result.data.menu) {
          setMenuItems(result.data.menu.sort((a: MenuItem, b: MenuItem) => a.order - b.order))
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
        body: JSON.stringify({ section: 'menu', data: menuItems })
      })

      if (response.ok) {
        setEditingId(null)
        alert('Menü yapısı başarıyla kaydedildi!')
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

  const addMenuItem = () => {
    const maxOrder = Math.max(...menuItems.map(item => item.order), 0)
    const newItem: MenuItem = {
      id: Date.now(),
      title: 'Yeni Menü',
      url: '/',
      order: maxOrder + 1,
      visible: true,
      target: '_self'
    }
    setMenuItems([...menuItems, newItem])
    setEditingId(newItem.id)
  }

  const updateMenuItem = (id: number, field: keyof MenuItem, value: any) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ))
  }

  const deleteMenuItem = (id: number) => {
    if (confirm('Bu menü öğesini silmek istediğinizden emin misiniz?')) {
      setMenuItems(menuItems.filter(item => item.id !== id))
    }
  }

  const moveMenuItem = (id: number, direction: 'up' | 'down') => {
    const sortedItems = [...menuItems].sort((a, b) => a.order - b.order)
    const index = sortedItems.findIndex(item => item.id === id)
    if (index === -1) return
    
    const newIndex = direction === 'up' ? index - 1 : index + 1
    if (newIndex < 0 || newIndex >= sortedItems.length) return
    
    const updatedItems = menuItems.map(item => {
      if (item.id === sortedItems[index].id) {
        return { ...item, order: sortedItems[newIndex].order }
      }
      if (item.id === sortedItems[newIndex].id) {
        return { ...item, order: sortedItems[index].order }
      }
      return item
    })
    
    setMenuItems(updatedItems)
  }

  const toggleVisible = (id: number) => {
    setMenuItems(menuItems.map(item => 
      item.id === id ? { ...item, visible: !item.visible } : item
    ))
  }

  const getMenuIcon = (url: string) => {
    if (url === '/' || url === '/ana-sayfa') return Home
    if (url.includes('/hakkimizda') || url.includes('/yonetim')) return Users
    if (url.includes('/basin') || url.includes('/duyuru') || url.includes('/etkinlik')) return FileText
    if (url.includes('/iletisim')) return Phone
    return MenuIcon
  }

  const sortedMenuItems = [...menuItems].sort((a, b) => a.order - b.order)

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Menü yapısı yükleniyor...</p>
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
            <MenuIcon className="h-8 w-8 text-indigo-600" />
            Menü Yapısı
          </h1>
          <p className="text-muted-foreground mt-2">
            Site navigasyon menüsünü düzenleyin
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button onClick={addMenuItem} variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Menü
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>

      {/* Menü Öğeleri */}
      <div className="grid gap-4">
        {sortedMenuItems.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <MenuIcon className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-2">Henüz menü öğesi eklenmemiş</h3>
              <p className="text-muted-foreground mb-4">
                İlk menü öğenizi ekleyerek başlayın
              </p>
              <Button onClick={addMenuItem}>
                <Plus className="h-4 w-4 mr-2" />
                İlk Menü Öğesini Ekle
              </Button>
            </CardContent>
          </Card>
        ) : (
          sortedMenuItems.map((item, index) => {
            const IconComponent = getMenuIcon(item.url)
            const isEditing = editingId === item.id

            return (
              <Card key={item.id} className={`transition-all ${!item.visible ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    {/* Sıra Numarası ve İkon */}
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold">
                        {index + 1}
                      </div>
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        item.visible ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-100 text-gray-400'
                      }`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                    </div>

                    {/* İçerik */}
                    <div className="flex-1 space-y-3">
                      {isEditing ? (
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                          <div>
                            <Label htmlFor={`title-${item.id}`}>Menü Başlığı</Label>
                            <Input
                              id={`title-${item.id}`}
                              value={item.title}
                              onChange={(e) => updateMenuItem(item.id, 'title', e.target.value)}
                              placeholder="Ana Sayfa"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`url-${item.id}`}>URL</Label>
                            <Input
                              id={`url-${item.id}`}
                              value={item.url}
                              onChange={(e) => updateMenuItem(item.id, 'url', e.target.value)}
                              placeholder="/"
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`target-${item.id}`}>Hedef</Label>
                            <select
                              id={`target-${item.id}`}
                              value={item.target}
                              onChange={(e) => updateMenuItem(item.id, 'target', e.target.value)}
                              className="w-full p-2 border rounded-md"
                            >
                              <option value="_self">Aynı sekme</option>
                              <option value="_blank">Yeni sekme</option>
                            </select>
                          </div>
                        </div>
                      ) : (
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold">{item.title}</h3>
                            {item.target === '_blank' && (
                              <ExternalLink className="h-4 w-4 text-gray-400" />
                            )}
                            {item.visible ? (
                              <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                                Görünür
                              </span>
                            ) : (
                              <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">
                                Gizli
                              </span>
                            )}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            {item.url}
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Eylemler */}
                    <div className="flex items-center gap-2">
                      {isEditing ? (
                        <>
                          <Button
                            size="sm"
                            onClick={() => setEditingId(null)}
                          >
                            Tamam
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(null)}
                          >
                            İptal
                          </Button>
                        </>
                      ) : (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveMenuItem(item.id, 'up')}
                            disabled={index === 0}
                          >
                            <ArrowUp className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => moveMenuItem(item.id, 'down')}
                            disabled={index === sortedMenuItems.length - 1}
                          >
                            <ArrowDown className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => setEditingId(item.id)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => toggleVisible(item.id)}
                          >
                            {item.visible ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => deleteMenuItem(item.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>

      {/* Önizleme */}
      {sortedMenuItems.filter(item => item.visible).length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Sitede Nasıl Görünecek</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="p-6 bg-gray-50 rounded-lg">
              <div className="flex flex-wrap gap-6">
                {sortedMenuItems
                  .filter(item => item.visible)
                  .map((item) => {
                    const IconComponent = getMenuIcon(item.url)
                    return (
                      <a
                        key={item.id}
                        href={item.url}
                        target={item.target}
                        className="flex items-center gap-2 text-gray-700 hover:text-indigo-600 transition-colors"
                      >
                        <IconComponent className="h-4 w-4" />
                        {item.title}
                        {item.target === '_blank' && (
                          <ExternalLink className="h-3 w-3" />
                        )}
                      </a>
                    )
                  })}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Kullanım Talimatları */}
      <Card>
        <CardHeader>
          <CardTitle>Kullanım Talimatları</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              1
            </div>
            <div>
              <p className="font-medium">Menü öğesi ekleyin</p>
              <p className="text-sm text-muted-foreground">
                "Yeni Menü" butonuna tıklayarak menü öğelerinizi ekleyin
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              2
            </div>
            <div>
              <p className="font-medium">Sıralamayı ayarlayın</p>
              <p className="text-sm text-muted-foreground">
                Yukarı/aşağı oklarla menü öğelerinin sırasını değiştirin
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              3
            </div>
            <div>
              <p className="font-medium">Görünürlük kontrolü</p>
              <p className="text-sm text-muted-foreground">
                Göz ikonuyla menü öğelerini gizleyip gösterebilirsiniz
              </p>
            </div>
          </div>
          
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-sm font-bold mt-0.5">
              4
            </div>
            <div>
              <p className="font-medium">Hedef belirleme</p>
              <p className="text-sm text-muted-foreground">
                Linklerin aynı sekmede mi, yeni sekmede mi açılacağını belirleyin
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}