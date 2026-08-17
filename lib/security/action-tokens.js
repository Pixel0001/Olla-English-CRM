/**
 * 2FA Action Token Verification Utility
 * Used to verify 2FA tokens for protected actions
 */

// In-memory store for action tokens (shared across routes)
// In production, use Redis or database
const actionTokens = new Map()

// Store for failed 2FA attempts per user (userId => { count, lastAttempt })
const failedAttempts = new Map()

// Max failed attempts before session invalidation
const MAX_FAILED_ATTEMPTS = 5
// Reset failed attempts after this time (15 minutes)
const FAILED_ATTEMPTS_RESET_TIME = 15 * 60 * 1000

// Cleanup old tokens and expired failed attempts every 5 minutes
if (typeof setInterval !== 'undefined') {
  setInterval(() => {
    const now = Date.now()
    for (const [token, data] of actionTokens.entries()) {
      if (now > data.expiresAt) {
        actionTokens.delete(token)
      }
    }
    // Cleanup expired failed attempts
    for (const [userId, data] of failedAttempts.entries()) {
      if (now - data.lastAttempt > FAILED_ATTEMPTS_RESET_TIME) {
        failedAttempts.delete(userId)
      }
    }
  }, 5 * 60 * 1000)
}

/**
 * Store a new action token
 */
export function storeActionToken(token, userId, email) {
  const expiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes
  actionTokens.set(token, {
    userId,
    email,
    expiresAt,
    createdAt: Date.now()
  })
}

/**
 * Verify an action token
 * @param {string} token - The action token to verify
 * @param {string} userEmail - The email of the user making the request
 * @returns {boolean} - Whether the token is valid
 */
export function verifyActionToken(token, userEmail) {
  if (!token) return false
  
  const data = actionTokens.get(token)
  if (!data) return false
  
  if (Date.now() > data.expiresAt) {
    actionTokens.delete(token)
    return false
  }
  
  if (data.email !== userEmail) return false
  
  // Token is single-use - delete after verification
  actionTokens.delete(token)
  return true
}

/**
 * Check if a user has 2FA enabled and require verification
 * Returns an error response if 2FA is required but not provided
 */
export function require2FAToken(token, userEmail, user2FAEnabled) {
  // If user doesn't have 2FA enabled, skip verification
  if (!user2FAEnabled) {
    return { valid: true, skip: true }
  }
  
  // If user has 2FA but no token provided
  if (!token) {
    return { valid: false, error: '2FA verification required', requires2FA: true }
  }
  
  // Verify the token
  if (!verifyActionToken(token, userEmail)) {
    return { valid: false, error: 'Invalid or expired 2FA token', requires2FA: true }
  }
  
  return { valid: true }
}

/**
 * Record a failed 2FA attempt for a user
 * @param {string} userId - The user's ID
 * @returns {object} - { shouldLogout: boolean, attemptsLeft: number, totalAttempts: number }
 */
export function recordFailedAttempt(userId) {
  const now = Date.now()
  const existing = failedAttempts.get(userId)
  
  // Reset count if last attempt was too long ago
  if (existing && now - existing.lastAttempt > FAILED_ATTEMPTS_RESET_TIME) {
    failedAttempts.delete(userId)
  }
  
  const current = failedAttempts.get(userId) || { count: 0, lastAttempt: now }
  current.count += 1
  current.lastAttempt = now
  failedAttempts.set(userId, current)
  
  const shouldLogout = current.count >= MAX_FAILED_ATTEMPTS
  
  return {
    shouldLogout,
    attemptsLeft: Math.max(0, MAX_FAILED_ATTEMPTS - current.count),
    totalAttempts: current.count
  }
}

/**
 * Clear failed attempts for a user (call on successful verification)
 * @param {string} userId - The user's ID
 */
export function clearFailedAttempts(userId) {
  failedAttempts.delete(userId)
}

/**
 * Get current failed attempt count for a user
 * @param {string} userId - The user's ID
 * @returns {number} - Current failed attempt count
 */
export function getFailedAttemptCount(userId) {
  const now = Date.now()
  const existing = failedAttempts.get(userId)
  
  if (!existing) return 0
  
  // Reset if expired
  if (now - existing.lastAttempt > FAILED_ATTEMPTS_RESET_TIME) {
    failedAttempts.delete(userId)
    return 0
  }
  
  return existing.count
}

export { actionTokens, failedAttempts, MAX_FAILED_ATTEMPTS }
