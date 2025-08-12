"use client"

import { useState, useCallback } from "react"
import { Upload, Copy, Check, X, Image as ImageIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CLOUDINARY_CONFIG } from "@/lib/cloudinary"

interface UploadedImage {
  public_id: string
  secure_url: string
  url: string
  format: string
  width: number
  height: number
  bytes: number
  created_at: string
}

export function UploadWidget() {
  const [uploadedImages, setUploadedImages] = useState<UploadedImage[]>([])
  const [isUploading, setIsUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null)

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }, [])

  const uploadToCloudinary = async (file: File) => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append('upload_preset', CLOUDINARY_CONFIG.uploadPreset)
    formData.append('folder', CLOUDINARY_CONFIG.folder)

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CONFIG.cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    )

    if (!response.ok) {
      throw new Error('Upload failed')
    }

    return response.json()
  }

  const handleFiles = async (files: FileList | null) => {
    if (!files) return

    setIsUploading(true)
    const newImages: UploadedImage[] = []

    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith('image/')) {
          const result = await uploadToCloudinary(file)
          newImages.push(result)
        }
      }
      setUploadedImages(prev => [...newImages, ...prev])
    } catch (error) {
      console.error('Upload error:', error)
      alert('Yükleme sırasında bir hata oluştu!')
    } finally {
      setIsUploading(false)
      setDragActive(false)
    }
  }

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }, [])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    handleFiles(e.target.files)
  }

  const copyToClipboard = async (url: string) => {
    try {
      await navigator.clipboard.writeText(url)
      setCopiedUrl(url)
      setTimeout(() => setCopiedUrl(null), 2000)
    } catch (error) {
      console.error('Copy failed:', error)
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className="space-y-6">
      {/* Upload Area */}
      <Card className={`border-2 border-dashed transition-colors ${
        dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
      }`}>
        <CardContent className="p-8">
          <div
            className="text-center space-y-4"
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
          >
            <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Upload className="h-8 w-8 text-primary" />
            </div>
            
            <div>
              <h3 className="text-lg font-semibold mb-2">
                Görselleri Yükle
              </h3>
              <p className="text-muted-foreground mb-4">
                Dosyaları buraya sürükleyip bırakın veya seçmek için tıklayın
              </p>
              
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleChange}
                className="hidden"
                id="file-upload"
                disabled={isUploading}
              />
              
              <Button 
                asChild 
                disabled={isUploading}
                className="cursor-pointer"
              >
                <label htmlFor="file-upload">
                  {isUploading ? 'Yükleniyor...' : 'Dosya Seç'}
                </label>
              </Button>
            </div>
            
            <p className="text-xs text-muted-foreground">
              Desteklenen formatlar: JPG, PNG, GIF, WebP
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Uploaded Images */}
      {uploadedImages.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ImageIcon className="h-5 w-5" />
              Yüklenen Görseller ({uploadedImages.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadedImages.map((image) => (
                <div key={image.public_id} className="flex items-start gap-4 p-4 border rounded-lg">
                  <img
                    src={image.secure_url}
                    alt="Uploaded"
                    className="w-20 h-20 object-cover rounded"
                  />
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {image.format.toUpperCase()}
                      </Badge>
                      <Badge variant="outline">
                        {image.width} × {image.height}
                      </Badge>
                      <Badge variant="outline">
                        {formatFileSize(image.bytes)}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <code className="flex-1 text-sm bg-muted p-2 rounded text-muted-foreground break-all">
                        {image.secure_url}
                      </code>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => copyToClipboard(image.secure_url)}
                        className="shrink-0"
                      >
                        {copiedUrl === image.secure_url ? (
                          <Check className="h-4 w-4" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
