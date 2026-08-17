'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import TwoFactorModal from './TwoFactorModal'

export default function DeleteGroupButton({ id, name }) {
  const [loading, setLoading] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleDelete = async () => {
    if (!confirm(`Ești sigur că vrei să ștergi grupa "${name}"? Aceasta va șterge și toate înregistrările asociate.`)) return
    
    // If user has 2FA enabled, show modal; otherwise execute directly
    if (session?.user?.twoFactorEnabled) {
      setShow2FA(true)
    } else {
      executeDelete(null)
    }
  }

  const executeDelete = async (actionToken) => {
    setShow2FA(false)
    setLoading(true)
    try {
      const headers = {}
      if (actionToken) {
        headers['x-action-token'] = actionToken
      }
      
      const res = await fetch(`/api/admin/groups/${id}`, { 
        method: 'DELETE',
        headers
      })
      
      const data = await res.json()
      
      if (res.ok) {
        toast.success('Grupa a fost ștearsă')
        router.refresh()
      } else {
        toast.error(data.error || 'Eroare la ștergerea grupei')
      }
    } catch (error) {
      toast.error('Eroare la ștergerea grupei')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={loading}
        className="text-red-600 hover:text-red-900 text-xs xs:text-sm font-medium disabled:opacity-50"
      >
        {loading ? '...' : 'Șterge'}
      </button>
      
      <TwoFactorModal
        isOpen={show2FA}
        onClose={() => setShow2FA(false)}
        onVerify={executeDelete}
        title="Confirmare ștergere"
        description={`Confirmă identitatea pentru a șterge grupa "${name}".`}
      />
    </>
  )
}
