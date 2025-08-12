"use client"

import { useParams } from 'next/navigation'
import GroupManagement from '../_components/GroupManagement'

export default function GroupManagementPage() {
  const params = useParams() as { group: string }
  const group = decodeURIComponent(params.group || '')
  return <GroupManagement group={group} />
}
