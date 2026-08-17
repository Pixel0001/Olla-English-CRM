/**
 * POST /api/admin/security/2fa/validate
 * Validate TOTP code for protected actions (not for setup)
 * Returns a short-lived token that can be used to authorize sensitive operations
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { verifyTOTP, decryptTOTPSecret } from '@/lib/security/totp.js'
import { storeActionToken, recordFailedAttempt, clearFailedAttempts, MAX_FAILED_ATTEMPTS } from '@/lib/security/action-tokens'
import crypto from 'crypto'

export async function POST(request) {
  try {
    // Get request info for logging
    const ip = getClientIP(request)
    const userAgent = request.headers.get('user-agent') || 'unknown'
    const referer = request.headers.get('referer') || 'unknown'
    const endpoint = '/api/admin/security/2fa/validate'
    
    // Rate limit: 10 attempts, then block for 15 minutes
    const rateCheck = checkRateLimit(`2fa-validate:${ip}`, 10, 900000)
    
    if (!rateCheck.success) {
      const minutesLeft = Math.ceil(rateCheck.resetIn / 60000)
      return NextResponse.json(
        { error: `Prea multe încercări. Așteaptă ${minutesLeft} minute.` },
        { status: 429 }
      )
    }
    
    const session = await getServerSession(authOptions)
    
    console.log('2FA validate - session:', session?.user?.email, 'role:', session?.user?.role)
    
    if (!session?.user?.email) {
      console.log('2FA validate - No session found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const body = await request.json()
    const { code } = body
    
    if (!code || code.length !== 6) {
      return NextResponse.json({ error: 'Cod invalid' }, { status: 400 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // User must have 2FA enabled
    if (!user.twoFactorEnabled || !user.twoFactorSecret) {
      return NextResponse.json({ 
        error: 'Trebuie să activezi 2FA înainte de a efectua această acțiune',
        requires2FASetup: true 
      }, { status: 403 })
    }
    
    // Verify the code
    let secret
    try {
      secret = decryptTOTPSecret(user.twoFactorSecret)
    } catch (error) {
      console.error('Failed to decrypt TOTP secret:', error)
      return NextResponse.json({ error: 'Eroare de securitate. Contactează administratorul.' }, { status: 500 })
    }
    
    const isValid = verifyTOTP(code, secret)
    
    if (!isValid) {
      // Record failed attempt
      const attemptResult = recordFailedAttempt(user.id)
      
      // Log the failed attempt
      await prisma.auditLog.create({
        data: {
          action: 'FAILED_2FA_ATTEMPT',
          actorId: user.id,
          ipAddress: ip,
          details: { 
            message: `Încercare 2FA eșuată (${attemptResult.totalAttempts}/${MAX_FAILED_ATTEMPTS})`,
            endpoint: endpoint,
            userAgent: userAgent,
            referer: referer
          }
        }
      })
      
      // If max attempts reached, force logout
      if (attemptResult.shouldLogout) {
        // Log security event
        await prisma.auditLog.create({
          data: {
            action: 'SESSION_TERMINATED',
            actorId: user.id,
            ipAddress: ip,
            severity: 'critical',
            details: { 
              message: `Sesiune terminată automat - ${MAX_FAILED_ATTEMPTS} încercări 2FA eșuate consecutive`,
              endpoint: endpoint,
              userAgent: userAgent,
              referer: referer
            }
          }
        })
        
        // Create security alert
        await prisma.securityAlert.create({
          data: {
            type: 'SUSPICIOUS_ACTIVITY',
            severity: 'critical',
            title: 'Sesiune terminată - Încercări 2FA eșuate',
            message: `Sesiune terminată pentru utilizatorul ${user.email} - ${MAX_FAILED_ATTEMPTS} încercări 2FA eșuate consecutive`,
            userId: user.id,
            ipAddress: ip,
            details: {
              action: 'forced_logout',
              reason: 'max_failed_2fa_attempts',
              attempts: attemptResult.totalAttempts,
              endpoint: endpoint,
              userAgent: userAgent,
              referer: referer
            }
          }
        })
        
        return NextResponse.json({ 
          error: `Prea multe încercări eșuate (${MAX_FAILED_ATTEMPTS}). Sesiunea a fost închisă din motive de securitate.`,
          valid: false,
          forceLogout: true 
        }, { status: 401 })
      }
      
      return NextResponse.json({ 
        error: `Cod incorect. Mai ai ${attemptResult.attemptsLeft} încercări.`, 
        valid: false,
        attemptsLeft: attemptResult.attemptsLeft
      }, { status: 401 })
    }
    
    // Successful verification - clear failed attempts
    clearFailedAttempts(user.id)
    
    // Generate a short-lived action token (valid for 5 minutes)
    const actionToken = crypto.randomBytes(32).toString('hex')
    storeActionToken(actionToken, user.id, user.email)
    
    return NextResponse.json({ 
      valid: true, 
      token: actionToken,
      expiresIn: 300 // seconds
    })
    
  } catch (error) {
    console.error('2FA validation error:', error)
    return NextResponse.json({ error: 'Eroare la validare' }, { status: 500 })
  }
}
