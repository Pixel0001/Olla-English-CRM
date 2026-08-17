/**
 * GET /api/admin/audit-logs
 * View audit logs (admin only)
 */

import { NextResponse } from 'next/server'
import { getAuditLogs } from '@/lib/security/audit.js'
import { checkPermission } from '@/lib/permissions'
import { requireAdmin } from '@/lib/session'

function apiError(message, status) {
  return NextResponse.json({ error: message }, { status })
}

export async function GET(request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return apiError('Unauthorized', 401)
    }
    
    // Check permission
    const permCheck = await checkPermission('audit.view')
    if (!permCheck.allowed) {
      return apiError('Nu ai permisiunea să vezi audit logs', 403)
    }
    
    const { searchParams } = new URL(request.url)
    
    const options = {
      action: searchParams.get('action'),
      actorId: searchParams.get('actorId'),
      targetId: searchParams.get('targetId'),
      severity: searchParams.get('severity'),
      startDate: searchParams.get('startDate'),
      endDate: searchParams.get('endDate'),
      limit: parseInt(searchParams.get('limit')) || 100,
      skip: parseInt(searchParams.get('skip')) || 0,
    }
    
    const { logs, total } = await getAuditLogs(options)
    
    return NextResponse.json({
      logs,
      pagination: {
        total,
        limit: options.limit,
        skip: options.skip,
      }
    })
    
  } catch (error) {
    console.error('Get audit logs error:', error)
    return apiError('Failed to get audit logs', 500)
  }
}
