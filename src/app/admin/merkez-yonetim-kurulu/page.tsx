"use client"

import GroupManagement from '../yonetim/_components/GroupManagement'

export default function AdminMerkezYonetimKuruluPage() {
  return (
    <GroupManagement group="merkez-yonetim-kurulu" apiPath="/api/boards/merkez-yonetim-kurulu" showActions />
  )
}

