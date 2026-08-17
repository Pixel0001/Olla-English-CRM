/**
 * POST /api/admin/2fa/backup/verify
 * Verify backup code for login (when TOTP unavailable)
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentSession, update2FAVerification } from '@/lib/security/session.js'
import { verifyBackupCode } from '@/lib/security/totp.js'
import { checkRateLimit, recordFailedAttempt, resetRateLimit, applyDelay } from '@/lib/security/rate-limit.js'
import { audit2FA } from '@/lib/security/audit.js'
import { sendSecurityAlert } from '@/lib/security/alerts.js'
import { getRequestContext, apiError } from '@/lib/security/guards.js'

export async function POST(request) {
  const context = await getRequestContext()
  
  try {
    const session = await getCurrentSession()
    
    if (!session) {
      return apiError('Unauthorized', 401, 'UNAUTHORIZED')
    }
    
    const { user } = session
    
    // Check if 2FA is enabled
    if (!user.twoFactorEnabled) {
      return apiError('2FA is not enabled for this account', 400, '2FA_NOT_ENABLED')
    }
    
    // Parse body
    const body = await request.json()
    const { code } = body
    
    if (!code) {
      return apiError('Backup code is required', 400)
    }
    
    // Rate limit (stricter for backup codes)
    const rateLimit = await checkRateLimit({
      action: '2fa',
      identifier: `backup:${user.id}`,
      ip: context.ipAddress,
      deviceId: context.deviceId,
    })
    
    if (!rateLimit.allowed) {
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
    
    // Get unused backup codes
    const backupCodes = await prisma.backupCode.findMany({
      where: {
        userId: user.id,
        usedAt: null,
      }
    })
    
    if (backupCodes.length === 0) {
      return apiError('No backup codes available', 400, 'NO_BACKUP_CODES')
    }
    
    // Find matching code
    let matchedCode = null
    for (const bc of backupCodes) {
      if (verifyBackupCode(code, bc.codeHash)) {
        matchedCode = bc
        break
      }
    }
    
    if (!matchedCode) {
      await recordFailedAttempt({
        action: '2fa',
        identifier: `backup:${user.id}`,
        ip: context.ipAddress,
        deviceId: context.deviceId,
      })
      
      await audit2FA({
        action: 'backup_verify_failed',
        userId: user.id,
        success: false,
        reason: 'invalid_code',
        ...context,
      })
      
      return apiError('Invalid backup code', 400, 'INVALID_CODE')
    }
    
    // Mark code as used
    await prisma.backupCode.update({
      where: { id: matchedCode.id },
      data: { usedAt: new Date() }
    })
    
    // Mark session as 2FA verified
    await update2FAVerification(session.id, true)
    
    // Reset rate limit
    await resetRateLimit({
      action: '2fa',
      identifier: `backup:${user.id}`,
      ip: context.ipAddress,
      deviceId: context.deviceId,
    })
    
    // Count remaining codes
    const remainingCodes = backupCodes.length - 1
    
    // Audit
    await audit2FA({
      action: 'backup_used',
      userId: user.id,
      success: true,
      reason: `${remainingCodes} codes remaining`,
      ...context,
    })
    
    // Alert if few codes remaining
    if (remainingCodes <= 2) {
      await sendSecurityAlert({
        type: 'low_backup_codes',
        severity: 'warning',
        title: 'Low Backup Codes Warning',
        message: `User ${user.email} has only ${remainingCodes} backup codes remaining.`,
        userId: user.id,
        ipAddress: context.ipAddress,
      })
    }
    
    return NextResponse.json({
      success: true,
      message: '2FA verified with backup code',
      remainingCodes,
      warning: remainingCodes <= 2 
        ? 'You have few backup codes remaining. Consider generating new ones.'
        : null,
    })
    
  } catch (error) {
    console.error('Backup code verify error:', error)
    return apiError('Failed to verify backup code', 500)
  }
}
