import { NextRequest, NextResponse } from 'next/server'
import fs from 'fs'
import path from 'path'
import jwt from 'jsonwebtoken'

const GROUP = 'yonetim-kurulu'
const STORAGE = path.join(process.cwd(), 'content', 'yonetim', 'yonetim-kurulu.json')

function readAll(): any[] {
  if (!fs.existsSync(STORAGE)) return []
  const fileContents = fs.readFileSync(STORAGE, 'utf8')
  try { return JSON.parse(fileContents) } catch { return [] }
}

function writeAll(all: any[]) {
  fs.writeFileSync(STORAGE, JSON.stringify(all, null, 2), 'utf8')
}

export async function GET(_req: NextRequest, { params }: { params: { id: string } }) {
  const all = readAll()
  const item = all.find((m) => m.id === params.id && (m.group || '') === GROUP)
  if (!item) {
    return NextResponse.json({ success: false, message: 'Kayıt bulunamadı' }, { status: 404 })
  }
  return NextResponse.json({ success: true, data: item })
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    try { jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') } catch { return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 }) }

    const body = await request.json()
    const all = readAll()
    const idx = all.findIndex((m) => m.id === params.id && (m.group || '') === GROUP)
    if (idx === -1) return NextResponse.json({ success: false, message: 'Kayıt bulunamadı' }, { status: 404 })

    const updated = { ...all[idx], ...body, id: params.id, group: GROUP }
    all[idx] = updated
    writeAll(all)

    return NextResponse.json({ success: true, data: updated })
  } catch (e) {
    console.error('PUT error:', e)
    return NextResponse.json({ success: false, message: 'Sunucu hatası' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const token = request.headers.get('authorization')?.replace('Bearer ', '')
    if (!token) return NextResponse.json({ success: false, message: 'Token gerekli' }, { status: 401 })
    try { jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret') } catch { return NextResponse.json({ success: false, message: 'Geçersiz token' }, { status: 401 }) }

    const all = readAll()
    const before = all.length
    const remaining = all.filter((m) => !(m.id === params.id && (m.group || '') === GROUP))
    if (remaining.length === before) return NextResponse.json({ success: false, message: 'Kayıt bulunamadı' }, { status: 404 })
    writeAll(remaining)
    return NextResponse.json({ success: true })
  } catch (e) {
    console.error('DELETE error:', e)
    return NextResponse.json({ success: false, message: 'Sunucu hatası' }, { status: 500 })
  }
}
