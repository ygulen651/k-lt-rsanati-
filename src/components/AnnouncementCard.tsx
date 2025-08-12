import Link from "next/link"
import Image from "next/image"
import { Calendar, Clock } from "lucide-react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { isNewContent } from "@/lib/mdx"
import type { AnnouncementFrontmatter } from "@/lib/mdx"

interface AnnouncementCardProps {
  announcement: {
    slug?: string
    frontmatter?: AnnouncementFrontmatter
    readingTime?: { text: string }
    url?: string
    // API formatı için
    _id?: string
    title?: string
    excerpt?: string
    content?: string
    featuredImage?: string
    publishDate?: string
    author?: string
    category?: string
    tags?: string[]
    featured?: boolean
  }
  featured?: boolean
}

export function AnnouncementCard({ announcement, featured = false }: AnnouncementCardProps) {
  // MDX ve API formatlarını destekle
  const slug = announcement.slug || announcement._id || ''
  const frontmatter = announcement.frontmatter
  const readingTime = announcement.readingTime || { text: '5 dk okuma' }
  const url = announcement.url || `/duyurular/${slug}`
  
  // Tarih bilgisi - MDX veya API formatından al
  const dateString = frontmatter?.date || announcement.publishDate
  const isNew = dateString ? isNewContent(dateString) : false

  return (
    <Card className={cn(
      "group hover:shadow-lg transition-all duration-300 overflow-hidden",
      featured && "border-primary/20 bg-primary/5"
    )}>
      <Link href={url} className="block">
        {(frontmatter?.coverImage || announcement.featuredImage) && (
          <div className="relative aspect-[16/9] overflow-hidden">
            <Image
              src={frontmatter?.coverImage || announcement.featuredImage || ''}
              alt={frontmatter?.title || announcement.title || 'Duyuru'}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
            {isNew && (
              <Badge className="absolute top-3 left-3 bg-red-500 hover:bg-red-600">
                Yeni
              </Badge>
            )}
            {(frontmatter?.featured || announcement.featured) && (
              <Badge className="absolute top-3 right-3 bg-primary hover:bg-primary/90">
                Öne Çıkan
              </Badge>
            )}
          </div>
        )}
        
        <CardHeader className="pb-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
            <Calendar className="h-4 w-4" />
            <time dateTime={dateString}>
              {dateString ? new Date(dateString).toLocaleDateString('tr-TR', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              }) : 'Tarih belirtilmemiş'}
            </time>
            <Clock className="h-4 w-4 ml-2" />
            <span>{readingTime.text}</span>
          </div>
          
          <h3 className={cn(
            "font-semibold group-hover:text-primary transition-colors line-clamp-2",
            featured ? "text-lg" : "text-base"
          )}>
            {frontmatter?.title || announcement.title || 'Başlık bulunamadı'}
          </h3>
        </CardHeader>

        <CardContent className="pt-0">
          <p className="text-muted-foreground text-sm line-clamp-3 mb-4">
            {frontmatter?.description || announcement.excerpt || 'Açıklama bulunamadı'}
          </p>
          
          {((frontmatter?.tags && frontmatter.tags.length > 0) || (announcement.tags && announcement.tags.length > 0)) && (
            <div className="flex flex-wrap gap-1">
              {(frontmatter?.tags || announcement.tags || []).slice(0, 3).map((tag, index) => (
                <Badge key={tag || index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {(frontmatter?.tags || announcement.tags || []).length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{(frontmatter?.tags || announcement.tags || []).length - 3}
                </Badge>
              )}
            </div>
          )}
        </CardContent>
      </Link>
    </Card>
  )
}
