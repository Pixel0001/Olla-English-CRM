/**
 * POST /api/admin/2fa/verify
 * Verify TOTP code for login
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentSession, update2FAVerification } from '@/lib/security/session.js'
import { verifyTOTP, decryptTOTPSecret } from '@/lib/security/totp.js'
import { checkRateLimit, recordFailedAttempt, resetRateLimit, applyDelay } from '@/lib/security/rate-limit.js'
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
    
    // Check if 2FA is enabled
    if (!user.twoFactorEnabled) {
      return apiError('2FA is not enabled for this account', 400, '2FA_NOT_ENABLED')
    }
    
    // Check if already verified in this session
    if (session.twoFactorVerified) {
      return NextResponse.json({
        success: true,
        message: 'Already verified',
      })
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
    
    // Apply progressive delay
    if (rateLimit.delay) {
      await applyDelay(rateLimit.delay)
    }
    
    // Get full user with secret
    const fullUser = await prisma.user.findUnique({
      where: { id: user.id }
    })
    
    if (!fullUser?.twoFactorSecret) {
      return apiError('2FA not configured', 400, '2FA_NOT_CONFIGURED')
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
        action: 'verify_failed',
        userId: user.id,
        success: false,
        reason: 'invalid_code',
        ...context,
      })
      
      return apiError('Invalid TOTP code', 400, 'INVALID_CODE')
    }
    
    // Mark session as 2FA verified
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
      action: 'verify',
      userId: user.id,
      success: true,
      ...context,
    })
    
    return NextResponse.json({
      success: true,
      message: '2FA verified successfully',
    })
    
  } catch (error) {
    console.error('2FA verify error:', error)
    return apiError('Failed to verify 2FA', 500)
  }
}
