'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Textarea } from '@/components/ui/textarea'
import { BookOpen, Save, Edit, Eye } from 'lucide-react'

export default function TuzukPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [tuzukContent, setTuzukContent] = useState(`
# SENDİKA TÜZÜĞÜ

## 1. GENEL HÜKÜMLER

### Madde 1 - Sendikanın Adı ve Merkezi
Bu sendikanın adı "Kültür Sanat İş"dir. Merkezi Ankara'dır.

### Madde 2 - Amaç ve Görev
Sendikamızın amacı, kamu çalışanlarının ekonomik ve sosyal durumlarını iyileştirmek, haklarını korumak ve geliştirmektir.

## 2. ÜYELİK

### Madde 3 - Üyelik Şartları
Sendikaya üye olmak için:
- Kamu çalışanı olmak
- 18 yaşını doldurmuş olmak
- Başvuru formunu doldurmak gerekir

### Madde 4 - Üyelik Hakları
Üyeler aşağıdaki haklara sahiptir:
- Sendika faaliyetlerine katılma
- Genel kurula katılma ve oy verme
- Yönetim organlarına seçilme

## 3. ORGANLAR

### Madde 5 - Genel Kurul
Genel kurul, sendikanın en yüksek karar organıdır.

### Madde 6 - Yönetim Kurulu
Yönetim kurulu 7 asil ve 3 yedek üyeden oluşur.

### Madde 7 - Denetleme Kurulu
Denetleme kurulu 3 asil ve 2 yedek üyeden oluşur.

## 4. MALİ HÜKÜMLER

### Madde 8 - Gelirler
Sendikanın gelirleri:
- Üye aidatları
- Bağışlar
- Diğer yasal gelirler

## 5. SON HÜKÜMLER

### Madde 9 - Tüzük Değişikliği
Bu tüzük, genel kurulda üye tam sayısının salt çoğunluğu ile değiştirilebilir.

### Madde 10 - Yürürlük
Bu tüzük [Tarih] tarihinde yürürlüğe girer.
  `)

  const handleSave = () => {
    console.log('Tüzük kaydediliyor...', tuzukContent)
    alert('Tüzük başarıyla kaydedildi!')
    setIsEditing(false)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <BookOpen className="h-8 w-8 text-purple-600" />
            Tüzük Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">
            Sendika tüzüğünü görüntüleyin ve düzenleyin
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => window.open('/tuzuk', '_blank')}>
            <Eye className="h-4 w-4 mr-2" />
            Önizleme
          </Button>
          
          <Button
            variant={isEditing ? "default" : "outline"}
            onClick={() => setIsEditing(!isEditing)}
          >
            <Edit className="h-4 w-4 mr-2" />
            {isEditing ? 'Düzenlemeyi Bitir' : 'Düzenle'}
          </Button>
          
          {isEditing && (
            <Button onClick={handleSave}>
              <Save className="h-4 w-4 mr-2" />
              Kaydet
            </Button>
          )}
        </div>
      </div>

      {/* Tüzük İçeriği */}
      <Card>
        <CardHeader>
          <CardTitle>Sendika Tüzüğü</CardTitle>
        </CardHeader>
        <CardContent>
          {isEditing ? (
            <Textarea
              value={tuzukContent}
              onChange={(e) => setTuzukContent(e.target.value)}
              className="min-h-[600px] font-mono"
              placeholder="Tüzük içeriğini buraya yazın..."
            />
          ) : (
            <div className="prose max-w-none">
              <pre className="whitespace-pre-wrap text-sm">{tuzukContent}</pre>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Durum Mesajı */}
      {isEditing && (
        <div className="fixed bottom-4 right-4 bg-purple-600 text-white px-4 py-2 rounded-lg shadow-lg">
          <div className="flex items-center gap-2">
            <Edit className="h-4 w-4" />
            Tüzük düzenleme modu aktif
          </div>
        </div>
      )}
    </div>
  )
}



