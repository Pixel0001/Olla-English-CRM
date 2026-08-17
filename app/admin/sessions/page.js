'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { 
  CalendarDaysIcon, 
  UserGroupIcon,
  CheckCircleIcon,
  XCircleIcon,
  DocumentTextIcon
} from '@heroicons/react/24/outline'
import { usePermissions } from '@/hooks/usePermissions'

export default function AdminSessionsPage() {
  const router = useRouter()
  const { hasPermission, isSuperAdmin } = usePermissions()
  
  const [sessions, setSessions] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedTeacher, setSelectedTeacher] = useState('')
  const [selectedGroup, setSelectedGroup] = useState('')
  const [teachers, setTeachers] = useState([])
  const [groups, setGroups] = useState([])
  
  // Verifică permisiunea
  useEffect(() => {
    if (!hasPermission('sessions.view') && !isSuperAdmin) {
      router.push('/admin')
    }
  }, [hasPermission, isSuperAdmin, router])

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const res = await fetch('/api/admin/sessions')
      const data = await res.json()
      setSessions(data.sessions || [])
      setTeachers(data.teachers || [])
      setGroups(data.groups || [])
    } catch (error) {
      console.error('Error fetching sessions:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSessions = sessions.filter(session => {
    if (selectedTeacher && session.group?.teacherId !== selectedTeacher) return false
    if (selectedGroup && session.groupId !== selectedGroup) return false
    return true
  })

  // Calculate stats
  const stats = {
    total: filteredSessions.length,
    totalStudents: filteredSessions.reduce((acc, s) => acc + (s.attendances?.length || 0), 0),
    present: filteredSessions.reduce((acc, s) => acc + (s.attendances?.filter(a => a.status === 'PRESENT').length || 0), 0),
    absent: filteredSessions.reduce((acc, s) => acc + (s.attendances?.filter(a => a.status === 'ABSENT').length || 0), 0)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Sesiuni de Lecții</h1>
        <p className="text-gray-600 mt-1">Vezi toate sesiunile de lecții făcute de profesori</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Total Sesiuni</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.total}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-gray-500 uppercase tracking-wide">Prezențe Totale</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{stats.totalStudents}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-green-600 uppercase tracking-wide">Prezenți</p>
          <p className="text-2xl font-bold text-green-600 mt-1">{stats.present}</p>
        </div>
        <div className="bg-white rounded-xl p-4 border border-gray-200 shadow-sm">
          <p className="text-xs text-red-600 uppercase tracking-wide">Absenți</p>
          <p className="text-2xl font-bold text-red-600 mt-1">{stats.absent}</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-4 bg-white rounded-xl p-4 border border-gray-200">
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Profesor</label>
          <select
            value={selectedTeacher}
            onChange={(e) => setSelectedTeacher(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Toți profesorii</option>
            {teachers.map(teacher => (
              <option key={teacher.id} value={teacher.id}>{teacher.name}</option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Grupă</label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg text-sm text-gray-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Toate grupele</option>
            {groups.map(group => (
              <option key={group.id} value={group.id}>{group.name} - {group.level}</option>
            ))}
          </select>
        </div>
        <div className="flex items-end">
          <button
            onClick={() => { setSelectedTeacher(''); setSelectedGroup(''); }}
            className="px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
          >
            Resetează filtrele
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="space-y-4">
        {filteredSessions.length === 0 ? (
          <div className="bg-white rounded-xl p-8 border border-gray-200 text-center">
            <CalendarDaysIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">Nu există sesiuni înregistrate</p>
          </div>
        ) : (
          filteredSessions.map(session => {
            const presentCount = session.attendances?.filter(a => a.status === 'PRESENT').length || 0
            const absentCount = session.attendances?.filter(a => a.status === 'ABSENT').length || 0
            
            return (
              <div key={session.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden border-l-4 border-l-teal-500">
                {/* Header */}
                <div className="p-4 border-b border-gray-100 bg-gray-50">
                  <div className="flex flex-wrap items-start justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="px-2 py-0.5 bg-teal-100 text-teal-700 text-xs font-bold rounded uppercase tracking-wide flex items-center gap-1">
                          <CalendarDaysIcon className="w-3.5 h-3.5" />
                          Lecție
                        </span>
                        <h3 className="font-semibold text-gray-900">{session.group?.level}</h3>
                      </div>
                      <p className="text-sm text-gray-600 mt-1">
                        Grupa: <span className="font-medium">{session.group?.name}</span> • 
                        Profesor: <span className="font-medium">{session.group?.teacher?.name}</span>
                      </p>
                      <p className="text-sm text-gray-500 mt-0.5">
                        <CalendarDaysIcon className="w-4 h-4 inline mr-1" />
                        {new Date(session.date).toLocaleString('ro-RO', {
                          weekday: 'long',
                          day: 'numeric',
                          month: 'long',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 text-sm">
                      <span className="flex items-center gap-1 text-green-600">
                        <CheckCircleIcon className="w-5 h-5" />
                        {presentCount} prezenți
                      </span>
                      <span className="flex items-center gap-1 text-red-600">
                        <XCircleIcon className="w-5 h-5" />
                        {absentCount} absenți
                      </span>
                    </div>
                  </div>
                </div>

                {/* Session Notes */}
                {session.notes && (
                  <div className="px-4 py-3 bg-amber-50 border-b border-amber-100">
                    <p className="text-sm text-amber-800 flex items-start gap-2">
                      <DocumentTextIcon className="w-4 h-4 mt-0.5 flex-shrink-0" />
                      <span><span className="font-medium">Notițe sesiune:</span> {session.notes}</span>
                    </p>
                  </div>
                )}

                {/* Attendances */}
                <div className="p-4">
                  <p className="text-sm font-medium text-gray-700 mb-3 flex items-center gap-2">
                    <UserGroupIcon className="w-4 h-4" />
                    Prezența elevilor ({session.attendances?.length || 0}):
                  </p>
                  
                  {session.attendances?.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {session.attendances.map(attendance => (
                        <div 
                          key={attendance.id} 
                          className={`flex items-center justify-between p-3 rounded-lg ${
                            attendance.status === 'PRESENT' ? 'bg-green-50' : 'bg-red-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                              attendance.status === 'PRESENT' ? 'bg-green-200' : 'bg-red-200'
                            }`}>
                              <span className={`text-sm font-medium ${
                                attendance.status === 'PRESENT' ? 'text-green-700' : 'text-red-700'
                              }`}>
                                {attendance.student?.fullName?.charAt(0) || '?'}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{attendance.student?.fullName}</p>
                              {attendance.notes && (
                                <p className="text-xs text-gray-500 mt-0.5 flex items-center gap-1">
                                  <DocumentTextIcon className="w-3 h-3" />
                                  {attendance.notes}
                                </p>
                              )}
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            attendance.status === 'PRESENT' 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-red-100 text-red-700'
                          }`}>
                            {attendance.status === 'PRESENT' ? 'Prezent' : 'Absent'}
                          </span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-sm text-gray-500 italic">Nu s-a înregistrat prezența</p>
                  )}
                </div>

                {/* Deduction info */}
                {session.lessonsDeducted && (
                  <div className="px-4 py-2 bg-blue-50 border-t border-blue-100">
                    <p className="text-sm text-blue-700">
                      ✓ Orele au fost deduse din pachetele elevilor
                    </p>
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
