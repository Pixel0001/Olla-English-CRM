'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DeleteSetButton({ id, title }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handle = async () => {
    if (!confirm(`Ștergi setul "${title}"? Toate încercările elevilor vor fi șterse.`)) return
    setLoading(true)
    try {
      const res = await fetch(`/api/admin/sets/${id}`, { method: 'DELETE' })
      if (!res.ok) throw new Error('Eroare')
      toast.success('Set șters')
      router.refresh()
    } catch (e) {
      toast.error(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button onClick={handle} disabled={loading}
      className="text-red-600 hover:text-red-700 text-sm font-medium disabled:opacity-50">
      {loading ? '...' : 'Șterge'}
    </button>
  )
}
