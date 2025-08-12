'use client'

import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { UserCheck, Mail, Bell, Users, Calendar } from 'lucide-react'

export default function AbonelikYonetimiPage() {
  const [subscribers] = useState([
    { id: 1, email: 'ahmet@example.com', name: 'Ahmet Yılmaz', status: 'active', joinDate: '2024-01-15' },
    { id: 2, email: 'fatma@example.com', name: 'Fatma Demir', status: 'active', joinDate: '2024-01-10' },
    { id: 3, email: 'mehmet@example.com', name: 'Mehmet Kaya', status: 'inactive', joinDate: '2024-01-05' }
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <UserCheck className="h-8 w-8 text-green-600" />
            Abonelik Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">E-posta abonelerini yönetin</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <Users className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Toplam Abone</h3>
            <p className="text-2xl font-bold">{subscribers.length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <UserCheck className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Aktif Aboneler</h3>
            <p className="text-2xl font-bold">{subscribers.filter(s => s.status === 'active').length}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Mail className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Bu Ay Yeni</h3>
            <p className="text-2xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Aboneler</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {subscribers.map((subscriber) => (
              <div key={subscriber.id} className="flex items-center justify-between p-4 border rounded-lg">
                <div>
                  <h4 className="font-medium">{subscriber.name}</h4>
                  <p className="text-sm text-muted-foreground">{subscriber.email}</p>
                  <p className="text-xs text-muted-foreground">Katılım: {subscriber.joinDate}</p>
                </div>
                <div className="flex items-center gap-2">
                  <Badge variant={subscriber.status === 'active' ? 'default' : 'secondary'}>
                    {subscriber.status === 'active' ? 'Aktif' : 'Pasif'}
                  </Badge>
                  <Button size="sm" variant="outline">
                    <Mail className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
