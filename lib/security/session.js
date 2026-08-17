/**
 * Session management utilities
 * Secure session handling with device tracking
 */

import prisma from '@/lib/prisma'
import { generateSecureTokenBase64, hashSHA256, generateDeviceId } from './crypto.js'

// Dynamic import for cookies (only available in route handlers)
async function getCookiesStore() {
  const { cookies } = await import('next/headers')
  return await cookies()
}

// Session configuration
const SESSION_CONFIG = {
  tokenLength: 32, // bytes
  expirationHours: parseInt(process.env.SESSION_EXPIRATION_HOURS) || 24,
  cookieName: 'session_token',
  deviceCookieName: 'device_id',
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
}

/**
 * Create a new session for a user
 * @param {Object} params
 * @param {string} params.userId - User ID
 * @param {boolean} params.twoFactorVerified - Whether 2FA is verified
 * @param {string} [params.ipAddress] - IP address
 * @param {string} [params.userAgent] - User agent string
 * @param {string} [params.deviceId] - Device ID (existing or new)
 * @returns {Promise<{ token: string, session: Object, deviceId: string }>}
 */
export async function createSession({
  userId,
  twoFactorVerified = false,
  ipAddress = null,
  userAgent = null,
  deviceId = null,
}) {
  // Generate session token
  const token = generateSecureTokenBase64(SESSION_CONFIG.tokenLength)
  const tokenHash = hashSHA256(token)
  
  // Generate or use existing device ID
  const finalDeviceId = deviceId || generateDeviceId()
  
  // Calculate expiration
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + SESSION_CONFIG.expirationHours)
  
  // Create session in database
  const session = await prisma.authSession.create({
    data: {
      userId,
      token: tokenHash,
      deviceId: finalDeviceId,
      ipAddress,
      userAgent: userAgent ? userAgent.substring(0, 500) : null,
      twoFactorVerified,
      recent2faAt: twoFactorVerified ? new Date() : null,
      expiresAt,
    }
  })
  
  return { token, session, deviceId: finalDeviceId }
}

/**
 * Get session from token
 * @param {string} token - Raw session token
 * @returns {Promise<Object|null>} - Session with user data or null
 */
export async function getSessionByToken(token) {
  if (!token) return null
  
  const tokenHash = hashSHA256(token)
  
  const session = await prisma.authSession.findUnique({
    where: { token: tokenHash },
    include: {
      user: {
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
          twoFactorEnabled: true,
        }
      }
    }
  })
  
  if (!session) return null
  
  // Check if expired
  if (session.expiresAt < new Date()) {
    await prisma.authSession.delete({ where: { id: session.id } })
    return null
  }
  
  // Check if user is active
  if (!session.user.active) {
    await prisma.authSession.delete({ where: { id: session.id } })
    return null
  }
  
  return session
}

/**
 * Get current session from cookies
 * @returns {Promise<Object|null>}
 */
export async function getCurrentSession() {
  const cookieStore = await getCookiesStore()
  const token = cookieStore.get(SESSION_CONFIG.cookieName)?.value
  return getSessionByToken(token)
}

/**
 * Get device ID from cookies
 * @returns {Promise<string|null>}
 */
export async function getDeviceIdFromCookies() {
  const cookieStore = await getCookiesStore()
  return cookieStore.get(SESSION_CONFIG.deviceCookieName)?.value || null
}

/**
 * Set session cookies
 * @param {string} token - Session token
 * @param {string} deviceId - Device ID
 */
export async function setSessionCookies(token, deviceId) {
  const cookieStore = await getCookiesStore()
  
  const baseOptions = {
    httpOnly: true,
    secure: SESSION_CONFIG.secure,
    sameSite: SESSION_CONFIG.sameSite,
    path: '/',
  }
  
  // Session cookie (expires when browser closes or at session expiration)
  cookieStore.set(SESSION_CONFIG.cookieName, token, {
    ...baseOptions,
    maxAge: SESSION_CONFIG.expirationHours * 60 * 60,
  })
  
  // Device ID cookie (long-lived)
  cookieStore.set(SESSION_CONFIG.deviceCookieName, deviceId, {
    ...baseOptions,
    maxAge: 365 * 24 * 60 * 60, // 1 year
  })
}

/**
 * Clear session cookies
 */
export async function clearSessionCookies() {
  const cookieStore = await getCookiesStore()
  
  cookieStore.set(SESSION_CONFIG.cookieName, '', {
    httpOnly: true,
    secure: SESSION_CONFIG.secure,
    sameSite: SESSION_CONFIG.sameSite,
    path: '/',
    maxAge: 0,
  })
}

/**
 * Update session 2FA verification
 * @param {string} sessionId - Session ID
 * @param {boolean} verified - Whether 2FA is verified
 */
export async function update2FAVerification(sessionId, verified = true) {
  return prisma.authSession.update({
    where: { id: sessionId },
    data: {
      twoFactorVerified: verified,
      recent2faAt: verified ? new Date() : null,
    }
  })
}

/**
 * Update session recent 2FA timestamp (for step-up)
 * @param {string} sessionId - Session ID
 */
export async function updateRecent2FA(sessionId) {
  return prisma.authSession.update({
    where: { id: sessionId },
    data: {
      recent2faAt: new Date(),
    }
  })
}

/**
 * Delete a session (logout)
 * @param {string} sessionId - Session ID
 */
export async function deleteSession(sessionId) {
  return prisma.authSession.delete({
    where: { id: sessionId }
  })
}

/**
 * Delete all sessions for a user (force logout everywhere)
 * @param {string} userId - User ID
 * @param {string} [exceptSessionId] - Session to keep (current)
 */
export async function deleteAllUserSessions(userId, exceptSessionId = null) {
  const where = { userId }
  
  if (exceptSessionId) {
    where.id = { not: exceptSessionId }
  }
  
  return prisma.authSession.deleteMany({ where })
}

/**
 * Extend session expiration
 * @param {string} sessionId - Session ID
 */
export async function extendSession(sessionId) {
  const expiresAt = new Date()
  expiresAt.setHours(expiresAt.getHours() + SESSION_CONFIG.expirationHours)
  
  return prisma.authSession.update({
    where: { id: sessionId },
    data: { expiresAt }
  })
}

/**
 * Check if session needs step-up 2FA
 * @param {Object} session - Session object
 * @param {number} maxAgeMinutes - Maximum age for recent 2FA (default 10)
 * @returns {boolean} - Whether step-up is required
 */
export function needsStepUp2FA(session, maxAgeMinutes = 10) {
  if (!session.recent2faAt) return true
  
  const maxAgeMs = maxAgeMinutes * 60 * 1000
  const age = Date.now() - new Date(session.recent2faAt).getTime()
  
  return age > maxAgeMs
}

/**
 * Clean up expired sessions (for cron job)
 */
export async function cleanupExpiredSessions() {
  const result = await prisma.authSession.deleteMany({
    where: {
      expiresAt: { lt: new Date() }
    }
  })
  
  console.log(`Cleaned up ${result.count} expired sessions`)
  return result.count
}
