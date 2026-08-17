'use client'

import { useState } from 'react'
import toast from 'react-hot-toast'
import { useRouter } from 'next/navigation'

export default function SuperStudentToggle({ studentId, initialValue }) {
  const [enabled, setEnabled] = useState(initialValue)
  const router = useRouter()

  const toggle = async () => {
    const next = !enabled
    setEnabled(next) // optimistic
    try {
      const res = await fetch(`/api/admin/students/${studentId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ superStudent: next }),
      })
      if (!res.ok) {
        const d = await res.json()
        throw new Error(d.error || 'Eroare')
      }
      toast.success(next ? 'Super elev activat' : 'Super elev dezactivat')
      router.refresh()
    } catch (e) {
      setEnabled(!next) // revert
      toast.error(e.message)
    }
  }

  return (
    <button
      onClick={toggle}
      aria-label="Toggle super elev"
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 ${
        enabled ? 'bg-indigo-600' : 'bg-slate-300'
      }`}
    >
      <span className={`inline-block h-4 w-4 transform rounded-full bg-white shadow transition-transform duration-200 ${
        enabled ? 'translate-x-6' : 'translate-x-1'
      }`} />
    </button>
  )
}
