/**
 * Rate limiting with progressive delays
 * Supports Upstash Redis (recommended) with DB fallback
 */

import prisma from '@/lib/prisma'

// Rate limit configurations per action
const RATE_LIMIT_CONFIG = {
  login: {
    maxAttempts: 5,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 30 * 60 * 1000, // 30 minutes
    progressiveDelay: true,
    baseDelayMs: 1000, // 1 second base delay
    maxDelayMs: 30000, // 30 seconds max delay
  },
  '2fa': {
    maxAttempts: 5,
    windowMs: 5 * 60 * 1000, // 5 minutes
    blockDurationMs: 15 * 60 * 1000, // 15 minutes
    progressiveDelay: true,
    baseDelayMs: 2000,
    maxDelayMs: 30000,
  },
  'forgot-password': {
    maxAttempts: 3,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
    progressiveDelay: false,
  },
  'reset-password': {
    maxAttempts: 3,
    windowMs: 15 * 60 * 1000, // 15 minutes
    blockDurationMs: 60 * 60 * 1000, // 1 hour
    progressiveDelay: false,
  },
  'step-up': {
    maxAttempts: 3,
    windowMs: 5 * 60 * 1000, // 5 minutes
    blockDurationMs: 15 * 60 * 1000, // 15 minutes
    progressiveDelay: true,
    baseDelayMs: 2000,
    maxDelayMs: 30000,
  },
  'sensitive-action': {
    maxAttempts: 10,
    windowMs: 60 * 60 * 1000, // 1 hour
    blockDurationMs: 60 * 60 * 1000, // 1 hour
    progressiveDelay: false,
  },
}

// Upstash Redis client (lazy loaded)
let redisClient = null

async function getRedisClient() {
  if (redisClient) return redisClient
  
  const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL
  const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN
  
  if (!UPSTASH_URL || !UPSTASH_TOKEN) {
    return null
  }
  
  try {
    const { Redis } = await import('@upstash/redis')
    redisClient = new Redis({
      url: UPSTASH_URL,
      token: UPSTASH_TOKEN,
    })
    return redisClient
  } catch (error) {
    console.warn('Redis client initialization failed:', error.message)
    return null
  }
}

/**
 * Check rate limit and apply progressive delay if needed
 * @param {Object} params
 * @param {string} params.action - Action type (login, 2fa, etc.)
 * @param {string} params.identifier - Email, IP, or device ID
 * @param {string} [params.ip] - IP address for combined key
 * @param {string} [params.deviceId] - Device ID for combined key
 * @returns {Promise<{ allowed: boolean, remaining: number, retryAfter?: number, delay?: number }>}
 */
export async function checkRateLimit({ action, identifier, ip, deviceId }) {
  const config = RATE_LIMIT_CONFIG[action]
  if (!config) {
    console.warn(`Unknown rate limit action: ${action}`)
    return { allowed: true, remaining: Infinity }
  }
  
  // Build composite keys for checking
  const keys = [
    `${identifier}:${action}`,
    ip ? `ip:${ip}:${action}` : null,
    deviceId ? `device:${deviceId}:${action}` : null,
  ].filter(Boolean)
  
  const redis = await getRedisClient()
  
  if (redis) {
    return checkRateLimitRedis(redis, keys, config, action)
  }
  
  // Fallback to DB-based rate limiting
  return checkRateLimitDB(keys, config, action)
}

/**
 * Record a failed attempt
 */
export async function recordFailedAttempt({ action, identifier, ip, deviceId }) {
  const keys = [
    `${identifier}:${action}`,
    ip ? `ip:${ip}:${action}` : null,
    deviceId ? `device:${deviceId}:${action}` : null,
  ].filter(Boolean)
  
  const redis = await getRedisClient()
  
  if (redis) {
    return recordFailedAttemptRedis(redis, keys, action)
  }
  
  return recordFailedAttemptDB(keys, action)
}

/**
 * Reset rate limit after successful action
 */
export async function resetRateLimit({ action, identifier, ip, deviceId }) {
  const keys = [
    `${identifier}:${action}`,
    ip ? `ip:${ip}:${action}` : null,
    deviceId ? `device:${deviceId}:${action}` : null,
  ].filter(Boolean)
  
  const redis = await getRedisClient()
  
  if (redis) {
    await Promise.all(keys.map(key => redis.del(`ratelimit:${key}`)))
  } else {
    await prisma.rateLimitBucket.deleteMany({
      where: { key: { in: keys } }
    })
  }
}

