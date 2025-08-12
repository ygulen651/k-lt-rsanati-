"use client"

import GroupManagement from '../yonetim/_components/GroupManagement'

export default function AdminYonetimKuruluPage() {
  return (
    <GroupManagement group="yonetim-kurulu" apiPath="/api/boards/yonetim-kurulu" showActions />
  )
}

