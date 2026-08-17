/**
 * Cryptographic utilities for secure auth
 * AES-256-GCM encryption for TOTP secrets
 * Argon2id for password hashing
 */

import crypto from 'crypto'

// AES-256-GCM requires 32 bytes key
const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY
const ALGORITHM = 'aes-256-gcm'
const IV_LENGTH = 16
const AUTH_TAG_LENGTH = 16

/**
 * Encrypts data using AES-256-GCM
 * @param {string} plaintext - Data to encrypt
 * @returns {string} - Encrypted data in format: iv:authTag:ciphertext (all base64)
 */
export function encrypt(plaintext) {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }
  
  const key = Buffer.from(ENCRYPTION_KEY, 'hex')
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)')
  }
  
  const iv = crypto.randomBytes(IV_LENGTH)
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH
  })
  
  let ciphertext = cipher.update(plaintext, 'utf8', 'base64')
  ciphertext += cipher.final('base64')
  
  const authTag = cipher.getAuthTag()
  
  // Format: iv:authTag:ciphertext (all base64)
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${ciphertext}`
}

/**
 * Decrypts data using AES-256-GCM
 * @param {string} encryptedData - Encrypted data in format: iv:authTag:ciphertext
 * @returns {string} - Decrypted plaintext
 */
export function decrypt(encryptedData) {
  if (!ENCRYPTION_KEY) {
    throw new Error('ENCRYPTION_KEY environment variable is not set')
  }
  
  const key = Buffer.from(ENCRYPTION_KEY, 'hex')
  if (key.length !== 32) {
    throw new Error('ENCRYPTION_KEY must be 32 bytes (64 hex characters)')
  }
  
  const parts = encryptedData.split(':')
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data format')
  }
  
  const iv = Buffer.from(parts[0], 'base64')
  const authTag = Buffer.from(parts[1], 'base64')
  const ciphertext = parts[2]
  
  const decipher = crypto.createDecipheriv(ALGORITHM, key, iv, {
    authTagLength: AUTH_TAG_LENGTH
  })
  decipher.setAuthTag(authTag)
  
  let plaintext = decipher.update(ciphertext, 'base64', 'utf8')
  plaintext += decipher.final('utf8')
  
  return plaintext
}

/**
 * Generates a cryptographically secure random token
 * @param {number} bytes - Number of random bytes
 * @returns {string} - Hex encoded token
 */
export function generateSecureToken(bytes = 32) {
  return crypto.randomBytes(bytes).toString('hex')
}

/**
 * Generates a cryptographically secure random token (URL safe base64)
 * @param {number} bytes - Number of random bytes
 * @returns {string} - URL-safe base64 encoded token
 */
export function generateSecureTokenBase64(bytes = 32) {
  return crypto.randomBytes(bytes)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

/**
 * Hash a value using SHA-256 (for tokens, backup codes, etc.)
 * @param {string} value - Value to hash
 * @returns {string} - Hex encoded hash
 */
export function hashSHA256(value) {
  return crypto.createHash('sha256').update(value).digest('hex')
}

/**
 * Constant-time comparison to prevent timing attacks
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {boolean} - Whether strings are equal
 */
export function constantTimeCompare(a, b) {
  if (typeof a !== 'string' || typeof b !== 'string') {
    return false
  }
  
  const bufA = Buffer.from(a)
  const bufB = Buffer.from(b)
  
  if (bufA.length !== bufB.length) {
    // Still do comparison to maintain constant time
    crypto.timingSafeEqual(bufA, bufA)
    return false
  }
  
  return crypto.timingSafeEqual(bufA, bufB)
}

/**
 * Generate a device ID cookie value
 * @returns {string} - Device ID
 */
export function generateDeviceId() {
  return `dev_${generateSecureTokenBase64(24)}`
}
