'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function DeleteModuleButton({ id, title }) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const onClick = async () => {
    if (!confirm(`Șterge modulul "${title}"? Acțiunea va șterge toate lecțiile asociate (problemele rămân).`)) return
    setLoading(true)
    try {
      const r = await fetch(`/api/admin/modules/${id}`, { method: 'DELETE' })
      if (!r.ok) throw new Error()
      toast.success('Modul șters')
      router.refresh()
    } catch { toast.error('Eroare la ștergere') } finally { setLoading(false) }
  }
  return (
    <button onClick={onClick} disabled={loading} className="text-sm text-red-600 hover:text-red-700 font-medium">
      {loading ? '...' : 'Șterge'}
    </button>
  )
}
