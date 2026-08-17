/**
 * POST /api/admin/security/2fa/disable
 * Disable 2FA for the logged-in user
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { createAuditLog, SEVERITY } from '@/lib/security/audit.js'

export async function POST(request) {
  try {
    // Rate limit: 10 attempts, then block for 15 minutes
    const ip = getClientIP(request)
    const rateCheck = checkRateLimit(`2fa-disable:${ip}`, 10, 900000)
    
    if (!rateCheck.success) {
      const minutesLeft = Math.ceil(rateCheck.resetIn / 60000)
      return NextResponse.json(
        { error: `Prea multe încercări. Așteaptă ${minutesLeft} minute.` },
        { status: 429 }
      )
    }
    
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    // Check if user can manage 2FA (admins always can, others need permission)
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN'
    if (!isAdmin && !user.twoFactorAllowed) {
      return NextResponse.json({ error: '2FA nu este activat pentru contul tău' }, { status: 403 })
    }
    
    if (!user.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA nu este activat' }, { status: 400 })
    }
    
    // Disable 2FA and delete backup codes
    await prisma.$transaction([
      prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorEnabled: false,
          twoFactorSecret: null
        }
      }),
      prisma.backupCode.deleteMany({
        where: { userId: user.id }
      })
    ])
    
    // Audit log - critical security action
    await createAuditLog({
      action: '2fa_disabled',
      actorId: user.id,
      targetId: user.id,
      targetType: 'user',
      ipAddress: ip,
      userAgent: request.headers.get('user-agent'),
      details: { email: user.email },
      severity: SEVERITY.CRITICAL,
      success: true,
    })
    
    return NextResponse.json({
      success: true,
      message: '2FA dezactivat'
    })
  } catch (error) {
    console.error('2FA disable error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
