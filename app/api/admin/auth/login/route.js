/**
 * POST /api/admin/auth/login
 * Admin login with email + password
 * Returns session or requires 2FA verification
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { verifyPassword } from '@/lib/security/argon2.js'
import { 
  checkRateLimit, 
  recordFailedAttempt, 
  resetRateLimit, 
  applyDelay 
} from '@/lib/security/rate-limit.js'
import { createSession, setSessionCookies, getDeviceIdFromCookies } from '@/lib/security/session.js'
import { auditLogin } from '@/lib/security/audit.js'
import { alertBruteForce } from '@/lib/security/alerts.js'
import { 
  shouldRequireCaptcha, 
  verifyCaptcha, 
  recordCaptchaFailure, 
  resetCaptchaState 
} from '@/lib/security/captcha.js'
import { 
  getClientIP, 
  getUserAgent, 
  genericAuthError, 
  apiError 
} from '@/lib/security/guards.js'

export async function POST(request) {
  const ipAddress = await getClientIP()
  const userAgent = await getUserAgent()
  const deviceId = await getDeviceIdFromCookies()
  
  try {
    // Parse body
    const body = await request.json()
    const { email, password, captchaToken } = body
    
    // Basic validation
    if (!email || !password) {
      return apiError('Email și parola sunt obligatorii', 400)
    }
    
    const normalizedEmail = email.toLowerCase().trim()
    
    // Check CAPTCHA requirement
    const needsCaptcha = await shouldRequireCaptcha(normalizedEmail) || 
                         await shouldRequireCaptcha(ipAddress)
    
    if (needsCaptcha) {
      const captchaResult = await verifyCaptcha(captchaToken, ipAddress)
      if (!captchaResult.success) {
        return apiError('CAPTCHA verification failed', 400, 'CAPTCHA_REQUIRED')
      }
    }
    
    // Check rate limit
    const rateLimit = await checkRateLimit({
      action: 'login',
      identifier: normalizedEmail,
      ip: ipAddress,
      deviceId,
    })
    
    if (!rateLimit.allowed) {
      return NextResponse.json(
        { 
          error: 'Prea multe încercări. Încercați din nou mai târziu.',
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
    
    // Find user - IMPORTANT: same timing whether user exists or not
    const user = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })
    
    // Verify password - do this even if user doesn't exist (timing attack prevention)
    const dummyHash = '$argon2id$v=19$m=19456,t=2,p=1$dGVzdHNhbHQ$dGVzdGhhc2g' // Dummy hash
    const passwordValid = await verifyPassword(
      user?.password || dummyHash, 
      password
    )
    
    // Check various failure conditions
    if (!user || !passwordValid || !user.active) {
      // Record failed attempt
      await recordFailedAttempt({
        action: 'login',
        identifier: normalizedEmail,
        ip: ipAddress,
        deviceId,
      })
      
      await recordCaptchaFailure(normalizedEmail)
      await recordCaptchaFailure(ipAddress)
      
      // Audit failed login
      await auditLogin({
        userId: user?.id,
        email: normalizedEmail,
        success: false,
        reason: !user ? 'user_not_found' : !passwordValid ? 'invalid_password' : 'account_disabled',
        ipAddress,
        deviceId,
        userAgent,
      })
      
      // Check if this triggers brute force alert
      if (rateLimit.remaining <= 1) {
        await alertBruteForce({
          email: normalizedEmail,
          ipAddress,
          attempts: 5 - rateLimit.remaining + 1,
        })
      }
      
      // Return generic error (no info leakage)
      return genericAuthError()
    }
    
    // Check if user is admin (only they can access admin panel)
    if (!['SUPERADMIN', 'ADMIN'].includes(user.role)) {
      await auditLogin({
        userId: user.id,
        email: normalizedEmail,
        success: false,
        reason: 'insufficient_role',
        ipAddress,
        deviceId,
        userAgent,
      })
      
      return genericAuthError()
    }
    
    // Success - clear rate limit and CAPTCHA state
    await resetRateLimit({
      action: 'login',
      identifier: normalizedEmail,
      ip: ipAddress,
      deviceId,
    })
    
    await resetCaptchaState(normalizedEmail)
    await resetCaptchaState(ipAddress)
    
    // Check if 2FA is required
    const requires2FA = user.twoFactorEnabled
    
    // Create session
    const { token, session, deviceId: newDeviceId } = await createSession({
      userId: user.id,
      twoFactorVerified: !requires2FA, // If no 2FA, mark as verified
      ipAddress,
      userAgent,
      deviceId,
    })
    
    // Set cookies
    await setSessionCookies(token, newDeviceId)
    
    // Audit successful login
    await auditLogin({
      userId: user.id,
      email: normalizedEmail,
      success: true,
      ipAddress,
      deviceId: newDeviceId,
      userAgent,
    })
    
    // Build response
    const response = {
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      requires2FA,
      requires2FASetup: !user.twoFactorEnabled && ['SUPERADMIN', 'ADMIN'].includes(user.role),
    }
    
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('Login error:', error)
    
    // Log error but return generic message
    await auditLogin({
      userId: null,
      email: 'unknown',
      success: false,
      reason: `server_error: ${error.message}`,
      ipAddress,
      deviceId,
      userAgent,
    })
    
    return apiError('A apărut o eroare. Încercați din nou.', 500)
  }
}
