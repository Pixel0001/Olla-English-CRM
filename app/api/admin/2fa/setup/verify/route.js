/**
 * POST /api/admin/2fa/setup/verify
 * Verify TOTP code and enable 2FA
 * Generates backup codes on success
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentSession, update2FAVerification } from '@/lib/security/session.js'
import { 
  verifyTOTP, 
  decryptTOTPSecret,
  generateBackupCodes
} from '@/lib/security/totp.js'
import { checkRateLimit, recordFailedAttempt, resetRateLimit } from '@/lib/security/rate-limit.js'
import { audit2FA } from '@/lib/security/audit.js'
import { getRequestContext, apiError } from '@/lib/security/guards.js'

export async function POST(request) {
  const context = await getRequestContext()
  
  try {
    const session = await getCurrentSession()
    
    if (!session) {
      return apiError('Unauthorized', 401, 'UNAUTHORIZED')
    }
    
    const { user } = session
    
    // Check if 2FA is already enabled
    if (user.twoFactorEnabled) {
      return apiError('2FA is already enabled', 400, '2FA_ALREADY_ENABLED')
    }
    
    // Parse body
    const body = await request.json()
    const { code } = body
    
    if (!code) {
      return apiError('TOTP code is required', 400)
    }
    
    // Rate limit
    const rateLimit = await checkRateLimit({
      action: '2fa',
      identifier: user.id,
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
    
    // Get user with secret
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id }
    })
    
    if (!fullUser?.twoFactorSecret) {
      return apiError('2FA setup not initialized', 400, '2FA_NOT_INITIALIZED')
    }
    
    // Decrypt and verify TOTP
    const secret = decryptTOTPSecret(fullUser.twoFactorSecret)
    const isValid = verifyTOTP(code, secret)
    
    if (!isValid) {
      await recordFailedAttempt({
        action: '2fa',
        identifier: user.id,
        ip: context.ipAddress,
        deviceId: context.deviceId,
      })
      
      await audit2FA({
        action: 'setup_verify_failed',
        userId: user.id,
        success: false,
        reason: 'invalid_code',
        ...context,
      })
      
      return apiError('Invalid TOTP code', 400, 'INVALID_CODE')
    }
    
    // Generate backup codes
    const { plainCodes, hashedCodes } = generateBackupCodes(10)
    
    // Enable 2FA and save backup codes
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorEnabled: true,
          twoFactorSetupAt: new Date(),
        }
      }),
      // Delete old backup codes
      prisma.backupCode.deleteMany({
        where: { userId: user.id }
      }),
      // Create new backup codes
      prisma.backupCode.createMany({
        data: hashedCodes.map(codeHash => ({
          userId: user.id,
          codeHash,
        }))
      })
    ])
    
    // Update session as 2FA verified
    await update2FAVerification(session.id, true)
    
    // Reset rate limit
    await resetRateLimit({
      action: '2fa',
      identifier: user.id,
      ip: context.ipAddress,
      deviceId: context.deviceId,
    })
    
    // Audit
    await audit2FA({
      action: 'setup',
      userId: user.id,
      success: true,
      ...context,
    })
    
    return NextResponse.json({
      success: true,
      message: '2FA enabled successfully',
      backupCodes: plainCodes, // Show once, user must save them
      warning: 'Save these backup codes securely. They will not be shown again.',
    })
    
  } catch (error) {
    console.error('2FA setup verify error:', error)
    return apiError('Failed to verify 2FA setup', 500)
  }
}
