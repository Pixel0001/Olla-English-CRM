'use client'

import { useSession } from 'next-auth/react'
import { PERMISSIONS } from '@/config/permissions'

/**
 * Hook pentru verificarea permisiunilor în componente client
 */
export function usePermissions() {
  const { data: session, status } = useSession()
  const user = session?.user

  // Debug logging in development
  if (process.env.NODE_ENV === 'development' && status === 'authenticated') {
    console.log('[usePermissions] User:', user?.email, 'Role:', user?.role, 'Permissions:', user?.permissions?.length || 0)
  }

  /**
   * Verifică dacă utilizatorul are o permisiune specifică
   */
  const hasPermission = (permission) => {
    if (!user) return false
    if (user.role === 'SUPERADMIN') return true
    return user.permissions?.includes(permission) || false
  }

  /**
   * Verifică dacă utilizatorul are cel puțin una din permisiuni
   */
  const hasAnyPermission = (permissions) => {
    if (!user) return false
    if (user.role === 'SUPERADMIN') return true
    return permissions.some(p => user.permissions?.includes(p))
  }

  /**
   * Verifică dacă utilizatorul are toate permisiunile
   */
  const hasAllPermissions = (permissions) => {
    if (!user) return false
    if (user.role === 'SUPERADMIN') return true
    return permissions.every(p => user.permissions?.includes(p))
  }

  /**
   * Verifică dacă utilizatorul este SUPERADMIN
   */
  const isSuperAdmin = user?.role === 'SUPERADMIN'

  /**
   * Verifică dacă utilizatorul are acces la panoul admin
   */
  const isAdmin = ['SUPERADMIN', 'ADMIN'].includes(user?.role)

  /**
   * Returnează permisiunile utilizatorului
   */
  const permissions = user?.role === 'SUPERADMIN' 
    ? Object.keys(PERMISSIONS) 
    : (user?.permissions || [])

  return {
    user,
    hasPermission,
    hasAnyPermission,
    hasAllPermissions,
    isSuperAdmin,
    isAdmin,
    permissions
  }
}

/**
 * Componentă care afișează conținutul doar dacă utilizatorul are permisiunea
 */
export function PermissionGate({ permission, permissions, any = false, children, fallback = null }) {
  const { hasPermission, hasAnyPermission, hasAllPermissions } = usePermissions()

  let hasAccess = false

  if (permission) {
    hasAccess = hasPermission(permission)
  } else if (permissions) {
    hasAccess = any ? hasAnyPermission(permissions) : hasAllPermissions(permissions)
  }

  return hasAccess ? children : fallback
}

export default usePermissions
