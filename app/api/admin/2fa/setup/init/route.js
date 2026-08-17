/**
 * POST /api/admin/2fa/setup/init
 * Initialize 2FA setup - generates secret and QR code
 * Requires authenticated session
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { getCurrentSession } from '@/lib/security/session.js'
import { 
  generateTOTPSecret, 
  generateTOTPUri, 
  generateQRCode,
  encryptTOTPSecret
} from '@/lib/security/totp.js'
import { audit2FA } from '@/lib/security/audit.js'
import { getRequestContext, apiError } from '@/lib/security/guards.js'

export async function POST(request) {
  try {
    const session = await getCurrentSession()
    
    if (!session) {
      return apiError('Unauthorized', 401, 'UNAUTHORIZED')
    }
    
    const { user } = session
    const context = await getRequestContext()
    
    // Check if 2FA is already enabled
    if (user.twoFactorEnabled) {
      return apiError('2FA is already enabled', 400, '2FA_ALREADY_ENABLED')
    }
    
    // Generate new TOTP secret
    const secret = generateTOTPSecret()
    const uri = generateTOTPUri(secret, user.email)
    const qrCode = await generateQRCode(uri)
    
    // Store encrypted secret temporarily (not yet enabled)
    // We store it so it persists across verify request
    const encryptedSecret = encryptTOTPSecret(secret)
    
    await prisma.user.update({
      where: { id: user.id },
      data: {
        twoFactorSecret: encryptedSecret,
        // Note: twoFactorEnabled stays false until verify
      }
    })
    
    // Audit
    await audit2FA({
      action: 'setup_init',
      userId: user.id,
      success: true,
      ...context,
    })
    
    return NextResponse.json({
      success: true,
      secret, // Show to user for manual entry
      qrCode, // Data URL for QR code image
      uri, // For manual entry apps
    })
    
  } catch (error) {
    console.error('2FA setup init error:', error)
    return apiError('Failed to initialize 2FA setup', 500)
  }
}
