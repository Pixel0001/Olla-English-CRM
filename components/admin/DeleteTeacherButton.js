'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import TwoFactorModal from './TwoFactorModal'

export default function DeleteTeacherButton({ id, name, className = '' }) {
  const [loading, setLoading] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const router = useRouter()
  const { data: session } = useSession()

  const handleDelete = async () => {
    if (!confirm(`Ești sigur că vrei să ștergi "${name}"? Aceasta va șterge și toate datele asociate.`)) return
    
    // Check if user has 2FA enabled
    if (session?.user?.twoFactorEnabled) {
      setShow2FA(true)
    } else {
      // No 2FA - execute directly
      executeDelete(null)
    }
  }

  const executeDelete = async (actionToken) => {
    setLoading(true)
    setShow2FA(false)
    try {
      const headers = {}
      if (actionToken) {
        headers['x-action-token'] = actionToken
      }
      
      const res = await fetch(`/api/admin/teachers/${id}`, { 
        method: 'DELETE',
        headers
      })
      
      if (res.ok) {
        toast.success('Contul a fost șters')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'Eroare la ștergere')
      }
    } catch (error) {
      toast.error('Eroare la ștergere')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <button
        onClick={handleDelete}
        disabled={loading}
        className={className || 'text-red-600 hover:text-red-900 text-sm font-medium disabled:opacity-50'}
      >
        {loading ? '...' : 'Șterge'}
      </button>
      
      <TwoFactorModal
        isOpen={show2FA}
        onClose={() => setShow2FA(false)}
        onVerify={executeDelete}
        title="Confirmare ștergere"
        description={`Confirmă identitatea pentru a șterge "${name}".`}
      />
    </>
  )
}
