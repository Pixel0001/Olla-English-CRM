import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getCurrentUser } from '@/lib/session'
import { require2FAToken } from '@/lib/security/action-tokens'
import { checkPermission } from '@/lib/permissions'

export async function GET() {
  try {
    await requireAdmin()
    
    // Check permission
    const permCheck = await checkPermission('branches.view')
    if (!permCheck.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să vezi filialele' }, { status: 403 })
    }
    
    const branches = await prisma.branch.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { groups: true }
        }
      }
    })
    
    return NextResponse.json({ branches })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch branches' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAdmin()
    
    // Check permission
    const permCheck = await checkPermission('branches.create')
    if (!permCheck.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea să creezi filiale' }, { status: 403 })
    }
    
    const sessionUser = await getCurrentUser()
    const body = await request.json()

    // Verify 2FA if user has it enabled
    const currentUser = await prisma.user.findUnique({
      where: { email: sessionUser.email },
      select: { twoFactorEnabled: true }
    })
    
    const twoFACheck = require2FAToken(body.actionToken, sessionUser.email, currentUser?.twoFactorEnabled)
    if (!twoFACheck.valid && !twoFACheck.skip) {
      return NextResponse.json({ 
        error: twoFACheck.error, 
        requires2FA: true 
      }, { status: 403 })
    }

    const { name, address, active } = body

    // Check if branch with same name exists
    const existingBranch = await prisma.branch.findUnique({
      where: { name }
    })

    if (existingBranch) {
      return NextResponse.json({ error: 'O filială cu acest nume există deja' }, { status: 400 })
    }

    const branch = await prisma.branch.create({
      data: {
        name,
        address: address || null,
        active: active ?? true
      }
    })

    return NextResponse.json(branch, { status: 201 })
  } catch (error) {
    console.error('Error creating branch:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create branch' }, { status: 500 })
  }
}
