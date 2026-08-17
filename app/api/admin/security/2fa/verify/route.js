/**
 * POST /api/admin/security/2fa/verify
 * Verify TOTP code and enable 2FA
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { 
  verifyTOTP, 
  decryptTOTPSecret,
  generateBackupCodes
} from '@/lib/security/totp.js'

export async function POST(request) {
  try {
    // Rate limit: 10 attempts, then block for 15 minutes
    const ip = getClientIP(request)
    const rateCheck = checkRateLimit(`2fa-verify:${ip}`, 10, 900000)
    
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
    
    // Check if user can enable 2FA (admins always can, others need permission)
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN'
    if (!isAdmin && !user.twoFactorAllowed) {
      return NextResponse.json({ error: '2FA nu este activat pentru contul tău. Contactează un administrator.' }, { status: 403 })
    }
    
    if (user.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA este deja activat' }, { status: 400 })
    }
    
    if (!user.twoFactorSecret) {
      return NextResponse.json({ error: 'Trebuie să inițializezi setup-ul mai întâi' }, { status: 400 })
    }
    
    // Verify the code
    const decryptedSecret = decryptTOTPSecret(user.twoFactorSecret)
    const isValid = verifyTOTP(code, decryptedSecret)
    
    if (!isValid) {
      return NextResponse.json({ error: 'Cod invalid. Încearcă din nou.' }, { status: 400 })
    }
    
    // Generate backup codes
    const { plainCodes, hashedCodes } = generateBackupCodes(10)
    
    // Enable 2FA and create backup codes in a transaction
    await prisma.$transaction([
      // Enable 2FA on user
      prisma.user.update({
        where: { id: user.id },
        data: {
          twoFactorEnabled: true,
          twoFactorSetupAt: new Date()
        }
      }),
      // Delete any existing backup codes
      prisma.backupCode.deleteMany({
        where: { userId: user.id }
      }),
      // Create new backup codes
      prisma.backupCode.createMany({
        data: hashedCodes.map(codeHash => ({
          userId: user.id,
          codeHash
        }))
      })
    ])
    
    return NextResponse.json({
      success: true,
      backupCodes: plainCodes,
      message: '2FA activat cu succes!'
    })
  } catch (error) {
    console.error('2FA verify error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
