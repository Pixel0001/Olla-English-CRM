import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'
import { requireAdmin, getCurrentUser } from '@/lib/session'
import { require2FAToken } from '@/lib/security/action-tokens'
import { checkPermission } from '@/lib/permissions'

const ITEMS_PER_PAGE = 20

export async function GET(request) {
  try {
    await requireAdmin()
    
    // Verifică permisiunea de vizualizare elevi
    const canView = await checkPermission('students.view')
    if (!canView.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea de a vedea elevii' }, { status: 403 })
    }

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const search = searchParams.get('search') || ''
    const hasGroup = searchParams.get('hasGroup') // 'yes', 'no', or empty
    const all = searchParams.get('all') === 'true' // Pentru dropdown-uri

    // Construiește where clause
    const where = {}
    
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: 'insensitive' } },
        { parentName: { contains: search, mode: 'insensitive' } },
        { parentPhone: { contains: search, mode: 'insensitive' } },
        { parentEmail: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Filtru pentru elevi cu/fără grupă
    if (hasGroup === 'yes') {
      where.groupStudents = { some: {} }
    } else if (hasGroup === 'no') {
      where.groupStudents = { none: {} }
    }

    // Dacă se cere all, returnează toți elevii (pentru dropdown-uri)
    if (all) {
      const students = await prisma.student.findMany({
        where,
        orderBy: { fullName: 'asc' },
        include: {
          groupStudents: {
            include: {
              group: {
                select: { id: true, name: true }
              }
            }
          }
        }
      })
      return NextResponse.json(students)
    }

    // Calculează totalul pentru paginare
    const totalCount = await prisma.student.count({ where })
    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE)

    const students = await prisma.student.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * ITEMS_PER_PAGE,
      take: ITEMS_PER_PAGE,
      include: {
        groupStudents: {
          include: {
            group: {
              select: { id: true, name: true }
            }
          }
        }
      }
    })

    return NextResponse.json({
      students,
      pagination: {
        page,
        totalPages,
        totalCount,
        hasMore: page < totalPages
      }
    })
  } catch (error) {
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to fetch students' }, { status: 500 })
  }
}

export async function POST(request) {
  try {
    await requireAdmin()
    
    // Verifică permisiunea de creare elevi
    const canCreate = await checkPermission('students.create')
    if (!canCreate.allowed) {
      return NextResponse.json({ error: 'Nu ai permisiunea de a crea elevi' }, { status: 403 })
    }
    
    const sessionUser = await getCurrentUser()
    const body = await request.json()

    // Verify 2FA if user has it enabled
    const user = await prisma.user.findUnique({
      where: { email: sessionUser.email },
      select: { twoFactorEnabled: true }
    })
    
    const twoFACheck = require2FAToken(body.actionToken, sessionUser.email, user?.twoFactorEnabled)
    if (!twoFACheck.valid && !twoFACheck.skip) {
      return NextResponse.json({ 
        error: twoFACheck.error, 
        requires2FA: true 
      }, { status: 403 })
    }

    const { fullName, age, grade, parentName, parentPhone, parentEmail, notes } = body

    const student = await prisma.student.create({
      data: { fullName, age, grade: grade ?? null, parentName, parentPhone, parentEmail, notes }
    })

    return NextResponse.json(student, { status: 201 })
  } catch (error) {
    console.error('Error creating student:', error)
    if (error.message === 'Unauthorized' || error.message === 'Forbidden') {
      return NextResponse.json({ error: error.message }, { status: 401 })
    }
    return NextResponse.json({ error: 'Failed to create student' }, { status: 500 })
  }
}
