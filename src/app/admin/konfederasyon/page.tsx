'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Save, Plus, Edit, Trash2, ExternalLink, Users, Building, Globe } from 'lucide-react'

interface ConfederationMember {
  id: number
  name: string
  website: string
  description: string
  logo: string
  memberCount: number
  founded: string
  active: boolean
}

export default function KonfederasyonPage() {
  const [saving, setSaving] = useState(false)
  const [members, setMembers] = useState<ConfederationMember[]>([
    {
      id: 1,
      name: 'Birleşik Kamu İş',
      website: 'https://www.birlesikkamuis.org.tr/',
      description: 'Kamu çalışanlarının ana konfederasyonu',
      logo: '/confederation-logos/birlesik-kamu-is.png',
      memberCount: 450000,
      founded: '1995',
      active: true
    },
    {
      id: 2,
      name: 'Büro-İş',
      website: 'https://www.burois.org.tr/',
      description: 'Büro işçileri sendikası',
      logo: '/confederation-logos/buro-is.png',
      memberCount: 75000,
      founded: '1963',
      active: true
    },
    {
      id: 3,
      name: 'Eğitim-İş',
      website: 'https://www.egitimis.org.tr/',
      description: 'Eğitim çalışanları sendikası',
      logo: '/confederation-logos/egitim-is.png',
      memberCount: 120000,
      founded: '1965',
      active: true
    },
    {
      id: 4,
      name: 'Genel Sağlık-İş',
      website: 'https://www.genelsaglikis.org.tr/',
      description: 'Sağlık çalışanları sendikası',
      logo: '/confederation-logos/genel-saglik-is.png',
      memberCount: 95000,
      founded: '1970',
      active: true
    }
  ])

  const handleSave = async () => {
    setSaving(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      alert('Konfederasyon bilgileri başarıyla kaydedildi!')
    } catch (error) {
      alert('Kaydetme sırasında bir hata oluştu!')
    } finally {
      setSaving(false)
    }
  }

  const toggleActive = (id: number) => {
    setMembers(members.map(member => 
      member.id === id ? { ...member, active: !member.active } : member
    ))
  }

  const deleteMember = (id: number) => {
    if (confirm('Bu konfederasyon üyesini silmek istediğinizden emin misiniz?')) {
      setMembers(members.filter(member => member.id !== id))
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Building className="h-8 w-8 text-purple-600" />
            Konfederasyon Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">Konfederasyon üyelerini yönetin</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline">
            <Plus className="h-4 w-4 mr-2" />
            Yeni Üye Ekle
          </Button>
          <Button onClick={handleSave} disabled={saving}>
            <Save className="h-4 w-4 mr-2" />
            {saving ? 'Kaydediliyor...' : 'Kaydet'}
          </Button>
        </div>
      </div>

      {/* İstatistikler */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Building className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Toplam Üye</h3>
            <p className="text-2xl font-bold">{members.filter(m => m.active).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Toplam Çalışan</h3>
            <p className="text-2xl font-bold">
              {members.reduce((total, member) => total + member.memberCount, 0).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Globe className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Aktif Siteler</h3>
            <p className="text-2xl font-bold">{members.filter(m => m.active && m.website).length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Building className="h-12 w-12 text-orange-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Kuruluş Yılı</h3>
            <p className="text-2xl font-bold">1995</p>
          </CardContent>
        </Card>
      </div>

      {/* Konfederasyon Üyeleri */}
      <Card>
        <CardHeader>
          <CardTitle>Konfederasyon Üyeleri</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {members.map((member) => (
              <Card key={member.id} className={`${!member.active ? 'opacity-60' : ''}`}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <Building className="h-6 w-6 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold">{member.name}</h3>
                        <p className="text-sm text-muted-foreground">Kuruluş: {member.founded}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant={member.active ? 'default' : 'secondary'}>
                        {member.active ? 'Aktif' : 'Pasif'}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-sm text-muted-foreground mb-4">{member.description}</p>

                  <div className="flex items-center justify-between mb-4">
                    <div className="text-sm">
                      <span className="font-medium">{member.memberCount.toLocaleString()}</span>
                      <span className="text-muted-foreground"> üye</span>
                    </div>
                    {member.website && (
                      <a
                        href={member.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 hover:text-blue-800 flex items-center gap-1 text-sm"
                      >
                        <Globe className="h-3 w-3" />
                        Website
                        <ExternalLink className="h-3 w-3" />
                      </a>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="outline">
                      <Edit className="h-3 w-3 mr-1" />
                      Düzenle
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => toggleActive(member.id)}
                    >
                      {member.active ? 'Pasif Yap' : 'Aktif Yap'}
                    </Button>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => deleteMember(member.id)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Konfederasyon Hakkında */}
      <Card>
        <CardHeader>
          <CardTitle>Konfederasyon Hakkında</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="about">Hakkımızda Metni</Label>
            <Textarea
              id="about"
              placeholder="Konfederasyon hakkında açıklama yazın..."
              className="min-h-[120px]"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="mission">Misyon</Label>
              <Textarea
                id="mission"
                placeholder="Konfederasyon misyonu..."
                className="min-h-[80px]"
              />
            </div>
            <div>
              <Label htmlFor="vision">Vizyon</Label>
              <Textarea
                id="vision"
                placeholder="Konfederasyon vizyonu..."
                className="min-h-[80px]"
              />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
