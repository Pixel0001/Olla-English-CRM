import { redirect } from 'next/navigation'
import { checkPermission, checkAnyPermission } from '@/lib/permissions'

/**
 * Server component pentru protejarea paginilor admin pe baza permisiunilor
 * Folosește redirect() pentru a trimite utilizatorul înapoi la dashboard dacă nu are permisiunea
 */
export default async function PermissionGuard({ 
  permission, 
  permissions, 
  any = false, 
  children,
  fallbackUrl = '/admin'
}) {
  let hasAccess = false

  if (permission) {
    const result = await checkPermission(permission)
    hasAccess = result.allowed
  } else if (permissions) {
    if (any) {
      const result = await checkAnyPermission(permissions)
      hasAccess = result.allowed
    } else {
      // Check all permissions
      const results = await Promise.all(permissions.map(p => checkPermission(p)))
      hasAccess = results.every(r => r.allowed)
    }
  }

  if (!hasAccess) {
    redirect(fallbackUrl)
  }

  return children
}
