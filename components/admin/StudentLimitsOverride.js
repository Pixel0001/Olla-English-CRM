'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import LimitsOverridePanel from './LimitsOverridePanel'

export default function StudentLimitsOverride({ studentId, initial }) {
  const [v, setV] = useState({
    cooldownOverrideMin: initial?.cooldownOverrideMin ?? '',
    dailyXpCapOverride:  initial?.dailyXpCapOverride ?? '',
    cooldownDisabled:    !!initial?.cooldownDisabled,
    xpCapDisabled:       !!initial?.xpCapDisabled,
  })
  const [saving, setSaving] = useState(false)
  const [dirty, setDirty] = useState(false)

  const onChange = (patch) => { setV(prev => ({ ...prev, ...patch })); setDirty(true) }

  const save = async () => {
    setSaving(true)
    try {
      const r = await fetch(`/api/admin/students/${studentId}`, {
        method: 'PATCH', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cooldownOverrideMin: v.cooldownOverrideMin === '' ? null : parseInt(v.cooldownOverrideMin),
          dailyXpCapOverride:  v.dailyXpCapOverride  === '' ? null : parseInt(v.dailyXpCapOverride),
          cooldownDisabled: v.cooldownDisabled,
          xpCapDisabled:    v.xpCapDisabled,
        }),
      })
      const j = await r.json()
      if (!r.ok) throw new Error(j.error || 'Eroare')
      toast.success('Limite salvate')
      setDirty(false)
    } catch (e) { toast.error(e.message) }
    finally { setSaving(false) }
  }

  return (
    <div className="space-y-2">
      <LimitsOverridePanel value={v} onChange={onChange} scope="student" />
      <div className="flex justify-end">
        <button type="button" onClick={save} disabled={saving || !dirty}
          className="px-4 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-sm font-bold disabled:opacity-40 transition">
          {saving ? 'Se salvează…' : dirty ? '💾 Salvează limite' : '✓ Salvat'}
        </button>
      </div>
    </div>
  )
}
