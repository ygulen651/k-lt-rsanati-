'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function SiteIstatistikleriPage() {
  useEffect(() => {
    redirect('/admin/analitik')
  }, [])

  return null
}
