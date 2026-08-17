/**
 * DELETE /api/admin/resource/[type]/[id]
 * Delete a resource (requires step-up)
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getRequestContext, apiError } from '@/lib/security/guards.js'
import { verifyStepUpToken, SENSITIVE_ACTIONS } from '@/lib/security/step-up.js'
import { createAuditLog, SEVERITY } from '@/lib/security/audit.js'
import { sendSecurityAlert } from '@/lib/security/alerts.js'

// Map of deletable resource types to their Prisma models
const RESOURCE_MODELS = {
  user: 'user',
  student: 'student',
  group: 'group',
}

export async function DELETE(request, { params }) {
  const context = await getRequestContext()
  const { type, id } = await params
  
  try {
    const { session, user: actor, error } = await requireAdmin()
    if (error) return error
    
    // Validate resource type
    if (!type || !RESOURCE_MODELS[type]) {
      return apiError('Invalid resource type', 400)
    }
    
    // Get step-up token from header
    const stepUpToken = request.headers.get('X-Step-Up-Token')
    
    // Require step-up
    const stepUpResult = await verifyStepUpToken({
      token: stepUpToken,
      userId: actor.id,
      action: SENSITIVE_ACTIONS.DELETE,
      ...context,
    })
    
    if (!stepUpResult.valid) {
      await createAuditLog({
        action: 'delete_failed',
        actorId: actor.id,
        targetId: id,
        targetType: type,
        details: {
          reason: `step_up_failed: ${stepUpResult.reason}`,
        },
        ...context,
        severity: SEVERITY.WARNING,
        success: false,
      })
      
      return apiError('Step-up verification required', 403, 'STEP_UP_REQUIRED')
    }
    
    // Special handling for user deletion
    if (type === 'user') {
      const targetUser = await prisma.user.findUnique({
        where: { id }
      })
      
      if (!targetUser) {
        return apiError('User not found', 404)
      }
      
      // Can't delete yourself
      if (targetUser.id === actor.id) {
        return apiError('Cannot delete your own account', 400)
      }
      
      // Only ADMIN can delete other ADMINs
      if (targetUser.role === 'ADMIN' && actor.role !== 'ADMIN') {
        return apiError('Only admins can delete admin users', 403)
      }
      
      // Delete user (cascades to sessions, backup codes, etc.)
      await prisma.user.delete({ where: { id } })
      
      // Audit and alert
      await createAuditLog({
        action: 'delete_user',
        actorId: actor.id,
        targetId: id,
        targetType: 'user',
        details: {
          deletedEmail: targetUser.email,
          deletedRole: targetUser.role,
          deletedBy: actor.email,
        },
        ...context,
        severity: SEVERITY.CRITICAL,
        success: true,
      })
      
      await sendSecurityAlert({
        type: 'user_deleted',
        severity: 'critical',
        title: 'User Deleted',
        message: `${actor.email} deleted user ${targetUser.email} (${targetUser.role})`,
        details: {
          deletedEmail: targetUser.email,
          deletedRole: targetUser.role,
        },
        ipAddress: context.ipAddress,
        userId: actor.id,
      })
      
      return NextResponse.json({
        success: true,
        message: 'User deleted successfully',
      })
    }
    
    // Generic resource deletion
    const modelName = RESOURCE_MODELS[type]
    const model = prisma[modelName]
    
    // Check if resource exists
    const resource = await model.findUnique({ where: { id } })
    
    if (!resource) {
      return apiError(`${type} not found`, 404)
    }
    
    // Delete resource
    await model.delete({ where: { id } })
    
    // Audit
    await createAuditLog({
      action: `delete_${type}`,
      actorId: actor.id,
      targetId: id,
      targetType: type,
      details: {
        resourceData: JSON.stringify(resource).substring(0, 500), // Truncate for safety
        deletedBy: actor.email,
      },
      ...context,
      severity: SEVERITY.WARNING,
      success: true,
    })
    
    return NextResponse.json({
      success: true,
      message: `${type} deleted successfully`,
    })
    
  } catch (error) {
    console.error('Delete resource error:', error)
    return apiError('Failed to delete resource', 500)
  }
}
