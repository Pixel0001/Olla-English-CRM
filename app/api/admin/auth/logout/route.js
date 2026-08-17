/**
 * POST /api/admin/auth/logout
 * Logout - destroy session
 */

import { NextResponse } from 'next/server'
import { getCurrentSession, deleteSession, clearSessionCookies, getDeviceIdFromCookies } from '@/lib/security/session.js'
import { createAuditLog } from '@/lib/security/audit.js'
import { getClientIP, getUserAgent } from '@/lib/security/guards.js'

export async function POST(request) {
  try {
    const session = await getCurrentSession()
    
    if (session) {
      const ipAddress = await getClientIP()
      const userAgent = await getUserAgent()
      const deviceId = await getDeviceIdFromCookies()
      
      // Delete session from database
      await deleteSession(session.id)
      
      // Audit logout
      await createAuditLog({
        action: 'logout',
        actorId: session.userId,
        ipAddress,
        deviceId,
        userAgent,
        success: true,
      })
    }
    
    // Clear cookies
    await clearSessionCookies()
    
    return NextResponse.json({ success: true })
    
  } catch (error) {
    console.error('Logout error:', error)
    
    // Clear cookies even on error
    await clearSessionCookies()
    
    return NextResponse.json({ success: true })
  }
}
