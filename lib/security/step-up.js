/**
 * Step-up token management for sensitive actions
 * One-time, short-lived, action-scoped tokens
 */

import prisma from '@/lib/prisma'
import { generateSecureTokenBase64, hashSHA256 } from './crypto.js'

// Step-up token configuration
const STEP_UP_CONFIG = {
  tokenLength: 32, // bytes
  expirationSeconds: parseInt(process.env.STEP_UP_TOKEN_EXPIRATION) || 60, // 60 seconds default
  // Actions that ALWAYS require step-up (even if recent2faAt is fresh)
  alwaysRequireStepUp: ['createAdmin', 'createTeacher', 'createUser'],
  // Actions that require step-up if recent2faAt > 10 min
  standardStepUpActions: ['changeRole', 'export', 'delete', 'securitySettings'],
}

// Sensitive actions enum
export const SENSITIVE_ACTIONS = {
  CREATE_USER: 'createUser',
  CREATE_ADMIN: 'createAdmin',
  CREATE_TEACHER: 'createTeacher',
  CHANGE_ROLE: 'changeRole',
  EXPORT: 'export',
  DELETE: 'delete',
  SECURITY_SETTINGS: 'securitySettings',
}

/**
 * Create a step-up token for a sensitive action
 * @param {Object} params
 * @param {string} params.userId - User ID requesting the action
 * @param {string} params.action - Action type
 * @param {string} [params.ipAddress] - IP address
 * @param {string} [params.deviceId] - Device ID
 * @returns {Promise<{ token: string, expiresAt: Date }>}
 */
export async function createStepUpToken({
  userId,
  action,
  ipAddress = null,
  deviceId = null,
}) {
  // Validate action
  const validActions = Object.values(SENSITIVE_ACTIONS)
  if (!validActions.includes(action)) {
    throw new Error(`Invalid step-up action: ${action}`)
  }
  
  // Generate token
  const token = generateSecureTokenBase64(STEP_UP_CONFIG.tokenLength)
  const tokenHash = hashSHA256(token)
  
  // Calculate expiration
  const expiresAt = new Date()
  expiresAt.setSeconds(expiresAt.getSeconds() + STEP_UP_CONFIG.expirationSeconds)
  
  // Delete any existing unused tokens for this user/action
  await prisma.stepUpToken.deleteMany({
    where: {
      userId,
      action,
      used: false,
    }
  })
  
  // Create new token
  await prisma.stepUpToken.create({
    data: {
      tokenHash,
      userId,
      action,
      ipAddress,
      deviceId,
      expiresAt,
    }
  })
  
  return { token, expiresAt }
}

/**
 * Verify and consume a step-up token
 * @param {Object} params
 * @param {string} params.token - Step-up token
 * @param {string} params.userId - User ID
 * @param {string} params.action - Action being performed
 * @param {string} [params.ipAddress] - Current IP address
 * @param {string} [params.deviceId] - Current device ID
 * @returns {Promise<{ valid: boolean, reason?: string }>}
 */
export async function verifyStepUpToken({
  token,
  userId,
  action,
  ipAddress = null,
  deviceId = null,
}) {
  if (!token) {
    return { valid: false, reason: 'No step-up token provided' }
  }
  
  const tokenHash = hashSHA256(token)
  
  // Find token
  const stepUpToken = await prisma.stepUpToken.findUnique({
    where: { tokenHash }
  })
  
  if (!stepUpToken) {
    return { valid: false, reason: 'Invalid step-up token' }
  }
  
  // Check if already used
  if (stepUpToken.used) {
    return { valid: false, reason: 'Step-up token already used' }
  }
  
  // Check if expired
  if (stepUpToken.expiresAt < new Date()) {
    // Delete expired token
    await prisma.stepUpToken.delete({ where: { tokenHash } })
    return { valid: false, reason: 'Step-up token expired' }
  }
  
  // Check if user matches
  if (stepUpToken.userId !== userId) {
    return { valid: false, reason: 'Step-up token user mismatch' }
  }
  
  // Check if action matches
  if (stepUpToken.action !== action) {
    return { valid: false, reason: 'Step-up token action mismatch' }
  }
  
  // Optional: Check IP address (can be disabled if users have dynamic IPs)
  // if (stepUpToken.ipAddress && stepUpToken.ipAddress !== ipAddress) {
  //   return { valid: false, reason: 'Step-up token IP mismatch' }
  // }
  
  // Optional: Check device ID
  if (stepUpToken.deviceId && stepUpToken.deviceId !== deviceId) {
    return { valid: false, reason: 'Step-up token device mismatch' }
  }
  
  // Mark token as used (one-time use)
  await prisma.stepUpToken.update({
    where: { tokenHash },
    data: { used: true }
  })
  
  return { valid: true }
}

/**
 * Check if an action requires step-up
 * @param {string} action - Action type
 * @param {Date|null} recent2faAt - Last 2FA verification time
 * @returns {{ required: boolean, alwaysRequired: boolean }}
 */
export function isStepUpRequired(action, recent2faAt) {
  // Actions that always require step-up
  if (STEP_UP_CONFIG.alwaysRequireStepUp.includes(action)) {
    return { required: true, alwaysRequired: true }
  }
  
  // Standard actions check recent2faAt
  if (STEP_UP_CONFIG.standardStepUpActions.includes(action)) {
    if (!recent2faAt) {
      return { required: true, alwaysRequired: false }
    }
    
    const maxAgeMs = 10 * 60 * 1000 // 10 minutes
    const age = Date.now() - new Date(recent2faAt).getTime()
    
    return { required: age > maxAgeMs, alwaysRequired: false }
  }
  
  return { required: false, alwaysRequired: false }
}

/**
 * Map user creation role to action
 * @param {string} role - User role
 * @returns {string} - Action type
 */
export function getCreateUserAction(role) {
  if (role === 'ADMIN') return SENSITIVE_ACTIONS.CREATE_ADMIN
  if (role === 'TEACHER') return SENSITIVE_ACTIONS.CREATE_TEACHER
  return SENSITIVE_ACTIONS.CREATE_USER
}

/**
 * Clean up expired step-up tokens (for cron job)
 */
export async function cleanupExpiredStepUpTokens() {
  const result = await prisma.stepUpToken.deleteMany({
    where: {
      OR: [
        { expiresAt: { lt: new Date() } },
        { used: true } // Delete used tokens too
      ]
    }
  })
  
  console.log(`Cleaned up ${result.count} expired step-up tokens`)
  return result.count
}
