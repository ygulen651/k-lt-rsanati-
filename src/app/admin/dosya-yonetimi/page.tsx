'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { 
  Folder, 
  File, 
  Upload, 
  Download, 
  Trash2, 
  Search,
  Image as ImageIcon,
  FileText,
  Video,
  Music
} from 'lucide-react'

interface FileItem {
  id: string
  name: string
  type: 'file' | 'folder'
  size?: string
  modified: string
  extension?: string
}

export default function DosyaYonetimiPage() {
  const [files, setFiles] = useState<FileItem[]>([
    { id: '1', name: 'uploads', type: 'folder', modified: '2024-01-15' },
    { id: '2', name: 'images', type: 'folder', modified: '2024-01-14' },
    { id: '3', name: 'documents', type: 'folder', modified: '2024-01-13' },
    { id: '4', name: 'logo.png', type: 'file', size: '45 KB', modified: '2024-01-15', extension: 'png' },
    { id: '5', name: 'brochure.pdf', type: 'file', size: '2.3 MB', modified: '2024-01-14', extension: 'pdf' },
    { id: '6', name: 'video.mp4', type: 'file', size: '15.7 MB', modified: '2024-01-12', extension: 'mp4' }
  ])
  const [searchTerm, setSearchTerm] = useState('')
  const [uploading, setUploading] = useState(false)

  const filteredFiles = files.filter(file => 
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getFileIcon = (file: FileItem) => {
    if (file.type === 'folder') return Folder
    
    const ext = file.extension?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return ImageIcon
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return Video
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) return Music
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return FileText
    return File
  }

  const getFileTypeColor = (file: FileItem) => {
    if (file.type === 'folder') return 'text-blue-600'
    
    const ext = file.extension?.toLowerCase()
    if (['jpg', 'jpeg', 'png', 'gif', 'webp'].includes(ext || '')) return 'text-green-600'
    if (['mp4', 'avi', 'mov', 'wmv'].includes(ext || '')) return 'text-purple-600'
    if (['mp3', 'wav', 'ogg'].includes(ext || '')) return 'text-orange-600'
    if (['pdf', 'doc', 'docx', 'txt'].includes(ext || '')) return 'text-red-600'
    return 'text-gray-600'
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      
      const response = await fetch('/api/media', {
        method: 'POST',
        body: formData
      })
      
      if (response.ok) {
        const result = await response.json()
        alert('Dosya başarıyla yüklendi!')
        // Refresh file list
        window.location.reload()
      } else {
        alert('Dosya yükleme hatası!')
      }
    } catch (error) {
      console.error('Upload error:', error)
      alert('Dosya yükleme hatası!')
    } finally {
      setUploading(false)
    }
  }

  const handleDelete = (fileId: string) => {
    if (confirm('Bu dosyayı silmek istediğinizden emin misiniz?')) {
      setFiles(files.filter(f => f.id !== fileId))
      alert('Dosya silindi!')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-2">
            <Folder className="h-8 w-8 text-blue-600" />
            Dosya Yönetimi
          </h1>
          <p className="text-muted-foreground mt-2">Site dosyalarını yönetin</p>
        </div>
        <div className="flex items-center gap-3">
          <input
            type="file"
            onChange={handleFileUpload}
            className="hidden"
            id="file-upload"
          />
          <Button
            onClick={() => document.getElementById('file-upload')?.click()}
            disabled={uploading}
          >
            <Upload className="h-4 w-4 mr-2" />
            {uploading ? 'Yükleniyor...' : 'Dosya Yükle'}
          </Button>
        </div>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Dosyalar</CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="h-4 w-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Dosya ara..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredFiles.map((file) => {
              const IconComponent = getFileIcon(file)
              const colorClass = getFileTypeColor(file)
              
              return (
                <div
                  key={file.id}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer"
                >
                  <div className="flex items-start justify-between mb-3">
                    <IconComponent className={`h-8 w-8 ${colorClass}`} />
                    <div className="flex items-center gap-1">
                      <Button size="sm" variant="outline" className="h-8 w-8 p-0">
                        <Download className="h-3 w-3" />
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="h-8 w-8 p-0"
                        onClick={() => handleDelete(file.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium truncate mb-1">{file.name}</h4>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>{file.modified}</span>
                      {file.size && <Badge variant="secondary" className="text-xs">{file.size}</Badge>}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
          
          {filteredFiles.length === 0 && (
            <div className="text-center py-12">
              <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-muted-foreground">
                {searchTerm ? 'Arama kriterlerine uygun dosya bulunamadı' : 'Henüz dosya yüklenmemiş'}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6 text-center">
            <ImageIcon className="h-12 w-12 text-green-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Görseller</h3>
            <p className="text-2xl font-bold">24</p>
            <p className="text-sm text-muted-foreground">Toplam görsel</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <FileText className="h-12 w-12 text-blue-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Belgeler</h3>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-muted-foreground">Toplam belge</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6 text-center">
            <Video className="h-12 w-12 text-purple-600 mx-auto mb-3" />
            <h3 className="font-semibold mb-2">Videolar</h3>
            <p className="text-2xl font-bold">8</p>
            <p className="text-sm text-muted-foreground">Toplam video</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
