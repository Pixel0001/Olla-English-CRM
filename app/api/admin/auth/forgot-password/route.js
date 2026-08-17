/**
 * POST /api/admin/auth/forgot-password
 * Request password reset (sends email with token)
 * Uses constant-time responses to prevent user enumeration
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { generateSecureToken, hashSHA256 } from '@/lib/security/crypto.js'
import { checkRateLimit, recordFailedAttempt } from '@/lib/security/rate-limit.js'
import { createAuditLog, SEVERITY } from '@/lib/security/audit.js'
import { getClientIP, getUserAgent, apiError } from '@/lib/security/guards.js'

// Token expiration (1 hour)
const TOKEN_EXPIRATION_HOURS = 1

export async function POST(request) {
  const ipAddress = await getClientIP()
  const userAgent = await getUserAgent()
  
  // Start timing for constant-time response
  const startTime = Date.now()
  const MIN_RESPONSE_TIME = 500 // Minimum 500ms to prevent timing attacks
  
  try {
    const body = await request.json()
    const { email } = body
    
    if (!email) {
      return apiError('Email is required', 400)
    }
    
    const normalizedEmail = email.toLowerCase().trim()
    
    // Rate limit
    const rateLimit = await checkRateLimit({
      action: 'forgot-password',
      identifier: normalizedEmail,
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
    
    // Find user (but don't reveal if exists)
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })
    
    // Always perform similar operations regardless of user existence
    const token = generateSecureToken(32)
    const tokenHash = hashSHA256(token)
    const expiresAt = new Date()
    expiresAt.setHours(expiresAt.getHours() + TOKEN_EXPIRATION_HOURS)
    
    if (user && user.active && ['SUPERADMIN', 'ADMIN'].includes(user.role)) {
      // Store reset token
      await prisma.user.update({
        where: { id: user.id },
        data: {
          passwordResetToken: tokenHash,
          passwordResetExpires: expiresAt,
        }
      })
      
      // Build reset URL
      const resetUrl = `${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/admin/reset-password?token=${token}`
      
      // TODO: Send email with reset link
      // await sendEmail({
      //   to: user.email,
      //   subject: 'Password Reset Request',
      //   html: `<p>Click <a href="${resetUrl}">here</a> to reset your password. Link expires in 1 hour.</p>`
      // })
      
      // For now, log it (REMOVE IN PRODUCTION)
      console.log(`Password reset link for ${user.email}: ${resetUrl}`)
      
      // Audit
      await createAuditLog({
        action: 'forgot_password',
        actorId: user.id,
        details: { email: normalizedEmail },
        ipAddress,
        userAgent,
        severity: SEVERITY.INFO,
        success: true,
      })
    } else {
      // Record as potential enumeration attempt
      await recordFailedAttempt({
        action: 'forgot-password',
        identifier: normalizedEmail,
        ip: ipAddress,
      })
      
      // Audit (without revealing user existence)
      await createAuditLog({
        action: 'forgot_password_attempt',
        details: { email: normalizedEmail },
        ipAddress,
        userAgent,
        severity: SEVERITY.INFO,
        success: true,
      })
    }
    
    // Ensure constant response time
    const elapsed = Date.now() - startTime
    if (elapsed < MIN_RESPONSE_TIME) {
      await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME - elapsed))
    }
    
    // Always return same response (no user enumeration)
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    })
    
  } catch (error) {
    console.error('Forgot password error:', error)
    
    // Ensure constant response time even on error
    const elapsed = Date.now() - startTime
    if (elapsed < MIN_RESPONSE_TIME) {
      await new Promise(resolve => setTimeout(resolve, MIN_RESPONSE_TIME - elapsed))
    }
    
    // Return same generic message
    return NextResponse.json({
      success: true,
      message: 'If an account exists with this email, a password reset link has been sent.',
    })
  }
}
