/**
 * Auth guard utilities for API routes and pages
 * Provides middleware functions for authentication and authorization
 */

import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { getCurrentSession, getDeviceIdFromCookies } from './session.js'
import { createAuditLog, SEVERITY } from './audit.js'

/**
 * Get client IP from headers
 * @returns {Promise<string>}
 */
export async function getClientIP() {
  const headersList = await headers()
  return headersList.get('x-forwarded-for')?.split(',')[0].trim() 
    || headersList.get('x-real-ip') 
    || 'unknown'
}

/**
 * Get user agent from headers
 * @returns {Promise<string>}
 */
export async function getUserAgent() {
  const headersList = await headers()
  return headersList.get('user-agent') || 'unknown'
}

/**
 * Get request context (IP, device, user agent)
 * @returns {Promise<{ ipAddress: string, deviceId: string|null, userAgent: string }>}
 */
export async function getRequestContext() {
  const [ipAddress, userAgent, deviceId] = await Promise.all([
    getClientIP(),
    getUserAgent(),
    getDeviceIdFromCookies(),
  ])
  
  return { ipAddress, deviceId, userAgent }
}

/**
 * Require authentication - returns session or error response
 * Use in API routes: const { session, error } = await requireAuth()
 * @param {Object} [options]
 * @param {boolean} [options.require2FA] - Require 2FA to be verified
 * @param {string[]} [options.roles] - Required roles
 * @returns {Promise<{ session?: Object, user?: Object, error?: NextResponse }>}
 */
export async function requireAuth(options = {}) {
  const { require2FA = true, roles = null } = options
  
  const session = await getCurrentSession()
  
  if (!session) {
    return {
      error: NextResponse.json(
        { error: 'Unauthorized', code: 'UNAUTHORIZED' },
        { status: 401 }
      )
    }
  }
  
  // Check if user is active
  if (!session.user.active) {
    return {
      error: NextResponse.json(
        { error: 'Account disabled', code: 'ACCOUNT_DISABLED' },
        { status: 403 }
      )
    }
  }
  
  // Check 2FA if required and user has it enabled
  if (require2FA && session.user.twoFactorEnabled && !session.twoFactorVerified) {
    return {
      error: NextResponse.json(
        { error: '2FA verification required', code: '2FA_REQUIRED' },
        { status: 403 }
      )
    }
  }
  
  // Check 2FA setup requirement for admins
  if (require2FA && ['SUPERADMIN', 'ADMIN'].includes(session.user.role) && !session.user.twoFactorEnabled) {
    return {
      error: NextResponse.json(
        { error: '2FA setup required', code: '2FA_SETUP_REQUIRED' },
        { status: 403 }
      )
    }
  }
  
  // Check role if specified
  if (roles && !roles.includes(session.user.role)) {
    const context = await getRequestContext()
    await createAuditLog({
      action: 'unauthorized_access',
      actorId: session.userId,
      details: { 
        requiredRoles: roles,
        userRole: session.user.role,
      },
      ...context,
      severity: SEVERITY.WARNING,
      success: false,
    })
    
    return {
      error: NextResponse.json(
        { error: 'Insufficient permissions', code: 'FORBIDDEN' },
        { status: 403 }
      )
    }
  }
  
  return { session, user: session.user }
}

/**
 * Require admin role
 */
export async function requireAdmin() {
  return requireAuth({ roles: ['SUPERADMIN', 'ADMIN'] })
}

/**
 * Require specific roles
 */
export async function requireRoles(roles) {
  return requireAuth({ roles })
}

/**
 * Create an API error response
 * @param {string} message - Error message
 * @param {number} status - HTTP status code
 * @param {string} [code] - Error code
 * @returns {NextResponse}
 */
export function apiError(message, status, code = null) {
  return NextResponse.json(
    { error: message, ...(code && { code }) },
    { status }
  )
}

/**
 * Create an API success response
 * @param {Object} data - Response data
 * @param {number} [status=200] - HTTP status code
 * @returns {NextResponse}
 */
export function apiSuccess(data, status = 200) {
  return NextResponse.json(data, { status })
}

/**
 * CSRF protection - verify origin header
 * @returns {Promise<{ valid: boolean, error?: string }>}
 */
export async function verifyCSRF() {
  const headersList = await headers()
  const origin = headersList.get('origin')
  const host = headersList.get('host')
  
  // In development, be more lenient
  if (process.env.NODE_ENV !== 'production') {
    return { valid: true }
  }
  
  if (!origin) {
    // Allow requests without origin (same-origin, server-side)
    return { valid: true }
  }
  
  const allowedOrigins = [
    `https://${host}`,
    `http://${host}`, // For local development
    process.env.NEXT_PUBLIC_APP_URL,
  ].filter(Boolean)
  
  if (!allowedOrigins.some(allowed => origin.startsWith(allowed))) {
    return { valid: false, error: 'Invalid origin' }
  }
  
  return { valid: true }
}

/**
 * Validate request body and return parsed JSON
 * @param {Request} request - Fetch Request object
 * @returns {Promise<{ data?: Object, error?: NextResponse }>}
 */
export async function parseRequestBody(request) {
  try {
    const data = await request.json()
    return { data }
  } catch {
    return {
      error: apiError('Invalid JSON body', 400, 'INVALID_BODY')
    }
  }
}

/**
 * Generic safe error response (prevents information leakage)
 * Always use this for auth endpoints
 */
export function genericAuthError() {
  return apiError('Invalid credentials', 401, 'AUTH_FAILED')
}
