/**
 * Argon2id password hashing utilities
 * Optimized parameters for serverless (Vercel)
 */

import argon2 from 'argon2'

// Argon2id parameters optimized for serverless
// These are balanced for security vs cold-start performance
const ARGON2_OPTIONS = {
  type: argon2.argon2id, // Argon2id - resistant to both side-channel and GPU attacks
  memoryCost: parseInt(process.env.ARGON2_MEMORY_COST) || 19456, // ~19MB (safe for Vercel 1024MB limit)
  timeCost: parseInt(process.env.ARGON2_TIME_COST) || 2, // 2 iterations
  parallelism: parseInt(process.env.ARGON2_PARALLELISM) || 1, // 1 thread (serverless)
  hashLength: 32, // 256 bits
}

/**
 * Hash a password using Argon2id
 * @param {string} password - Plain text password
 * @returns {Promise<string>} - Argon2id hash string
 */
export async function hashPassword(password) {
  if (!password || typeof password !== 'string') {
    throw new Error('Password must be a non-empty string')
  }
  
  return await argon2.hash(password, ARGON2_OPTIONS)
}

/**
 * Verify a password against an Argon2id hash
 * @param {string} hash - Argon2id hash string
 * @param {string} password - Plain text password to verify
 * @returns {Promise<boolean>} - True if password matches
 */
export async function verifyPassword(hash, password) {
  if (!hash || !password) {
    return false
  }
  
  try {
    return await argon2.verify(hash, password)
  } catch (error) {
    // Log error but return false to prevent information leakage
    console.error('Password verification error:', error.message)
    return false
  }
}

/**
 * Check if a hash needs to be rehashed (parameters changed)
 * @param {string} hash - Argon2id hash string
 * @returns {boolean} - True if hash should be updated
 */
export function needsRehash(hash) {
  if (!hash) return false
  
  try {
    return argon2.needsRehash(hash, ARGON2_OPTIONS)
  } catch {
    return false
  }
}

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {{ valid: boolean, errors: string[] }} - Validation result
 */
export function validatePasswordStrength(password) {
  const errors = []
  
  if (!password || typeof password !== 'string') {
    return { valid: false, errors: ['Parola este obligatorie'] }
  }
  
  if (password.length < 12) {
    errors.push('Parola trebuie să aibă cel puțin 12 caractere')
  }
  
  if (password.length > 128) {
    errors.push('Parola nu poate depăși 128 de caractere')
  }
  
  if (!/[a-z]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin o literă mică')
  }
  
  if (!/[A-Z]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin o literă mare')
  }
  
  if (!/[0-9]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin o cifră')
  }
  
  if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) {
    errors.push('Parola trebuie să conțină cel puțin un caracter special')
  }
  
  // Check for common patterns
  const commonPatterns = [
    /^123456/,
    /password/i,
    /qwerty/i,
    /admin/i,
    /letmein/i,
  ]
  
  for (const pattern of commonPatterns) {
    if (pattern.test(password)) {
      errors.push('Parola conține un pattern comun și ușor de ghicit')
      break
    }
  }
  
  return {
    valid: errors.length === 0,
    errors
  }
}
