'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ModuleAccessManager({ moduleId, accesses }) {
  const router = useRouter()
  const [students, setStudents] = useState([])
  const [studentId, setStudentId] = useState('')
  const [source, setSource] = useState('granted')

  useEffect(() => {
    fetch('/api/admin/students?all=true')
      .then(r => r.json())
      .then(data => setStudents(Array.isArray(data) ? data.map(s => ({ id: s.id, fullName: s.fullName })) : []))
      .catch(() => {})
  }, [])

  const grant = async () => {
    if (!studentId) return toast.error('Selectează elev')
    try {
      const r = await fetch('/api/admin/modules/access', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId, moduleId, source }),
      })
      const d = await r.json()
      if (!r.ok) throw new Error(d.error || 'Eroare')
      toast.success(`Acces acordat. Link elev: /learn/${d.accessToken}`)
      setStudentId('')
      router.refresh()
    } catch (e) { toast.error(e.message) }
  }

  const revoke = async (sId) => {
    if (!confirm('Revocă accesul?')) return
    try {
      const r = await fetch(`/api/admin/modules/access?studentId=${sId}&moduleId=${moduleId}`, { method: 'DELETE' })
      if (!r.ok) throw new Error()
      toast.success('Revocat')
      router.refresh()
    } catch { toast.error('Eroare') }
  }

  const copyLink = (token) => {
    const url = `${window.location.origin}/learn/${token}`
    navigator.clipboard.writeText(url)
    toast.success('Link copiat')
  }

  const availableStudents = students.filter(s => !accesses.some(a => a.studentId === s.id))

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-5">
      <h3 className="font-semibold text-gray-900 mb-3">🎟️ Acces elevi ({accesses.length})</h3>

      <div className="flex flex-col sm:flex-row gap-2 mb-4 p-3 bg-gray-50 rounded-xl">
        <select value={studentId} onChange={e => setStudentId(e.target.value)} className="flex-1 px-3 py-2 border rounded-lg text-sm">
          <option value="">— Alege elev —</option>
          {availableStudents.map(s => <option key={s.id} value={s.id}>{s.fullName}</option>)}
        </select>
        <select value={source} onChange={e => setSource(e.target.value)} className="px-3 py-2 border rounded-lg text-sm">
          <option value="granted">Acordat</option>
          <option value="paid">Plătit</option>
          <option value="trial">Trial</option>
        </select>
        <button onClick={grant} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm">Acordă acces</button>
      </div>

      {accesses.length === 0 ? (
        <p className="text-gray-500 text-sm text-center py-4">Niciun elev nu are acces încă.</p>
      ) : (
        <div className="divide-y divide-gray-100">
          {accesses.map(a => (
            <div key={a.id} className="flex items-center gap-3 py-2.5">
              <div className="flex-1 min-w-0">
                <div className="font-medium text-sm text-gray-900 truncate">{a.student?.fullName || '?'}</div>
                <div className="text-xs text-gray-500">{a.source} • {new Date(a.createdAt).toLocaleDateString('ro-RO')}</div>
              </div>
              {a.student?.accessToken && (
                <button onClick={() => copyLink(a.student.accessToken)} className="text-xs px-2 py-1 border rounded hover:bg-gray-100">
                  📋 Copiază link
                </button>
              )}
              <button onClick={() => revoke(a.studentId)} className="text-xs text-red-600 px-2 py-1 hover:bg-red-50 rounded">
                Revocă
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
