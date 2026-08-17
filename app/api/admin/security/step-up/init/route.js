/**
 * POST /api/admin/security/step-up/init
 * Initialize step-up challenge for a sensitive action
 * Returns the action info - client must then verify 2FA
 */

import { NextResponse } from 'next/server'
import { requireAdmin, getRequestContext, apiError } from '@/lib/security/guards.js'
import { isStepUpRequired, SENSITIVE_ACTIONS } from '@/lib/security/step-up.js'
import { auditStepUp } from '@/lib/security/audit.js'

export async function POST(request) {
  const context = await getRequestContext()
  
  try {
    const { session, user, error } = await requireAdmin()
    if (error) return error
    
    // Parse body
    const body = await request.json()
    const { action } = body
    
    // Validate action
    const validActions = Object.values(SENSITIVE_ACTIONS)
    if (!action || !validActions.includes(action)) {
      return apiError('Invalid action', 400, 'INVALID_ACTION')
    }
    
    // Check if step-up is required for this action
    const { required, alwaysRequired } = isStepUpRequired(action, session.recent2faAt)
    
    // Audit init
    await auditStepUp({
      action: 'init',
      userId: user.id,
      intendedAction: action,
      success: true,
      ...context,
    })
    
    return NextResponse.json({
      success: true,
      action,
      stepUpRequired: required,
      alwaysRequired, // For UI to show proper message
      message: required 
        ? 'Step-up 2FA verification required' 
        : 'No step-up required',
    })
    
  } catch (error) {
    console.error('Step-up init error:', error)
    return apiError('Failed to initialize step-up', 500)
  }
}
