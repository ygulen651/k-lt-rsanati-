'use client'

import { redirect } from 'next/navigation'
import { useEffect } from 'react'

export default function IcerikPerformansiPage() {
  useEffect(() => {
    redirect('/admin/analitik')
  }, [])

  return null
}
