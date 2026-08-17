/**
 * GET /api/admin/security/2fa/status
 * Get current 2FA status for the logged-in user
 */

import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import prisma from '@/lib/prisma'

export async function GET() {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }
    
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: { twoFactorEnabled: true, twoFactorAllowed: true, role: true }
    })
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 })
    }
    
    const isAdmin = user.role === 'ADMIN' || user.role === 'SUPERADMIN'
    // Admins can always enable 2FA, others need explicit permission
    const canEnable2FA = isAdmin || user.twoFactorAllowed
    
    return NextResponse.json({
      enabled: user.twoFactorEnabled,
      canEnable2FA,
      isAdmin
    })
  } catch (error) {
    console.error('2FA status error:', error)
    return NextResponse.json({ error: 'Server error' }, { status: 500 })
  }
}
