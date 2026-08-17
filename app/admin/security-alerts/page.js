'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { usePermissions } from '@/hooks/usePermissions'

const SEVERITY_STYLES = {
  warning: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  critical: 'bg-red-100 text-red-800 border-red-300',
}

const TYPE_LABELS = {
  brute_force: 'Atac Brute Force',
  suspicious_login: 'Login Suspect',
  admin_created: 'Admin Creat',
  teacher_created: 'Profesor Creat',
  '2fa_disabled': '2FA Dezactivat',
  '2fa_reset': '2FA Resetat',
  export_data: 'Export Date',
  delete_user: 'Utilizator Șters',
  login_failed_multiple: 'Login-uri Eșuate Multiple',
  step_up_failed_multiple: 'Step-up Eșuate Multiple',
  rate_limit_exceeded: 'Rate Limit Depășit',
}

const TYPE_ICONS = {
  brute_force: '🚨',
  suspicious_login: '🔍',
  admin_created: '👤',
  teacher_created: '👨‍🏫',
  '2fa_disabled': '🔓',
  '2fa_reset': '🔄',
  export_data: '📤',
  delete_user: '🗑️',
  login_failed_multiple: '❌',
  step_up_failed_multiple: '⚠️',
  rate_limit_exceeded: '🚫',
}

