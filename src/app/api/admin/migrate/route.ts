import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import connectDB from '@/lib/mongodb'
import Announcement from '@/models/Announcement'
import Event from '@/models/Event'
import PressItem from '@/models/PressItem'
import Media from '@/models/Media'
import Member from '@/models/Member'
import Document from '@/models/Document'
import { authenticate, requireEditor } from '@/lib/auth'
import BoardMember from '@/models/BoardMember'

function readJsonSafe<T = any>(p: string): T | [] {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')) } catch { return [] as any }
}

export async function POST(request: NextRequest) {
  try {
    const user = await authenticate(request)
    if (!user || !requireEditor(user)) {
      return NextResponse.json({ success: false, message: 'Yetkisiz erişim' }, { status: 401 })
    }

    await connectDB()

    const root = process.cwd()
    const dataDir = path.join(root, 'data')

    const report: Record<string, number> = {}

    // Announcements (duyurular)
    try {
      const items = readJsonSafe<any[]>(path.join(dataDir, 'announcements.json'))
      let n = 0
      for (const a of items) {
        const exists = await Announcement.findOne({ slug: a.slug })
        if (exists) continue
        await Announcement.create({
          title: a.title,
          slug: a.slug,
          excerpt: a.excerpt || a.description || '',
          content: a.content || '',
          category: a.category || 'genel',
          tags: a.tags || [],
          featuredImage: a.featuredImage,
          images: a.images || [],
          fileUrl: a.fileUrl,
          status: a.status || 'published',
          featured: !!a.featured,
          publishDate: a.publishDate ? new Date(a.publishDate) : new Date(),
          author: a.author || 'Admin'
        })
        n++
      }
      report.announcements = n
    } catch {}

    // Events (etkinlikler)
    try {
      const items = readJsonSafe<any[]>(path.join(dataDir, 'events.json'))
      let n = 0
      for (const e of items) {
        const exists = await Event.findOne({ slug: e.slug })
        if (exists) continue
        await Event.create({
          title: e.title,
          slug: e.slug || e.title?.toLowerCase().replace(/[^a-z0-9\s-]/g,'').replace(/\s+/g,'-'),
          description: e.description || '',
          date: new Date(e.date),
          time: e.time || '00:00',
          endDate: e.endDate ? new Date(e.endDate) : undefined,
          endTime: e.endTime,
          location: e.location || '',
          address: e.address,
          category: e.category || 'toplanti',
          status: e.status || 'published',
          featured: !!e.featured,
          maxParticipants: e.maxParticipants,
          registrationRequired: !!e.registrationRequired,
          contactEmail: e.contactEmail,
          contactPhone: e.contactPhone,
          featuredImage: e.featuredImage,
          createdBy: 'Admin'
        })
        n++
      }
      report.events = n
    } catch {}

    // Press (basın-yayın)
    try {
      const items = readJsonSafe<any[]>(path.join(dataDir, 'press.json'))
      let n = 0
      for (const p of items) {
        const exists = await PressItem.findOne({ title: p.title, category: p.category })
        if (exists) continue
        await PressItem.create({
          title: p.title,
          type: p.type || 'online',
          outlet: p.outlet || p.category || 'online',
          date: new Date(p.date || Date.now()),
          status: p.status || 'published',
          url: p.url,
          fileUrl: p.fileUrl,
          thumbnail: p.thumbnail,
          images: p.images || [],
          summary: p.summary,
          category: p.category
        })
        n++
      }
      report.press = n
    } catch {}

    // Documents (bilgi-belge)
    try {
      const items = readJsonSafe<any[]>(path.join(dataDir, 'documents.json'))
      let n = 0
      for (const d of items) {
        const exists = await Document.findOne({ title: d.title })
        if (exists) continue
        await Document.create({
          title: d.title,
          description: d.description,
          category: d.category,
          date: d.date ? new Date(d.date) : new Date(),
          fileUrl: d.fileUrl,
          status: d.status || 'published'
        })
        n++
      }
      report.documents = n
    } catch {}

    // Gallery (galeri)
    try {
      const items = readJsonSafe<any[]>(path.join(dataDir, 'gallery.json'))
      let n = 0
      for (const g of items) {
        const exists = await Media.findOne({ url: g.url })
        if (exists) continue
        await Media.create({ title: g.title || 'Görsel', type: 'image', url: g.url })
        n++
      }
      report.media = n
    } catch {}

    // Members (üyeler)
    try {
      const items = readJsonSafe<any[]>(path.join(dataDir, 'members.json'))
      let n = 0
      for (const m of items) {
        const exists = await Member.findOne({ email: m.email })
        if (exists) continue
        await Member.create(m)
        n++
      }
      report.members = n
    } catch {}

    // Board Members (content/yonetim JSON'dan)
    try {
      const f1 = path.join(root, 'content', 'yonetim', 'yonetim-kurulu.json')
      const fMain = path.join(root, 'content', 'yonetim', 'yonetim-kurulu-main.json')
      const arr1 = readJsonSafe<any[]>(f1)
      const arr2 = readJsonSafe<any[]>(fMain)
      const items = [...arr1, ...arr2].filter(Boolean)
      let n = 0
      for (const b of items) {
        if (!b?.name || !b?.position) continue
        const group = (b.group as any) || 'yonetim-kurulu'
        const exists = await BoardMember.findOne({ name: b.name, position: b.position, group })
        if (exists) continue
        await BoardMember.create({
          name: b.name, position: b.position, bio: b.bio, photo: b.photo, email: b.email, phone: b.phone, group, order: b.order || 0
        })
        n++
      }
      report.board = n
    } catch {}

    return NextResponse.json({ success: true, report })
  } catch (e) {
    console.error('Migration error:', e)
    return NextResponse.json({ success: false, message: 'Migrasyon hatası' }, { status: 500 })
  }
}


