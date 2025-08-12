/*
  Migration script: Moves static content (MDX/JSON) into MongoDB.
  Usage: npm run migrate:db
*/
import fs from 'fs'
import path from 'path'
import dotenv from 'dotenv'
import connectDB from '../src/lib/mongodb'
import Announcement from '../src/models/Announcement'
import Event from '../src/models/Event'
import PressItem from '../src/models/PressItem'
import Media from '../src/models/Media'
import Member from '../src/models/Member'
import Document from '../src/models/Document'
import Slider from '../src/models/Slider'
import KamuAr from '../src/models/KamuAr'
import { fileURLToPath } from 'url'

const root = path.resolve(process.cwd())
const envLocal = path.join(root, '.env.local')
const envDefault = path.join(root, '.env')
dotenv.config({ path: fs.existsSync(envLocal) ? envLocal : envDefault })
const dataDir = path.join(root, 'data')
const contentDir = path.join(root, 'content')

function readJsonSafe<T = any>(p: string): T | [] {
  try { return JSON.parse(fs.readFileSync(p, 'utf8')) } catch { return [] as any }
}

async function migrateAnnouncements() {
  const file = path.join(dataDir, 'announcements.json')
  const items = readJsonSafe<any[]>(file)
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
  }
  console.log(`Announcements migrated: ${items.length}`)
}

async function migrateEvents() {
  const file = path.join(dataDir, 'events.json')
  const items = readJsonSafe<any[]>(file)
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
  }
  console.log(`Events migrated: ${items.length}`)
}

async function migratePress() {
  const file = path.join(dataDir, 'press.json')
  const items = readJsonSafe<any[]>(file)
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
  }
  console.log(`Press items migrated: ${items.length}`)
}

async function migrateDocuments() {
  const file = path.join(dataDir, 'documents.json')
  const items = readJsonSafe<any[]>(file)
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
  }
  console.log(`Documents migrated: ${items.length}`)
}

async function migrateGallery() {
  const file = path.join(dataDir, 'gallery.json')
  const items = readJsonSafe<any[]>(file)
  let count = 0
  for (const g of items) {
    const exists = await Media.findOne({ url: g.url })
    if (exists) continue
    await Media.create({ title: g.title || 'Görsel', type: 'image', url: g.url })
    count++
  }
  console.log(`Gallery media migrated: ${count}`)
}

async function migrateMembers() {
  const file = path.join(dataDir, 'members.json')
  const items = readJsonSafe<any[]>(file)
  let count = 0
  for (const m of items) {
    const exists = await Member.findOne({ email: m.email })
    if (exists) continue
    await Member.create({
      name: m.name,
      email: m.email,
      phone: m.phone,
      title: m.title,
      avatar: m.avatar,
      status: m.status || 'active'
    })
    count++
  }
  console.log(`Members migrated: ${count}`)
}

async function migrateKamuAr() {
  const dir = path.join(contentDir, 'kamu-ar')
  if (!fs.existsSync(dir)) return
  // Placeholder: if JSON exists later
}

async function migrateSliders() {
  // If you have json sliders in data, import here; otherwise skip
}

async function main() {
  await connectDB()
  await migrateAnnouncements()
  await migrateEvents()
  await migratePress()
  await migrateDocuments()
  await migrateGallery()
  await migrateMembers()
  console.log('Migration finished.')
  process.exit(0)
}

main().catch((e) => { console.error(e); process.exit(1) })


