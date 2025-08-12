"use client"

import GroupManagement from '../yonetim/_components/GroupManagement'

export default function AdminMerkezDenetlemeKuruluPage() {
  return (
    <GroupManagement group="merkez-denetleme-kurulu" apiPath="/api/boards/merkez-denetleme-kurulu" showActions />
  )
}

