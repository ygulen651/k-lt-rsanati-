'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function ZiyaretciAnaliziPage() {
  useEffect(() => {
    redirect('/admin/analitik')
  }, [])

  return null
}
