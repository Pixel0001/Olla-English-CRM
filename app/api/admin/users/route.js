/**
 * POST /api/admin/users
 * Create a new admin or teacher user
 * REQUIRES step-up token (always, for createUser/createAdmin/createTeacher)
 */

import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getRequestContext, apiError } from '@/lib/security/guards.js'
import { verifyStepUpToken, getCreateUserAction } from '@/lib/security/step-up.js'
import { hashPassword, validatePasswordStrength } from '@/lib/security/argon2.js'
import { auditUserAction } from '@/lib/security/audit.js'
import { alertUserCreated } from '@/lib/security/alerts.js'

export async function POST(request) {
  const context = await getRequestContext()
  
  try {
    const { session, user: actor, error } = await requireAdmin()
    if (error) return error
    
    // Parse body
    const body = await request.json()
    const { 
      email, 
      password, 
      name, 
      role = 'TEACHER', 
      stepUpToken 
    } = body
    
    // Validate required fields
    if (!email || !password) {
      return apiError('Email și parola sunt obligatorii', 400)
    }
    
    // Validate role
    const validRoles = ['ADMIN', 'TEACHER']
    if (!validRoles.includes(role)) {
      return apiError('Invalid role', 400)
    }
    
    // Only ADMIN or SUPERADMIN can create other ADMINs
    if (role === 'ADMIN' && actor.role !== 'ADMIN' && actor.role !== 'SUPERADMIN') {
      await auditUserAction({
        action: 'create',
        actorId: actor.id,
        targetUserId: null,
        details: {
          email,
          role,
          reason: 'insufficient_permissions',
        },
        ...context,
        success: false,
      })
      
      return apiError('Only admins can create admin users', 403, 'FORBIDDEN')
    }
    
    // ALWAYS require step-up for user creation
    const action = getCreateUserAction(role)
    const stepUpResult = await verifyStepUpToken({
      token: stepUpToken,
      userId: actor.id,
      action,
      ...context,
    })
    
    if (!stepUpResult.valid) {
      await auditUserAction({
        action: 'create',
        actorId: actor.id,
        targetUserId: null,
        details: {
          email,
          role,
          reason: `step_up_failed: ${stepUpResult.reason}`,
        },
        ...context,
        success: false,
      })
      
      return apiError(
        'Step-up verification required for user creation', 
        403, 
        'STEP_UP_REQUIRED'
      )
    }
    
    // Validate password strength
    const passwordValidation = validatePasswordStrength(password)
    if (!passwordValidation.valid) {
      return apiError(passwordValidation.errors.join('. '), 400, 'WEAK_PASSWORD')
    }
    
    // Normalize email
    const normalizedEmail = email.toLowerCase().trim()
    
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: normalizedEmail }
    })
    
    if (existingUser) {
      // Don't reveal that user exists
      return apiError('Unable to create user', 400, 'CREATE_FAILED')
    }
    
    // Hash password
    const passwordHash = await hashPassword(password)
    
    // Create user
    const newUser = await prisma.user.create({
      data: {
        email: normalizedEmail,
        password: passwordHash,
        name: name || normalizedEmail.split('@')[0],
        role,
        active: true,
        twoFactorEnabled: false,
      },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        active: true,
        createdAt: true,
      }
    })
    
    // Audit success
    await auditUserAction({
      action: 'create',
      actorId: actor.id,
      targetUserId: newUser.id,
      details: {
        email: newUser.email,
        role: newUser.role,
        name: newUser.name,
        createdBy: actor.email,
      },
      ...context,
      success: true,
    })
    
    // Alert
    await alertUserCreated({
      actorEmail: actor.email,
      newUserEmail: newUser.email,
      role: newUser.role,
      ipAddress: context.ipAddress,
      actorId: actor.id,
    })
    
    return NextResponse.json({
      success: true,
      user: newUser,
      message: `${role} created successfully`,
    })
    
  } catch (error) {
    console.error('Create user error:', error)
    return apiError('Failed to create user', 500)
  }
}

/**
 * GET /api/admin/users
 * List all users (admins, teachers)
 */
export async function GET(request) {
  try {
    const { user, error } = await requireAdmin()
    if (error) return error
    
    const { searchParams } = new URL(request.url)
    const role = searchParams.get('role')
    const search = searchParams.get('search')
    const page = parseInt(searchParams.get('page')) || 1
    const limit = parseInt(searchParams.get('limit')) || 20
    
    const where = {}
    
    if (role && ['ADMIN', 'TEACHER'].includes(role)) {
      where.role = role
    }
    
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } },
      ]
    }
    
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
          active: true,
          twoFactorEnabled: true,
          createdAt: true,
          updatedAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      prisma.user.count({ where })
    ])
    
    return NextResponse.json({
      users,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      }
    })
    
  } catch (error) {
    console.error('List users error:', error)
    return apiError('Failed to list users', 500)
  }
}
