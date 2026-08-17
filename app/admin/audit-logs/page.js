'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { usePermissions } from '@/hooks/usePermissions'

const SEVERITY_STYLES = {
  info: 'bg-blue-100 text-blue-800',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800',
}

const ACTION_LABELS = {
  login: 'Autentificare',
  login_failed: 'Autentificare eșuată',
  login_failed_multiple: 'Autentificări eșuate multiple',
  logout: 'Deconectare',
  '2fa_setup': 'Configurare 2FA',
  '2fa_verify': 'Verificare 2FA',
  '2fa_disabled': 'Dezactivare 2FA',
  '2fa_reset': 'Resetare 2FA',
  create_admin: 'Creare admin',
  create_teacher: 'Creare profesor',
  create_user: 'Creare utilizator',
  change_role: 'Schimbare rol',
  delete_user: 'Ștergere utilizator',
  delete_data: 'Ștergere date',
  export_data: 'Export date',
  step_up_success: 'Step-up reușit',
  step_up_failed: 'Step-up eșuat',
  step_up_failed_multiple: 'Step-up eșuate multiple',
  suspicious_activity: 'Activitate suspectă',
  password_change: 'Schimbare parolă',
  security_alert_acknowledged: 'Alertă confirmată',
}

export default function AuditLogsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { hasPermission, isSuperAdmin } = usePermissions()
  
  const [logs, setLogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [pagination, setPagination] = useState({ total: 0, limit: 50, skip: 0 })
  const [filters, setFilters] = useState({
    action: '',
    severity: '',
    actorId: '',
    startDate: '',
    endDate: '',
  })
  const [availableActions, setAvailableActions] = useState([])
  const [selectedLog, setSelectedLog] = useState(null)

  // Verifică permisiunea
  useEffect(() => {
    if (status === 'loading') return
    if (!hasPermission('audit.view') && !isSuperAdmin) {
      toast.error('Nu ai permisiunea să vezi audit logs')
      router.push('/admin')
    }
  }, [hasPermission, isSuperAdmin, router, status])

  const fetchLogs = useCallback(async () => {
    if (!hasPermission('audit.view') && !isSuperAdmin) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.action) params.append('action', filters.action)
      if (filters.severity) params.append('severity', filters.severity)
      if (filters.actorId) params.append('actorId', filters.actorId)
      if (filters.startDate) params.append('startDate', filters.startDate)
      if (filters.endDate) params.append('endDate', filters.endDate)
      params.append('limit', pagination.limit.toString())
      params.append('skip', pagination.skip.toString())

      const res = await fetch(`/api/admin/audit-logs?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      setLogs(data.logs || [])
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }))
      
      // Extract unique actions
      if (data.logs?.length > 0 && availableActions.length === 0) {
        const actions = [...new Set(data.logs.map(l => l.action))].sort()
        setAvailableActions(actions)
      }
    } catch (error) {
      console.error('Error fetching audit logs:', error)
      toast.error('Eroare la încărcarea logurilor')
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.limit, pagination.skip, availableActions.length])

  useEffect(() => {
    fetchLogs()
  }, [fetchLogs])

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }))
    setPagination(prev => ({ ...prev, skip: 0 }))
  }

  const handlePageChange = (newSkip) => {
    setPagination(prev => ({ ...prev, skip: newSkip }))
  }

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('ro-RO', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    })
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Audit Logs</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Istoricul acțiunilor de securitate
        </p>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg shadow p-2 sm:p-3 lg:p-4 mb-4 sm:mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2 sm:gap-3 lg:gap-4">
          <div>
            <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1">
              Acțiune
            </label>
            <select
              value={filters.action}
              onChange={(e) => handleFilterChange('action', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm text-gray-700 py-1.5 sm:py-2"
            >
              <option value="">Toate</option>
              {availableActions.map(action => (
                <option key={action} value={action}>
                  {ACTION_LABELS[action] || action}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1">
              Severitate
            </label>
            <select
              value={filters.severity}
              onChange={(e) => handleFilterChange('severity', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm text-gray-700 py-1.5 sm:py-2"
            >
              <option value="">Toate</option>
              <option value="info">Info</option>
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1">
              De la
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm text-gray-700 py-1 sm:py-1.5"
            />
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1">
              Până la
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm text-gray-700 py-1 sm:py-1.5"
            />
          </div>

          <div className="flex items-end col-span-2 sm:col-span-1">
            <button
              onClick={() => {
                setFilters({ action: '', severity: '', actorId: '', startDate: '', endDate: '' })
                setPagination(prev => ({ ...prev, skip: 0 }))
              }}
              className="w-full px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Resetează
            </button>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow p-2 sm:p-3 lg:p-4">
          <div className="text-[10px] sm:text-xs lg:text-sm text-gray-500">Total</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{pagination.total}</div>
        </div>
        <div className="bg-blue-50 rounded-lg shadow p-2 sm:p-3 lg:p-4">
          <div className="text-[10px] sm:text-xs lg:text-sm text-blue-600">Info</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-blue-700">
            {logs.filter(l => l.severity === 'info').length}
          </div>
        </div>
        <div className="bg-yellow-50 rounded-lg shadow p-2 sm:p-3 lg:p-4">
          <div className="text-[10px] sm:text-xs lg:text-sm text-yellow-600">Warning</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-yellow-700">
            {logs.filter(l => l.severity === 'warning').length}
          </div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-2 sm:p-3 lg:p-4">
          <div className="text-[10px] sm:text-xs lg:text-sm text-red-600">Critical</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-700">
            {logs.filter(l => l.severity === 'critical').length}
          </div>
        </div>
      </div>

      {/* Logs - Cards on mobile, Table on desktop */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="flex justify-center items-center h-40 sm:h-52 lg:h-64">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : logs.length === 0 ? (
          <div className="text-center py-8 sm:py-10 lg:py-12 text-gray-500 text-sm">
            Nu există loguri pentru filtrele selectate
          </div>
        ) : (
          <>
            {/* Mobile Cards */}
            <div className="lg:hidden divide-y divide-gray-200">
              {logs.map((log) => (
                <div key={log.id} className="p-2 sm:p-3 hover:bg-gray-50">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1 mb-1">
                        <span className="text-xs sm:text-sm font-medium text-gray-900 truncate">
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                        <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-[9px] sm:text-[10px] font-medium ${SEVERITY_STYLES[log.severity] || SEVERITY_STYLES.info}`}>
                          {log.severity}
                        </span>
                        {log.success ? (
                          <span className="text-[9px] sm:text-[10px] text-green-600">✓</span>
                        ) : (
                          <span className="text-[9px] sm:text-[10px] text-red-600">✗</span>
                        )}
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-gray-500 space-y-0.5">
                        <div>{formatDate(log.createdAt)}</div>
                        {log.actor && (
                          <div className="truncate">{log.actor.name || log.actor.email}</div>
                        )}
                        {log.ipAddress && (
                          <div className="font-mono hidden sm:block">{log.ipAddress}</div>
                        )}
                      </div>
                    </div>
                    {log.details && (
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="text-indigo-600 hover:text-indigo-900 text-[10px] sm:text-xs flex-shrink-0"
                      >
                        Detalii
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop Table */}
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Data/Ora
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Acțiune
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Utilizator
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      IP
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Sev.
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                        {formatDate(log.createdAt)}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className="text-sm font-medium text-gray-900">
                          {ACTION_LABELS[log.action] || log.action}
                        </span>
                        {log.targetType && (
                          <span className="block text-xs text-gray-500">
                            {log.targetType}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.actor ? (
                          <div>
                            <div className="text-sm font-medium text-gray-900">
                              {log.actor.name || 'Fără nume'}
                            </div>
                            <div className="text-xs text-gray-500">
                              {log.actor.email}
                            </div>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-400">Anonim</span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500 font-mono">
                        {log.ipAddress || '-'}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${SEVERITY_STYLES[log.severity] || SEVERITY_STYLES.info}`}>
                          {log.severity}
                        </span>
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.success ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                            ✓
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
                            ✗
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 whitespace-nowrap">
                        {log.details && (
                          <button
                            onClick={() => setSelectedLog(log)}
                            className="text-indigo-600 hover:text-indigo-900 text-sm"
                          >
                            Detalii
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="bg-white px-2 sm:px-4 py-2 sm:py-3 flex flex-col sm:flex-row items-center justify-between border-t border-gray-200 gap-2">
              <p className="text-[10px] sm:text-xs lg:text-sm text-gray-700 order-2 sm:order-1">
                <span className="font-medium">{pagination.skip + 1}</span>-
                <span className="font-medium">
                  {Math.min(pagination.skip + pagination.limit, pagination.total)}
                </span>{' '}
                / <span className="font-medium">{pagination.total}</span>
              </p>
              <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px order-1 sm:order-2">
                <button
                  onClick={() => handlePageChange(Math.max(0, pagination.skip - pagination.limit))}
                  disabled={pagination.skip === 0}
                  className="relative inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-l-md border border-gray-300 bg-white text-[10px] sm:text-xs lg:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  ←
                </button>
                <span className="relative inline-flex items-center px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 border border-gray-300 bg-white text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700">
                  {currentPage}/{totalPages}
                </span>
                <button
                  onClick={() => handlePageChange(pagination.skip + pagination.limit)}
                  disabled={currentPage >= totalPages}
                  className="relative inline-flex items-center px-2 sm:px-3 py-1.5 sm:py-2 rounded-r-md border border-gray-300 bg-white text-[10px] sm:text-xs lg:text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50"
                >
                  →
                </button>
              </nav>
            </div>
          </>
        )}
      </div>

      {/* Details Modal */}
      {selectedLog && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-auto">
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900">
                  Detalii Log
                </h3>
                <button
                  onClick={() => setSelectedLog(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4">
                  <div>
                    <div className="text-[10px] sm:text-xs lg:text-sm text-gray-500">Acțiune</div>
                    <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{ACTION_LABELS[selectedLog.action] || selectedLog.action}</div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs lg:text-sm text-gray-500">Data/Ora</div>
                    <div className="font-medium text-gray-900 text-xs sm:text-sm">{formatDate(selectedLog.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs lg:text-sm text-gray-500">IP</div>
                    <div className="font-mono text-gray-700 text-xs sm:text-sm truncate">{selectedLog.ipAddress || '-'}</div>
                  </div>
                  <div>
                    <div className="text-[10px] sm:text-xs lg:text-sm text-gray-500">User Agent</div>
                    <div className="text-[9px] sm:text-xs truncate text-gray-700" title={selectedLog.userAgent}>
                      {selectedLog.userAgent || '-'}
                    </div>
                  </div>
                </div>

                {selectedLog.actor && (
                  <div>
                    <div className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1">Utilizator</div>
                    <div className="bg-gray-50 rounded p-2 sm:p-3">
                      <div className="font-medium text-gray-900 text-xs sm:text-sm">{selectedLog.actor.name || selectedLog.actor.email}</div>
                      <div className="text-[10px] sm:text-xs text-gray-500 truncate">{selectedLog.actor.email}</div>
                    </div>
                  </div>
                )}

                {selectedLog.details && (
                  <div>
                    <div className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1">Detalii</div>
                    <pre className="bg-gray-900 text-green-400 rounded p-2 sm:p-3 lg:p-4 overflow-auto text-[9px] sm:text-xs lg:text-sm max-h-40 sm:max-h-60">
                      {JSON.stringify(selectedLog.details, null, 2)}
                    </pre>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
