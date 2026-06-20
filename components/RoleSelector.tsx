'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Role } from '@/lib/types'

export default function RoleSelector({ profileId, currentRole }: { profileId: string; currentRole: Role }) {
  const [role, setRole] = useState<Role>(currentRole)
  const [saving, setSaving] = useState(false)
  const router = useRouter()

  async function handleChange(newRole: Role) {
    setSaving(true)
    setRole(newRole)
    await fetch('/api/profiles', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: profileId, role: newRole }),
    })
    setSaving(false)
    router.refresh()
  }

  return (
    <select
      value={role}
      onChange={e => handleChange(e.target.value as Role)}
      disabled={saving}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1 focus:outline-none focus:border-gray-400 disabled:opacity-50"
    >
      <option value="reader">독자</option>
      <option value="writer">작가</option>
      <option value="admin">관리자</option>
    </select>
  )
}
