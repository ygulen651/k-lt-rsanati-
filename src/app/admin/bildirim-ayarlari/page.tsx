'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function BildirimAyarlariPage() {
  useEffect(() => {
    redirect('/admin/iletisim-yonetimi')
  }, [])

  return null
}
