/**
 * POST /api/admin/security/2fa/setup
 * Initialize 2FA setup - generates secret and QR code
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'
import { checkRateLimit, getClientIP } from '@/lib/rate-limit'
import { 
  generateTOTPSecret, 
  generateTOTPUri, 
  generateQRCode,
  encryptTOTPSecret
} from '@/lib/security/totp.js'

export async function POST(request) {
  try {
    // Rate limit: 10 attempts, then block for 15 minutes
    const ip = getClientIP(request)
    const rateCheck = checkRateLimit(`2fa-setup:${ip}`, 10, 900000)
    
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
    
    // Check if user can enable 2FA (admins always can, others need permission)
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN'
    if (!isAdmin && !user.twoFactorAllowed) {
      return NextResponse.json({ error: '2FA nu este activat pentru contul tău. Contactează un administrator.' }, { status: 403 })
    }
    
    if (user.twoFactorEnabled) {
      return NextResponse.json({ error: '2FA este deja activat' }, { status: 400 })
    }
    
    // Generate new TOTP secret
    const secret = generateTOTPSecret()
    const uri = generateTOTPUri(secret, user.email)
    const qrCode = await generateQRCode(uri)
    
    // Store encrypted secret temporarily (not yet enabled)
    const encryptedSecret = encryptTOTPSecret(secret)
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: encryptedSecret,
        // twoFactorEnabled stays false until verify
      }
    })
    
    return NextResponse.json({
      qrCode,
      secret, // Show to user for manual entry
      message: 'Scanează codul QR cu Google Authenticator'
    })
  } catch (error) {
    console.error('2FA setup error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
