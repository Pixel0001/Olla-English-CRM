'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useSession } from 'next-auth/react'
import toast from 'react-hot-toast'
import TwoFactorModal from './TwoFactorModal'

export default function StudentForm({ student }) {
  const router = useRouter()
  const { data: session } = useSession()
  const [loading, setLoading] = useState(false)
  const [show2FA, setShow2FA] = useState(false)
  const [pendingAction, setPendingAction] = useState(null)
  const [formData, setFormData] = useState({
    fullName: student?.fullName || '',
    age: student?.age || '',
    grade: student?.grade || '',
    parentName: student?.parentName || '',
    parentPhone: student?.parentPhone || '',
    parentEmail: student?.parentEmail || '',
    notes: student?.notes || ''
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    // Store the action and check 2FA
    setPendingAction({ type: 'submit' })
    if (session?.user?.twoFactorEnabled) {
      setShow2FA(true)
    } else {
      executeSubmit(null)
    }
  }

  const executeSubmit = async (actionToken) => {
    setShow2FA(false)
    setLoading(true)

    try {
      const url = student ? `/api/admin/students/${student.id}` : '/api/admin/students'
      const method = student ? 'PUT' : 'POST'

      const payload = {
        ...formData,
        age: formData.age ? parseInt(formData.age) : null,
        grade: formData.grade ? parseInt(formData.grade) : null,
      }
      if (actionToken) {
        payload.actionToken = actionToken
      }

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })

      if (res.ok) {
        toast.success(student ? 'Elevul a fost actualizat' : 'Elevul a fost adăugat')
        router.push('/admin/students')
        router.refresh()
      } else {
        const data = await res.json()
        toast.error(data.error || 'A apărut o eroare')
      }
    } catch (error) {
      toast.error('A apărut o eroare')
    } finally {
      setLoading(false)
      setPendingAction(null)
    }
  }

  const handle2FAVerify = (token) => {
    if (pendingAction?.type === 'submit') {
      executeSubmit(token)
    }
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nume complet *</label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vârstă</label>
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              min={3}
              max={18}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Clasa</label>
            <select
              name="grade"
              value={formData.grade}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            >
              <option value="">— Nespecificată —</option>
              {[1,2,3,4,5,6,7,8,9].map(g => (
                <option key={g} value={g}>Clasa {g}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Nume părinte</label>
            <input
              type="text"
              name="parentName"
              value={formData.parentName}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Telefon părinte</label>
            <input
              type="tel"
              name="parentPhone"
              value={formData.parentPhone}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email părinte</label>
            <input
              type="email"
              name="parentEmail"
              value={formData.parentEmail}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Note</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900"
            />
          </div>
        </div>

        <div className="flex gap-4 pt-4 border-t">
          <button
            type="button"
            onClick={() => router.back()}
            className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50"
          >
            Anulează
          </button>
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 disabled:opacity-50"
          >
            {loading ? 'Se salvează...' : (student ? 'Actualizează' : 'Adaugă elev')}
          </button>
        </div>
      </form>

      <TwoFactorModal
        isOpen={show2FA}
        onClose={() => {
          setShow2FA(false)
          setPendingAction(null)
        }}
        onVerify={handle2FAVerify}
        title="Verificare 2FA"
        description={student ? 'Confirmă identitatea pentru a actualiza elevul.' : 'Confirmă identitatea pentru a adăuga elevul.'}
      />
    </>
  )
}