export default function SecurityAlertsPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { hasPermission, isSuperAdmin } = usePermissions()
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)
  const [acknowledging, setAcknowledging] = useState(null)
  const [pagination, setPagination] = useState({ total: 0, limit: 50, skip: 0 })
  const [filters, setFilters] = useState({
    type: '',
    severity: '',
    acknowledged: '',
  })
  const [availableTypes, setAvailableTypes] = useState([])
  const [selectedAlert, setSelectedAlert] = useState(null)
  const [stats, setStats] = useState({ unacknowledged: 0, critical: 0 })

  // Verifică permisiunea
  useEffect(() => {
    if (status === 'loading') return
    if (!hasPermission('security.view') && !isSuperAdmin) {
      toast.error('Nu ai permisiunea să vezi alertele de securitate')
      router.push('/admin')
    }
  }, [hasPermission, isSuperAdmin, router, status])

  const fetchAlerts = useCallback(async () => {
    if (!hasPermission('security.view') && !isSuperAdmin) return
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (filters.type) params.append('type', filters.type)
      if (filters.severity) params.append('severity', filters.severity)
      if (filters.acknowledged !== '') params.append('acknowledged', filters.acknowledged)
      params.append('limit', pagination.limit.toString())
      params.append('skip', pagination.skip.toString())

      const res = await fetch(`/api/admin/security-alerts?${params}`)
      if (!res.ok) throw new Error('Failed to fetch')
      
      const data = await res.json()
      setAlerts(data.alerts || [])
      setPagination(prev => ({ ...prev, total: data.pagination?.total || 0 }))
      
      // Calculate stats
      const unack = (data.alerts || []).filter(a => !a.acknowledged).length
      const crit = (data.alerts || []).filter(a => a.severity === 'critical').length
      setStats({ unacknowledged: unack, critical: crit })
      
      // Extract unique types
      if (data.alerts?.length > 0 && availableTypes.length === 0) {
        const types = [...new Set(data.alerts.map(a => a.type))].sort()
        setAvailableTypes(types)
      }
    } catch (error) {
      console.error('Error fetching alerts:', error)
      toast.error('Eroare la încărcarea alertelor')
    } finally {
      setLoading(false)
    }
  }, [filters, pagination.limit, pagination.skip, availableTypes.length])

  useEffect(() => {
    fetchAlerts()
  }, [fetchAlerts])

  const handleAcknowledge = async (alertId) => {
    setAcknowledging(alertId)
    try {
      const res = await fetch('/api/admin/security-alerts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ alertId })
      })

      if (!res.ok) throw new Error('Failed to acknowledge')

      toast.success('Alertă confirmată')
      fetchAlerts()
    } catch (error) {
      console.error('Error acknowledging alert:', error)
      toast.error('Eroare la confirmarea alertei')
    } finally {
      setAcknowledging(null)
    }
  }

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
      minute: '2-digit'
    })
  }

  const totalPages = Math.ceil(pagination.total / pagination.limit)
  const currentPage = Math.floor(pagination.skip / pagination.limit) + 1

  return (
    <div className="max-w-7xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h1 className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">Alerte de Securitate</h1>
        <p className="mt-1 text-xs sm:text-sm text-gray-500">
          Monitorizare și gestionare alerte
        </p>
      </div>

      {/* Stats Cards - 2 cols on mobile, 4 on desktop */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4 mb-4 sm:mb-6">
        <div className="bg-white rounded-lg shadow p-2 sm:p-3 lg:p-4">
          <div className="text-[10px] sm:text-xs lg:text-sm text-gray-500">Total</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-gray-900">{pagination.total}</div>
        </div>
        <div className="bg-red-50 rounded-lg shadow p-2 sm:p-3 lg:p-4 border border-red-200">
          <div className="text-[10px] sm:text-xs lg:text-sm text-red-600">Neconfirmate</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-red-700">{stats.unacknowledged}</div>
        </div>
        <div className="bg-orange-50 rounded-lg shadow p-2 sm:p-3 lg:p-4 border border-orange-200">
          <div className="text-[10px] sm:text-xs lg:text-sm text-orange-600">Critical</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-orange-700">{stats.critical}</div>
        </div>
        <div className="bg-green-50 rounded-lg shadow p-2 sm:p-3 lg:p-4 border border-green-200">
          <div className="text-[10px] sm:text-xs lg:text-sm text-green-600">Confirmate</div>
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-green-700">
            {alerts.filter(a => a.acknowledged).length}
          </div>
        </div>
      </div>

      {/* Filters - stacked on mobile, grid on desktop */}
      <div className="bg-white rounded-lg shadow p-2 sm:p-3 lg:p-4 mb-4 sm:mb-6">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          <div>
            <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1">
              Tip
            </label>
            <select
              value={filters.type}
              onChange={(e) => handleFilterChange('type', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm text-gray-700 py-1.5 sm:py-2"
            >
              <option value="">Toate</option>
              {availableTypes.map(type => (
                <option key={type} value={type}>
                  {TYPE_LABELS[type] || type}
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
              <option value="warning">Warning</option>
              <option value="critical">Critical</option>
            </select>
          </div>

          <div>
            <label className="block text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <select
              value={filters.acknowledged}
              onChange={(e) => handleFilterChange('acknowledged', e.target.value)}
              className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 text-xs sm:text-sm text-gray-700 py-1.5 sm:py-2"
            >
              <option value="">Toate</option>
              <option value="false">Neconfirmate</option>
              <option value="true">Confirmate</option>
            </select>
          </div>

          <div className="flex items-end">
            <button
              onClick={() => {
                setFilters({ type: '', severity: '', acknowledged: '' })
                setPagination(prev => ({ ...prev, skip: 0 }))
              }}
              className="w-full px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              Resetează
            </button>
          </div>
        </div>
      </div>

      {/* Alerts List */}
      <div className="space-y-2 sm:space-y-3 lg:space-y-4">
        {loading ? (
          <div className="bg-white rounded-lg shadow flex justify-center items-center h-40 sm:h-52 lg:h-64">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-indigo-600"></div>
          </div>
        ) : alerts.length === 0 ? (
          <div className="bg-white rounded-lg shadow text-center py-8 sm:py-10 lg:py-12 text-gray-500 text-sm">
            Nu există alerte pentru filtrele selectate
          </div>
        ) : (
          alerts.map((alert) => (
            <div
              key={alert.id}
              className={`bg-white rounded-lg shadow border-l-4 ${
                alert.acknowledged 
                  ? 'border-gray-300 opacity-75' 
                  : alert.severity === 'critical' 
                    ? 'border-red-500' 
                    : 'border-yellow-500'
              }`}
            >
              <div className="p-2 sm:p-3 lg:p-4">
                {/* Mobile layout - stacked */}
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-2 sm:gap-0">
                  <div className="flex items-start space-x-2 sm:space-x-3 min-w-0 flex-1">
                    <span className="text-lg sm:text-xl lg:text-2xl flex-shrink-0">
                      {TYPE_ICONS[alert.type] || '⚠️'}
                    </span>
                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-1 sm:gap-2">
                        <h3 className="font-semibold text-gray-900 text-xs sm:text-sm lg:text-base truncate max-w-[150px] sm:max-w-none">
                          {alert.title}
                        </h3>
                        <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium flex-shrink-0 ${
                          SEVERITY_STYLES[alert.severity] || 'bg-gray-100 text-gray-800'
                        }`}>
                          {alert.severity}
                        </span>
                        {alert.acknowledged && (
                          <span className="inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium bg-green-100 text-green-800 flex-shrink-0">
                            ✓
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] sm:text-xs lg:text-sm text-gray-600 mt-1 line-clamp-2 sm:line-clamp-none">
                        {alert.message}
                      </p>
                      <div className="flex flex-wrap items-center gap-x-2 sm:gap-x-4 gap-y-0.5 mt-1 sm:mt-2 text-[9px] sm:text-xs text-gray-500">
                        <span>{formatDate(alert.createdAt)}</span>
                        {alert.ipAddress && (
                          <span className="font-mono hidden sm:inline">IP: {alert.ipAddress}</span>
                        )}
                        {alert.sentVia?.length > 0 && (
                          <span className="hidden lg:inline">
                            Trimis via: {alert.sentVia.join(', ')}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Buttons - inline on mobile */}
                  <div className="flex items-center justify-end space-x-1 sm:space-x-2 flex-shrink-0 ml-auto sm:ml-0">
                    {alert.details && (
                      <button
                        onClick={() => setSelectedAlert(alert)}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs lg:text-sm text-indigo-600 hover:text-indigo-800 hover:bg-indigo-50 rounded"
                      >
                        Detalii
                      </button>
                    )}
                    {!alert.acknowledged && (
                      <button
                        onClick={() => handleAcknowledge(alert.id)}
                        disabled={acknowledging === alert.id}
                        className="px-2 sm:px-3 py-1 sm:py-1.5 text-[10px] sm:text-xs lg:text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded disabled:opacity-50 whitespace-nowrap"
                      >
                        {acknowledging === alert.id ? '...' : 'OK'}
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Pagination - compact on mobile */}
      {!loading && alerts.length > 0 && (
        <div className="mt-4 sm:mt-6 flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-0">
          <p className="text-[10px] sm:text-xs lg:text-sm text-gray-700 order-2 sm:order-1">
            <span className="font-medium">{pagination.skip + 1}</span>-
            <span className="font-medium">
              {Math.min(pagination.skip + pagination.limit, pagination.total)}
            </span>{' '}
            / <span className="font-medium">{pagination.total}</span>
          </p>
          <div className="flex items-center space-x-1 sm:space-x-2 order-1 sm:order-2">
            <button
              onClick={() => handlePageChange(Math.max(0, pagination.skip - pagination.limit))}
              disabled={pagination.skip === 0}
              className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              ←
            </button>
            <span className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs lg:text-sm text-gray-700">
              {currentPage}/{totalPages}
            </span>
            <button
              onClick={() => handlePageChange(pagination.skip + pagination.limit)}
              disabled={currentPage >= totalPages}
              className="px-2 sm:px-3 lg:px-4 py-1.5 sm:py-2 text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
            >
              →
            </button>
          </div>
        </div>
      )}

      {/* Details Modal - optimized for mobile */}
      {selectedAlert && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] sm:max-h-[80vh] overflow-auto">
            <div className="p-3 sm:p-4 lg:p-6">
              <div className="flex justify-between items-start mb-3 sm:mb-4">
                <div className="flex items-center space-x-2 min-w-0 flex-1">
                  <span className="text-lg sm:text-xl lg:text-2xl flex-shrink-0">{TYPE_ICONS[selectedAlert.type] || '⚠️'}</span>
                  <h3 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 truncate">
                    {selectedAlert.title}
                  </h3>
                </div>
                <button
                  onClick={() => setSelectedAlert(null)}
                  className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
                >
                  <svg className="w-5 h-5 sm:w-6 sm:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>

              <div className="space-y-3 sm:space-y-4">
                <div className="bg-gray-50 rounded p-2 sm:p-3 lg:p-4">
                  <p className="text-gray-700 text-xs sm:text-sm lg:text-base">{selectedAlert.message}</p>
                </div>

                <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 text-xs sm:text-sm">
                  <div>
                    <div className="text-gray-500 text-[10px] sm:text-xs">Tip</div>
                    <div className="font-medium text-gray-900 text-xs sm:text-sm truncate">{TYPE_LABELS[selectedAlert.type] || selectedAlert.type}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px] sm:text-xs">Severitate</div>
                    <span className={`inline-flex items-center px-1.5 sm:px-2 py-0.5 rounded text-[10px] sm:text-xs font-medium ${
                      SEVERITY_STYLES[selectedAlert.severity] || 'bg-gray-100 text-gray-800'
                    }`}>
                      {selectedAlert.severity}
                    </span>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px] sm:text-xs">Data/Ora</div>
                    <div className="font-medium text-gray-900 text-xs sm:text-sm">{formatDate(selectedAlert.createdAt)}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px] sm:text-xs">IP</div>
                    <div className="font-mono text-gray-700 text-xs sm:text-sm truncate">{selectedAlert.ipAddress || '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px] sm:text-xs">Trimis via</div>
                    <div className="text-gray-700 text-xs sm:text-sm">{selectedAlert.sentVia?.join(', ') || '-'}</div>
                  </div>
                  <div>
                    <div className="text-gray-500 text-[10px] sm:text-xs">Status</div>
                    <div className="text-gray-700 text-xs sm:text-sm">{selectedAlert.acknowledged ? '✓ OK' : '○ Nou'}</div>
                  </div>
                </div>

                {selectedAlert.details && (
                  <div>
                    <div className="text-[10px] sm:text-xs lg:text-sm font-medium text-gray-700 mb-1">Detalii</div>
                    <pre className="bg-gray-900 text-green-400 rounded p-2 sm:p-3 lg:p-4 overflow-auto text-[9px] sm:text-xs lg:text-sm max-h-40 sm:max-h-60">
                      {JSON.stringify(selectedAlert.details, null, 2)}
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
