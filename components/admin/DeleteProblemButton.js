'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { TrashIcon } from '@heroicons/react/24/outline'

export default function DeleteProblemButton({ id, title }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [confirm, setConfirm] = useState(false)

  const handle = async () => {
    if (!confirm) { setConfirm(true); return }
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/problems/${id}`, { method: 'DELETE' })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Eroare')
      }
      toast.success('Problemă ștearsă')
      router.refresh()
    } catch (e) {
      toast.error(e.message)
      setConfirm(false)
    } finally {
      setLoading(false)
    }
  }

  if (loading) return (
    <button disabled className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-red-100 text-red-400 rounded-lg opacity-60">
      <TrashIcon className="w-3.5 h-3.5" /> Se șterge...
    </button>
  )

  if (confirm) return (
    <div className="flex items-center gap-1.5">
      <span className="text-xs text-red-600 font-semibold">Sigur?</span>
      <button
        onClick={handle}
        className="px-2.5 py-1 text-xs font-bold bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
      >
        Da, șterge
      </button>
      <button
        onClick={() => setConfirm(false)}
        className="px-2.5 py-1 text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg transition"
      >
        Nu
      </button>
    </div>
  )

  return (
    <button
      onClick={handle}
      className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold bg-red-50 hover:bg-red-100 text-red-600 hover:text-red-700 border border-red-200 rounded-lg transition"
    >
      <TrashIcon className="w-3.5 h-3.5" /> Șterge
    </button>
  )
}
