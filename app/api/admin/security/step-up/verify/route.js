/**
 * POST /api/admin/security/step-up/verify
 * Verify TOTP/backup code and issue one-time step-up token
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getRequestContext, apiError } from '@/lib/security/guards.js'
import { updateRecent2FA } from '@/lib/security/session.js'
import { createStepUpToken, SENSITIVE_ACTIONS } from '@/lib/security/step-up.js'
import { verifyTOTP, verifyBackupCode, decryptTOTPSecret } from '@/lib/security/totp.js'
import { checkRateLimit, recordFailedAttempt, resetRateLimit, applyDelay } from '@/lib/security/rate-limit.js'
import { auditStepUp } from '@/lib/security/audit.js'
import { sendSecurityAlert } from '@/lib/security/alerts.js'

export async function POST(request) {
  const context = await getRequestContext()
  
  try {
    const { session, user, error } = await requireAdmin()
    if (error) return error
    
    // Parse body
    const body = await request.json()
    const { action, code, isBackupCode = false } = body
    
    // Validate action
    const validActions = Object.values(SENSITIVE_ACTIONS)
    if (!action || !validActions.includes(action)) {
      return apiError('Invalid action', 400, 'INVALID_ACTION')
    }
    
    if (!code) {
      return apiError('Verification code is required', 400)
    }
    
    // Rate limit
    const rateLimit = await checkRateLimit({
      action: 'step-up',
      identifier: user.id,
      ip: context.ipAddress,
      deviceId: context.deviceId,
    })
    
    if (!rateLimit.allowed) {
      // Alert on too many failed step-up attempts
      await sendSecurityAlert({
        type: 'step_up_failed_multiple',
        severity: 'critical',
        title: 'Multiple Step-Up Failures',
        message: `User ${user.email} has too many failed step-up attempts for action: ${action}`,
        details: { action, email: user.email },
        ipAddress: context.ipAddress,
        userId: user.id,
      })
      
      return NextResponse.json(
        { 
          error: 'Too many attempts. Try again later.',
          code: 'RATE_LIMITED',
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      )
    }
    
    // Apply progressive delay
    if (rateLimit.delay) {
      await applyDelay(rateLimit.delay)
    }
    
    // Get full user with secret
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id },
      include: {
        backupCodes: {
          where: { usedAt: null }
        }
      }
    })
    
    if (!fullUser?.twoFactorSecret) {
      return apiError('2FA not configured', 400, '2FA_NOT_CONFIGURED')
    }
    
    let isValid = false
    let usedBackupCode = null
    
    if (isBackupCode) {
      // Verify backup code
      for (const bc of fullUser.backupCodes) {
        if (verifyBackupCode(code, bc.codeHash)) {
          isValid = true
          usedBackupCode = bc
          break
        }
      }
    } else {
      // Verify TOTP
      const secret = decryptTOTPSecret(fullUser.twoFactorSecret)
      isValid = verifyTOTP(code, secret)
    }
    
    if (!isValid) {
      await recordFailedAttempt({
        action: 'step-up',
        identifier: user.id,
        ip: context.ipAddress,
        deviceId: context.deviceId,
      })
      
      await auditStepUp({
        action: 'failed',
        userId: user.id,
        intendedAction: action,
        success: false,
        ...context,
      })
      
      return apiError('Invalid verification code', 400, 'INVALID_CODE')
    }
    
    // Mark backup code as used if applicable
    if (usedBackupCode) {
      await prisma.backupCode.update({
        where: { id: usedBackupCode.id },
        data: { usedAt: new Date() }
      })
    }
    
    // Update session recent2faAt
    await updateRecent2FA(session.id)
    
    // Create one-time step-up token
    const { token, expiresAt } = await createStepUpToken({
      userId: user.id,
      action,
      ...context,
    })
    
    // Reset rate limit
    await resetRateLimit({
      action: 'step-up',
      identifier: user.id,
      ip: context.ipAddress,
      deviceId: context.deviceId,
    })
    
    // Audit
    await auditStepUp({
      action: 'verify',
      userId: user.id,
      intendedAction: action,
      success: true,
      ...context,
    })
    
    return NextResponse.json({
      success: true,
      stepUpToken: token,
      expiresAt: expiresAt.toISOString(),
      validFor: Math.ceil((expiresAt.getTime() - Date.now()) / 1000), // seconds
      message: 'Step-up verified. Token valid for 60 seconds.',
    })
    
  } catch (error) {
    console.error('Step-up verify error:', error)
    return apiError('Failed to verify step-up', 500)
  }
}
