/**
 * POST /api/admin/auth/reset-password
 * Reset password using token
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { hashSHA256 } from '@/lib/security/crypto.js'
import { hashPassword, validatePasswordStrength } from '@/lib/security/argon2.js'
import { checkRateLimit, recordFailedAttempt } from '@/lib/security/rate-limit.js'
import { createAuditLog, SEVERITY } from '@/lib/security/audit.js'
import { deleteAllUserSessions } from '@/lib/security/session.js'
import { getClientIP, getUserAgent, apiError } from '@/lib/security/guards.js'

export async function POST(request) {
  const ipAddress = await getClientIP()
  const userAgent = await getUserAgent()
  
  // Constant time response
  const startTime = Date.now()
  const MIN_RESPONSE_TIME = 500
  
  try {
    const body = await request.json()
    const { token, password } = body
    
    if (!token || !password) {
      return apiError('Token and password are required', 400)
    }
    
    // Rate limit by token
    const rateLimit = await checkRateLimit({
      action: 'reset-password',
      identifier: token.substring(0, 16), // Use partial token for rate limit key
      ip: ipAddress,
    })
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Too many requests. Try again later.',
          retryAfter: rateLimit.retryAfter,
        },
        { status: 429 }
      )
    }
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.valid) {
      return apiError(passwordValidation.errors.join('. '), 400, 'WEAK_PASSWORD')
    }
    
    // Hash the token to compare with stored hash
    const tokenHash = hashSHA256(token)
    
    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: tokenHash,
        passwordResetExpires: { gt: new Date() },
      }
    })
    
    if (!user) {
      await recordFailedAttempt({
        action: 'reset-password',
        identifier: token.substring(0, 16),
        ip: ipAddress,
      })
      
      await createAuditLog({
        action: 'reset_password_invalid_token',
        details: { tokenPrefix: token.substring(0, 8) },
        ipAddress,
        userAgent,
        severity: SEVERITY.WARNING,
        success: false,
      })
      
      // Constant time response
      const elapsed = Date.now() - startTime
      if (elapsed < MIN_RESPONSE_TIME) {
        await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME - elapsed))
      }
      
      return apiError('Invalid or expired reset token', 400, 'INVALID_TOKEN')
    }
    
    // Hash new password
    const passwordHash = await hashPassword(password)
    
    // Update password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: passwordHash,
        passwordResetToken: null,
        passwordResetExpires: null,
      }
    })
    
    // Invalidate all existing sessions (security best practice)
    await deleteAllUserSessions(user.id)
    
    // Audit
    await createAuditLog({
      action: 'reset_password',
      actorId: user.id,
      details: { email: user.email },
      ipAddress,
      userAgent,
      severity: SEVERITY.INFO,
      success: true,
    })
    
    return NextResponse.json({
      success: true,
      message: 'Password reset successfully. Please login with your new password.',
    })
    
  } catch (error) {
    console.error('Reset password error:', error)
    return apiError('Failed to reset password', 500)
  }
}
