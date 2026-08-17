/**
 * POST /api/admin/2fa/backup/regenerate
 * Generate new backup codes (requires step-up 2FA)
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getRequestContext, apiError } from '@/lib/security/guards.js'
import { verifyStepUpToken, SENSITIVE_ACTIONS } from '@/lib/security/step-up.js'
import { generateBackupCodes } from '@/lib/security/totp.js'
import { audit2FA } from '@/lib/security/audit.js'

export async function POST(request) {
  const context = await getRequestContext()
  
  try {
    const { session, user, error } = await requireAdmin()
    if (error) return error
    
    // Parse body
    const body = await request.json()
    const { stepUpToken } = body
    
    // Require step-up for security settings
    const stepUpResult = await verifyStepUpToken({
      token: stepUpToken,
      userId: user.id,
      action: SENSITIVE_ACTIONS.SECURITY_SETTINGS,
      ...context,
    })
    
    if (!stepUpResult.valid) {
      return apiError('Step-up verification required', 403, 'STEP_UP_REQUIRED')
    }
    
    // Generate new backup codes
    const { plainCodes, hashedCodes } = generateBackupCodes(10)
    
    // Replace all backup codes
    await prisma.$transaction([
      prisma.backupCode.deleteMany({
        where: { userId: user.id }
      }),
      prisma.backupCode.createMany({
        data: hashedCodes.map(codeHash => ({
          userId: user.id,
          codeHash,
        }))
      })
    ])
    
    // Audit
    await audit2FA({
      action: 'backup_regenerated',
      userId: user.id,
      success: true,
      ...context,
    })
    
    return NextResponse.json({
      success: true,
      backupCodes: plainCodes,
      warning: 'Save these backup codes securely. Old codes are now invalid.',
    })
    
  } catch (error) {
    console.error('Backup regenerate error:', error)
    return apiError('Failed to regenerate backup codes', 500)
  }
}
