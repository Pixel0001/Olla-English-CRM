'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import AddStudentButton from '@/components/admin/AddStudentButton'
import DeleteStudentButton from '@/components/admin/DeleteStudentButton'
import { usePermissions, PermissionGate } from '@/hooks/usePermissions'

export default function StudentsPage() {
  const router = useRouter()
  const { hasPermission, isSuperAdmin } = usePermissions()
  
  const canViewStudents = hasPermission('students.view')

  const [students, setStudents] = useState([])
  const [groups, setGroups] = useState([])
  const [loading, setLoading] = useState(true)
  
  // Paginare
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalCount, setTotalCount] = useState(0)
  
  // Filtre
  const [search, setSearch] = useState('')
  const [hasGroup, setHasGroup] = useState('')

  // Verifică permisiunea
  useEffect(() => {
    if (!canViewStudents && !isSuperAdmin) {
      router.push('/admin')
    }
  }, [canViewStudents, isSuperAdmin, router])

  useEffect(() => {
    fetchStudents()
  }, [currentPage, hasGroup])

  useEffect(() => {
    fetchGroups()
  }, [])

  // Debounce search
  useEffect(() => {
    const timer = setTimeout(() => {
      setCurrentPage(1)
      fetchStudents()
    }, 300)
    return () => clearTimeout(timer)
  }, [search])

  const fetchStudents = async () => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      params.set('page', currentPage.toString())
      if (search) params.set('search', search)
      if (hasGroup) params.set('hasGroup', hasGroup)

      const res = await fetch(`/api/admin/students?${params.toString()}`)
      const data = await res.json()
      
      if (data.students) {
        setStudents(data.students)
        setTotalPages(data.pagination.totalPages)
        setTotalCount(data.pagination.totalCount)
      } else {
        // Fallback for old API format
        setStudents(Array.isArray(data) ? data : [])
      }
    } catch (error) {
      console.error('Error fetching students:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchGroups = async () => {
    try {
      const res = await fetch('/api/admin/groups?all=true')
      const data = await res.json()
      setGroups(data.groups || [])
    } catch (error) {
      console.error('Error fetching groups:', error)
    }
  }

  const resetFilters = () => {
    setSearch('')
    setHasGroup('')
    setCurrentPage(1)
  }

  const hasActiveFilters = search || hasGroup

  // Generare numere pagini
  const getPageNumbers = () => {
    const pages = []
    const maxVisible = 5
    
    if (totalPages <= maxVisible) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i)
        pages.push('...')
        pages.push(totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1)
        pages.push('...')
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i)
      } else {
        pages.push(1)
        pages.push('...')
        pages.push(currentPage - 1)
        pages.push(currentPage)
        pages.push(currentPage + 1)
        pages.push('...')
        pages.push(totalPages)
      }
    }
    return pages
  }

  if (loading && students.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Header */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3 xs:gap-0">
        <div>
          <h1 className="text-xl xs:text-2xl font-bold text-gray-900">Elevi</h1>
          <p className="text-sm xs:text-base text-gray-600">Gestionează elevii înregistrați</p>
        </div>
        <AddStudentButton />
      </div>

      {/* Filtre */}
      <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-3 xs:p-4">
        <div className="flex flex-col gap-3">
          {/* Search */}
          <div className="relative">
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              placeholder="Caută după nume, părinte, telefon sau email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-sm xs:text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 placeholder-gray-500"
            />
          </div>

          {/* Filter Row */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">Status grupă</label>
              <select
                value={hasGroup}
                onChange={(e) => { setHasGroup(e.target.value); setCurrentPage(1); }}
                className="px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 bg-white min-w-[150px]"
              >
                <option value="">Toți elevii</option>
                <option value="yes">Cu grupe asignate</option>
                <option value="no">Fără grupe</option>
              </select>
            </div>

            {/* Clear Filters */}
            {hasActiveFilters && (
              <div className="flex items-end">
                <button
                  onClick={resetFilters}
                  className="px-3 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  Resetează filtrele
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Results count */}
        {hasActiveFilters && (
          <div className="mt-3 pt-3 border-t border-gray-100">
            <p className="text-sm text-gray-600">
              {totalCount} {totalCount === 1 ? 'elev găsit' : 'elevi găsiți'}
            </p>
          </div>
        )}
      </div>

      {/* Desktop Table */}
      <div className="hidden lg:block bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Elev</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Vârstă</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Părinte</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Grupe</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acțiuni</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {students.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                  {hasActiveFilters ? 'Nu s-au găsit elevi cu filtrele selectate' : 'Nu există elevi. Adaugă primul elev!'}
                </td>
              </tr>
            ) : (
              students.map((student) => (
                <tr key={student.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-900">{student.fullName}</p>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {student.age ? `${student.age} ani` : '-'}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {student.parentName || '-'}
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="text-sm text-gray-900">{student.parentPhone || '-'}</p>
                      <p className="text-xs text-gray-500">{student.parentEmail || '-'}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1">
                      {student.groupStudents?.length > 0 ? (
                        student.groupStudents.map((gs) => (
                          <span key={gs.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-800">
                            {gs.group?.name || 'Grupă'}
                          </span>
                        ))
                      ) : (
                        <span className="text-sm text-gray-500">-</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-3">
                      <PermissionGate permission="students.edit">
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
                        >
                          Editează
                        </Link>
                      </PermissionGate>
                      <PermissionGate permission="students.delete">
                        <DeleteStudentButton id={student.id} name={student.fullName} />
                      </PermissionGate>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Mobile Cards */}
      <div className="lg:hidden space-y-3 xs:space-y-4">
        {students.length === 0 ? (
          <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-8 xs:p-12 text-center text-gray-500 text-sm xs:text-base">
            {hasActiveFilters ? 'Nu s-au găsit elevi cu filtrele selectate' : 'Nu există elevi. Adaugă primul elev!'}
          </div>
        ) : (
          students.map((student) => (
            <div key={student.id} className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-3 xs:p-4 space-y-3">
              {/* Student Name */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-semibold text-gray-900 text-sm xs:text-base">
                  {student.fullName}
                </h3>
                {student.age && (
                  <span className="text-xs xs:text-sm text-gray-600 whitespace-nowrap">
                    {student.age} ani
                  </span>
                )}
              </div>

              {/* Parent Info */}
              <div className="space-y-1.5">
                {student.parentName && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 min-w-[60px] xs:min-w-[70px]">Părinte:</span>
                    <span className="text-xs xs:text-sm text-gray-900 flex-1">{student.parentName}</span>
                  </div>
                )}
                {student.parentPhone && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 min-w-[60px] xs:min-w-[70px]">Telefon:</span>
                    <span className="text-xs xs:text-sm text-gray-900 flex-1">{student.parentPhone}</span>
                  </div>
                )}
                {student.parentEmail && (
                  <div className="flex items-start gap-2">
                    <span className="text-xs text-gray-500 min-w-[60px] xs:min-w-[70px]">Email:</span>
                    <span className="text-xs xs:text-sm text-gray-900 flex-1 break-all">{student.parentEmail}</span>
                  </div>
                )}
              </div>

              {/* Groups */}
              {student.groupStudents?.length > 0 && (
                <div>
                  <span className="text-xs text-gray-500 block mb-1.5">Grupe:</span>
                  <div className="flex flex-wrap gap-1.5">
                    {student.groupStudents.map((gs) => (
                      <span key={gs.id} className="inline-flex items-center px-2 py-0.5 rounded text-xs bg-indigo-100 text-indigo-800">
                        {gs.group?.name || 'Grupă'}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-2">
                <PermissionGate permission="students.edit">
                  <Link
                    href={`/admin/students/${student.id}`}
                    className="flex-1 px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm xs:text-base font-medium hover:bg-indigo-700 transition-colors text-center"
                  >
                    Editează
                  </Link>
                </PermissionGate>
                <PermissionGate permission="students.delete">
                  <DeleteStudentButton 
                    id={student.id} 
                    name={student.fullName} 
                    className="px-3 xs:px-4 py-2 bg-red-600 text-white rounded-lg text-sm xs:text-base font-medium hover:bg-red-700 transition-colors"
                  />
                </PermissionGate>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Paginare */}
      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-[#0f2127] rounded-xl border border-[#30919f]/20 px-4 py-3">
          <div className="text-sm text-[#a0b8bc]">
            Pagina {currentPage} din {totalPages} ({totalCount} elevi total)
          </div>
          <div className="flex items-center gap-1">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[#30919f]/30 text-[#a0b8bc] hover:bg-[#30919f]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Anterior
            </button>
            
            {getPageNumbers().map((pageNum, idx) => (
              pageNum === '...' ? (
                <span key={`ellipsis-${idx}`} className="px-2 text-[#a0b8bc]">...</span>
              ) : (
                <button
                  key={pageNum}
                  onClick={() => setCurrentPage(pageNum)}
                  className={`px-3 py-1.5 text-sm font-medium rounded-lg transition-colors ${
                    currentPage === pageNum
                      ? 'bg-[#30919f] text-white'
                      : 'border border-[#30919f]/30 text-[#a0b8bc] hover:bg-[#30919f]/10'
                  }`}
                >
                  {pageNum}
                </button>
              )
            ))}
            
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-3 py-1.5 text-sm font-medium rounded-lg border border-[#30919f]/30 text-[#a0b8bc] hover:bg-[#30919f]/10 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Următor →
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
