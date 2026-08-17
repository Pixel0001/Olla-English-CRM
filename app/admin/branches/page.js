'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import toast from 'react-hot-toast'
import TwoFactorModal from '@/components/admin/TwoFactorModal'
import { usePermissions } from '@/hooks/usePermissions'

export default function BranchesPage() {
  const router = useRouter()
  const { data: session } = useSession()
  const { hasPermission, isSuperAdmin } = usePermissions()
  
  const [branches, setBranches] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingBranch, setEditingBranch] = useState(null)
  const [show2FA, setShow2FA] = useState(false)
  const [pendingAction, setPendingAction] = useState(null) // { type: 'save' | 'delete', branchId?: string }
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    active: true
  })
  const [saving, setSaving] = useState(false)
  
  // Verifică permisiunea
  useEffect(() => {
    if (!hasPermission('branches.view') && !isSuperAdmin) {
      router.push('/admin')
    }
  }, [hasPermission, isSuperAdmin, router])

  useEffect(() => {
    fetchBranches()
  }, [])

  const fetchBranches = async () => {
    try {
      const res = await fetch('/api/admin/branches')
      const data = await res.json()
      setBranches(data.branches || [])
    } catch (error) {
      console.error('Error fetching branches:', error)
      toast.error('Eroare la încărcarea filialelor')
    } finally {
      setLoading(false)
    }
  }

  const openAddModal = () => {
    setEditingBranch(null)
    setFormData({ name: '', address: '', active: true })
    setShowModal(true)
  }

  const openEditModal = (branch) => {
    setEditingBranch(branch)
    setFormData({
      name: branch.name,
      address: branch.address || '',
      active: branch.active
    })
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingBranch(null)
    setFormData({ name: '', address: '', active: true })
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    setPendingAction({ type: 'save' })
    // Check if user has 2FA enabled
    if (session?.user?.twoFactorEnabled) {
      setShow2FA(true)
    } else {
      // No 2FA - execute directly
      executeSave(null)
    }
  }

  const executeSave = async (actionToken) => {
    setShow2FA(false)
    setSaving(true)
    try {
      const url = editingBranch 
        ? `/api/admin/branches/${editingBranch.id}` 
        : '/api/admin/branches'
      const method = editingBranch ? 'PUT' : 'POST'

      const payload = { ...formData }
      if (actionToken) {
        payload.actionToken = actionToken
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(editingBranch ? 'Filiala a fost actualizată' : 'Filiala a fost creată')
        closeModal()
        fetchBranches()
      } else {
        const data = await res.json()
        toast.error(data.error || 'A apărut o eroare')
      }
    } catch (error) {
      toast.error('A apărut o eroare')
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (branch) => {
    if (branch._count?.groups > 0) {
      toast.error(`Nu poți șterge filiala deoarece are ${branch._count.groups} grupe asociate`)
      return
    }
    setPendingAction({ type: 'delete', branchId: branch.id, branchName: branch.name })
    // Check if user has 2FA enabled
    if (session?.user?.twoFactorEnabled) {
      setShow2FA(true)
    } else {
      // No 2FA - execute directly (need to call after setting pendingAction)
      executeDelete(null)
    }
  }

  const executeDelete = async (actionToken) => {
    if (pendingAction?.type !== 'delete' && !actionToken) return
    setShow2FA(false)
    
    try {
      const headers = {}
      if (actionToken) {
        headers['x-action-token'] = actionToken
      }
      
      const res = await fetch(`/api/admin/branches/${pendingAction.branchId}`, {
        method: 'DELETE',
        headers
      })

      if (res.ok) {
        toast.success('Filiala a fost ștearsă')
        fetchBranches()
      } else {
        const data = await res.json()
        toast.error(data.error || 'A apărut o eroare')
      }
    } catch (error) {
      toast.error('A apărut o eroare')
    }
    setPendingAction(null)
  }

  const handle2FAVerify = async (token) => {
    // Închide modalul 2FA imediat
    setShow2FA(false)
    
    if (pendingAction?.type === 'save') {
      await executeSave(token)
    } else if (pendingAction?.type === 'delete') {
      await executeDelete(token)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Filiale</h1>
          <p className="text-sm xs:text-base text-gray-600">Gestionează filialele (Centru, Ciocana, etc.)</p>
        </div>
        {(hasPermission('branches.create') || isSuperAdmin) && (
          <button
            onClick={openAddModal}
            className="px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm xs:text-base font-medium hover:bg-indigo-700 transition-colors text-center"
          >
            + Adaugă filială
          </button>
        )}
      </div>

      {/* Lista filiale */}
      <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        {branches.length === 0 ? (
          <div className="p-8 xs:p-12 text-center text-gray-500 text-sm xs:text-base">
            Nu există filiale. Adaugă prima filială!
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="px-4 xs:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Nume filială
                  </th>
                  <th className="px-4 xs:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Adresă
                  </th>
                  <th className="px-4 xs:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Grupe
                  </th>
                  <th className="px-4 xs:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-4 xs:px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Acțiuni
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {branches.map((branch) => (
                  <tr key={branch.id} className="hover:bg-gray-50">
                    <td className="px-4 xs:px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                          <svg className="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <span className="text-sm font-medium text-gray-900">{branch.name}</span>
                      </div>
                    </td>
                    <td className="px-4 xs:px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                      {branch.address || '-'}
                    </td>
                    <td className="px-4 xs:px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                        {branch._count?.groups || 0} grupe
                      </span>
                    </td>
                    <td className="px-4 xs:px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        branch.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                      }`}>
                        {branch.active ? 'Activ' : 'Inactiv'}
                      </span>
                    </td>
                    <td className="px-4 xs:px-6 py-4 whitespace-nowrap text-right text-sm">
                      {(hasPermission('branches.edit') || isSuperAdmin) && (
                        <button
                          onClick={() => openEditModal(branch)}
                          className="text-indigo-600 hover:text-indigo-900 font-medium mr-3"
                        >
                          Editează
                        </button>
                      )}
                      {(hasPermission('branches.delete') || isSuperAdmin) && (
                        <button
                          onClick={() => handleDelete(branch)}
                          className="text-red-600 hover:text-red-900 font-medium"
                          disabled={branch._count?.groups > 0}
                          title={branch._count?.groups > 0 ? 'Nu poți șterge filiala deoarece are grupe asociate' : ''}
                        >
                          Șterge
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal adaugă/editează */}
      {showModal && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
            <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={closeModal}></div>
            
            <div className="relative bg-white rounded-xl shadow-xl transform transition-all sm:max-w-lg sm:w-full p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  {editingBranch ? 'Editează filială' : 'Adaugă filială nouă'}
                </h3>
                <button onClick={closeModal} className="text-gray-400 hover:text-gray-500">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Nume filială *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    placeholder="ex: Centru, Ciocana, Botanica"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Adresă (opțional)
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
                    placeholder="ex: str. Ștefan cel Mare 1"
                  />
                </div>

                <div className="flex items-center">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                    />
                    <span className="text-sm font-medium text-gray-700">Filială activă</span>
                  </label>
                </div>

                <div className="flex gap-3 pt-4 border-t">
                  <button
                    type="button"
                    onClick={closeModal}
                    className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
                  >
                    Anulează
                  </button>
                  <button
                    type="submit"
                    disabled={saving}
                    className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
                  >
                    {saving ? 'Se salvează...' : (editingBranch ? 'Actualizează' : 'Creează')}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      <TwoFactorModal
        isOpen={show2FA}
        onClose={() => {
          setShow2FA(false)
          setPendingAction(null)
        }}
        onVerify={handle2FAVerify}
        title="Verificare 2FA"
        description={
          pendingAction?.type === 'delete' 
            ? `Confirmă identitatea pentru a șterge filiala "${pendingAction.branchName}".`
            : (editingBranch ? 'Confirmă identitatea pentru a actualiza filiala.' : 'Confirmă identitatea pentru a crea filiala.')
        }
      />
    </div>
  )
}