// Redis implementation
async function checkRateLimitRedis(redis, keys, config, action) {
  const now = Date.now()
  
  for (const key of keys) {
    const redisKey = `ratelimit:${key}`
    const data = await redis.hgetall(redisKey)
    
    if (!data || Object.keys(data).length === 0) {
      continue
    }
    
    const count = parseInt(data.count) || 0
    const lockedUntil = parseInt(data.lockedUntil) || 0
    const firstAttempt = parseInt(data.firstAttempt) || now
    
    // Check if locked
    if (lockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((lockedUntil - now) / 1000),
      }
    }
    
    // Check if window expired
    if (now - firstAttempt > config.windowMs) {
      await redis.del(redisKey)
      continue
    }
    
    // Check if max attempts reached
    if (count >= config.maxAttempts) {
      const lockUntil = now + config.blockDurationMs
      await redis.hset(redisKey, { lockedUntil: lockUntil })
      await redis.pexpire(redisKey, config.blockDurationMs)
      
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil(config.blockDurationMs / 1000),
      }
    }
    
    // Calculate progressive delay
    let delay = 0
    if (config.progressiveDelay && count > 0) {
      delay = Math.min(
        config.baseDelayMs * Math.pow(2, count - 1),
        config.maxDelayMs
      )
    }
    
    return {
      allowed: true,
      remaining: config.maxAttempts - count,
      delay,
    }
  }
  
  return { allowed: true, remaining: config.maxAttempts }
}

async function recordFailedAttemptRedis(redis, keys, action) {
  const config = RATE_LIMIT_CONFIG[action]
  const now = Date.now()
  
  for (const key of keys) {
    const redisKey = `ratelimit:${key}`
    const data = await redis.hgetall(redisKey)
    
    if (!data || Object.keys(data).length === 0) {
      await redis.hset(redisKey, {
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      })
      await redis.pexpire(redisKey, config.windowMs)
    } else {
      await redis.hincrby(redisKey, 'count', 1)
      await redis.hset(redisKey, { lastAttempt: now })
    }
  }
}

// DB fallback implementation
async function checkRateLimitDB(keys, config, action) {
  const now = new Date()
  
  for (const key of keys) {
    const bucket = await prisma.rateLimitBucket.findUnique({
      where: { key }
    })
    
    if (!bucket) continue
    
    // Check if locked
    if (bucket.lockedUntil && bucket.lockedUntil > now) {
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil((bucket.lockedUntil.getTime() - now.getTime()) / 1000),
      }
    }
    
    // Check if window expired
    if (now.getTime() - bucket.firstAttempt.getTime() > config.windowMs) {
      await prisma.rateLimitBucket.delete({ where: { key } })
      continue
    }
    
    // Check max attempts
    if (bucket.count >= config.maxAttempts) {
      const lockUntil = new Date(now.getTime() + config.blockDurationMs)
      await prisma.rateLimitBucket.update({
        where: { key },
        data: { lockedUntil: lockUntil }
      })
      
      return {
        allowed: false,
        remaining: 0,
        retryAfter: Math.ceil(config.blockDurationMs / 1000),
      }
    }
    
    // Calculate delay
    let delay = 0
    if (config.progressiveDelay && bucket.count > 0) {
      delay = Math.min(
        config.baseDelayMs * Math.pow(2, bucket.count - 1),
        config.maxDelayMs
      )
    }
    
    return {
      allowed: true,
      remaining: config.maxAttempts - bucket.count,
      delay,
    }
  }
  
  return { allowed: true, remaining: config.maxAttempts }
}

async function recordFailedAttemptDB(keys, action) {
  const config = RATE_LIMIT_CONFIG[action]
  const now = new Date()
  
  for (const key of keys) {
    await prisma.rateLimitBucket.upsert({
      where: { key },
      update: {
        count: { increment: 1 },
        lastAttempt: now,
      },
      create: {
        key,
        action,
        count: 1,
        firstAttempt: now,
        lastAttempt: now,
      }
    })
  }
}

/**
 * Apply progressive delay (sleep)
 * @param {number} delayMs - Milliseconds to delay
 */
export async function applyDelay(delayMs) {
  if (delayMs > 0) {
    await new Promise(resolve => setTimeout(resolve, delayMs))
  }
}

/**
 * Clean up expired rate limit buckets (for cron job)
 */
export async function cleanupExpiredBuckets() {
  const now = new Date()
  
  await prisma.rateLimitBucket.deleteMany({
    where: {
      OR: [
        { lockedUntil: { lt: now } },
        // Delete old entries without lock
        {
          lockedUntil: null,
          lastAttempt: { lt: new Date(now.getTime() - 24 * 60 * 60 * 1000) }
        }
      ]
    }
  })
}
