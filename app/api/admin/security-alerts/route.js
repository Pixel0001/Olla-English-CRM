/**
 * GET /api/admin/security-alerts
 * View security alerts (admin only)
 * POST - Acknowledge alert
 */

import { NextResponse } from 'next/server'
import { getSecurityAlerts, acknowledgeAlert } from '@/lib/security/alerts.js'
import { createAuditLog } from '@/lib/security/audit.js'
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
    const permCheck = await checkPermission('security.view')
    if (!permCheck.allowed) {
      return apiError('Nu ai permisiunea să vezi alertele de securitate', 403)
    }
    
    const { searchParams } = new URL(request.url)
    
    const options = {
      type: searchParams.get('type'),
      severity: searchParams.get('severity'),
      acknowledged: searchParams.get('acknowledged') === 'true' ? true : 
                    searchParams.get('acknowledged') === 'false' ? false : null,
      limit: parseInt(searchParams.get('limit')) || 50,
      skip: parseInt(searchParams.get('skip')) || 0,
    }
    
    const { alerts, total } = await getSecurityAlerts(options)
    
    return NextResponse.json({
      alerts,
      pagination: {
        total,
        limit: options.limit,
        skip: options.skip,
      }
    })
    
  } catch (error) {
    console.error('Get security alerts error:', error)
    return apiError('Failed to get security alerts', 500)
  }
}

export async function POST(request) {
  try {
    const session = await requireAdmin()
    if (!session) {
      return apiError('Unauthorized', 401)
    }
    
    // Check permission - security.manage for acknowledging alerts
    const permCheck = await checkPermission('security.manage')
    if (!permCheck.allowed) {
      return apiError('Nu ai permisiunea să gestionezi alertele de securitate', 403)
    }
    
    const body = await request.json()
    const { alertId } = body
    
    if (!alertId) {
      return apiError('Alert ID is required', 400)
    }
    
    const alert = await acknowledgeAlert(alertId, session.user.id)
    
    await createAuditLog({
      action: 'security_alert_acknowledged',
      actorId: session.user.id,
      targetId: alertId,
      targetType: 'security_alert',
      success: true,
    })
    
    return NextResponse.json({
      success: true,
      alert,
    })
    
  } catch (error) {
    console.error('Acknowledge alert error:', error)
    return apiError('Failed to acknowledge alert', 500)
  }
}
