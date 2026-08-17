/**
 * PATCH /api/admin/users/[id]/role
 * Change user role (requires step-up)
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getRequestContext, apiError } from '@/lib/security/guards.js'
import { verifyStepUpToken, SENSITIVE_ACTIONS } from '@/lib/security/step-up.js'
import { auditUserAction } from '@/lib/security/audit.js'
import { sendSecurityAlert } from '@/lib/security/alerts.js'

export async function PATCH(request, { params }) {
  const context = await getRequestContext()
  const { id } = await params
  
  try {
    const { session, user: actor, error } = await requireAdmin()
    if (error) return error
    
    // Parse body
    const body = await request.json()
    const { role, stepUpToken } = body
    
    // Validate role
    const validRoles = ['ADMIN', 'TEACHER']
    if (!role || !validRoles.includes(role)) {
      return apiError('Invalid role', 400)
    }
    
    // Get target user
    const targetUser = await prisma.user.findUnique({
      where: { id }
    })
    
    if (!targetUser) {
      return apiError('User not found', 404)
    }
    
    // Can't change own role
    if (targetUser.id === actor.id) {
      return apiError('Cannot change your own role', 400)
    }
    
    // Only ADMIN can grant ADMIN role
    if (role === 'ADMIN' && actor.role !== 'ADMIN') {
      await auditUserAction({
        action: 'change_role',
        actorId: actor.id,
        targetUserId: id,
        details: {
          oldRole: targetUser.role,
          newRole: role,
          reason: 'insufficient_permissions',
        },
        ...context,
        success: false,
      })
      
      return apiError('Only admins can grant admin role', 403)
    }
    
    // Only ADMIN can change another ADMIN's role
    if (targetUser.role === 'ADMIN' && actor.role !== 'ADMIN') {
      return apiError('Only admins can change admin roles', 403)
    }
    
    // Require step-up
    const stepUpResult = await verifyStepUpToken({
      token: stepUpToken,
      userId: actor.id,
      action: SENSITIVE_ACTIONS.CHANGE_ROLE,
      ...context,
    })
    
    if (!stepUpResult.valid) {
      await auditUserAction({
        action: 'change_role',
        actorId: actor.id,
        targetUserId: id,
        details: {
          oldRole: targetUser.role,
          newRole: role,
          reason: `step_up_failed: ${stepUpResult.reason}`,
        },
        ...context,
        success: false,
      })
      
      return apiError('Step-up verification required', 403, 'STEP_UP_REQUIRED')
    }
    
    // No change needed
    if (targetUser.role === role) {
      return NextResponse.json({
        success: true,
        message: 'Role unchanged',
        user: {
          id: targetUser.id,
          email: targetUser.email,
          role: targetUser.role,
        }
      })
    }
    
    // Update role
    const updatedUser = await prisma.user.update({
      where: { id },
      data: { role },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    })
    
    // Audit
    await auditUserAction({
      action: 'change_role',
      actorId: actor.id,
      targetUserId: id,
      details: {
        oldRole: targetUser.role,
        newRole: role,
        targetEmail: targetUser.email,
        changedBy: actor.email,
      },
      ...context,
      success: true,
    })
    
    // Alert
    await sendSecurityAlert({
      type: 'role_changed',
      severity: 'critical',
      title: 'User Role Changed',
      message: `${actor.email} changed role of ${targetUser.email} from ${targetUser.role} to ${role}`,
      details: {
        actor: actor.email,
        target: targetUser.email,
        oldRole: targetUser.role,
        newRole: role,
      },
      ipAddress: context.ipAddress,
      userId: actor.id,
    })
    
    return NextResponse.json({
      success: true,
      user: updatedUser,
      message: `Role updated to ${role}`,
    })
    
  } catch (error) {
    console.error('Change role error:', error)
    return apiError('Failed to change role', 500)
  }
}
