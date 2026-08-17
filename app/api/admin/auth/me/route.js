/**
 * GET /api/admin/auth/me
 * Get current authenticated user
 */

import { NextResponse } from 'next/server'
import { getCurrentSession } from '@/lib/security/session.js'

export async function GET(request) {
  try {
    const session = await getCurrentSession()
    
    if (!session) {
      return NextResponse.json(
        { error: 'Not authenticated', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }
    
    const { user } = session
    
    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        twoFactorEnabled: user.twoFactorEnabled,
      },
      session: {
        twoFactorVerified: session.twoFactorVerified,
        requires2FASetup: !user.twoFactorEnabled && ['SUPERADMIN', 'ADMIN'].includes(user.role),
      }
    })
    
  } catch (error) {
    console.error('Get user error:', error)
    return NextResponse.json(
      { error: 'Server error', code: 'SERVER_ERROR' },
      { status: 500 }
    )
  }
}
