import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { serialize } from 'next-mdx-remote/serialize'
import readingTime from 'reading-time'

const contentDirectory = path.join(process.cwd(), 'content')

export interface AnnouncementFrontmatter {
  title: string
  description: string
  date: string
  excerpt?: string
  category?: string
  coverImage?: string
  featuredImage?: string
  tags?: string[]
  featured?: boolean
  author?: string
}

export interface EventFrontmatter {
  title: string
  description: string
  date: string
  location: string
  time?: string
  capacity?: number
  category?: string
  registrationUrl?: string
  coverImage?: string
  tags?: string[]
}

export interface CharterFrontmatter {
  title: string
  description: string
  lastUpdated: string
}

export interface ContentItem<T = any> {
  slug: string
  frontmatter: T
  content: string
  readingTime: ReturnType<typeof readingTime>
  url: string
}

export async function getContentByType<T>(
  type: 'duyurular' | 'etkinlikler' | 'tuzuk'
): Promise<ContentItem<T>[]> {
  const contentPath = path.join(contentDirectory, type)
  
  if (!fs.existsSync(contentPath)) {
    return []
  }

  const files = fs.readdirSync(contentPath).filter(file => file.endsWith('.mdx'))
  
  const content = await Promise.all(
    files.map(async (filename) => {
      const filePath = path.join(contentPath, filename)
      const fileContent = fs.readFileSync(filePath, 'utf8')
      const { data: frontmatter, content } = matter(fileContent)
      
      const slug = filename.replace('.mdx', '')
      const readingTimeData = readingTime(content)
      
      let url = ''
      if (type === 'tuzuk') {
        url = '/tuzuk'
      } else {
        url = `/${type}/${slug}`
      }

      return {
        slug,
        frontmatter: frontmatter as T,
        content,
        readingTime: readingTimeData,
        url,
      }
    })
  )

  // Tarihe göre sırala (en yeni önce)
  return content.sort((a, b) => {
    const dateA = new Date((a.frontmatter as any).date || (a.frontmatter as any).lastUpdated)
    const dateB = new Date((b.frontmatter as any).date || (b.frontmatter as any).lastUpdated)
    return dateB.getTime() - dateA.getTime()
  })
}

export async function getContentBySlug<T>(
  type: 'duyurular' | 'etkinlikler' | 'tuzuk',
  slug: string
): Promise<ContentItem<T> | null> {
  try {
    const filePath = path.join(contentDirectory, type, `${slug}.mdx`)
    
    if (!fs.existsSync(filePath)) {
      return null
    }

    const fileContent = fs.readFileSync(filePath, 'utf8')
    const { data: frontmatter, content } = matter(fileContent)
    
    const readingTimeData = readingTime(content)
    
    let url = ''
    if (type === 'tuzuk') {
      url = '/tuzuk'
    } else {
      url = `/${type}/${slug}`
    }

    return {
      slug,
      frontmatter: frontmatter as T,
      content,
      readingTime: readingTimeData,
      url,
    }
  } catch (error) {
    console.error(`Error reading ${type}/${slug}:`, error)
    return null
  }
}

export async function serializeMDX(content: string) {
  return await serialize(content, {
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
  })
}

export function isNewContent(date: string): boolean {
  const publishDate = new Date(date)
  const now = new Date()
  const diffTime = Math.abs(now.getTime() - publishDate.getTime())
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= 14
}

export function isPastEvent(date: string): boolean {
  return new Date(date) < new Date()
}

export function formatDate(dateString: string): string {
  const date = new Date(dateString)
  return date.toLocaleDateString('tr-TR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}
