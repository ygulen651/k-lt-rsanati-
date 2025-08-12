"use client"

import GroupManagement from '../yonetim/_components/GroupManagement'

export default function AdminMerkezDisiplinKuruluPage() {
  return (
    <GroupManagement group="merkez-disiplin-kurulu" apiPath="/api/boards/merkez-disiplin-kurulu" showActions />
  )
}

