export const dynamic = 'force-dynamic'

import { notFound } from 'next/navigation'
import Link from 'next/link'
import prisma from '@/lib/prisma'
import { requireAdmin } from '@/lib/session'
import { checkPermission } from '@/lib/permissions'
import {
  ArrowLeftIcon,
  PencilSquareIcon,
  AcademicCapIcon,
  CalendarDaysIcon,
  PhoneIcon,
  EnvelopeIcon,
  UserIcon,
  BookOpenIcon,
  CheckCircleIcon,
  XCircleIcon,
  BanknotesIcon,
  BoltIcon,
} from '@heroicons/react/24/outline'
import nextDynamic from 'next/dynamic'
import SuperStudentToggle from '@/components/admin/SuperStudentToggle'
import StudentActiveToggle from '@/components/admin/StudentActiveToggle'
import StudentPasswordSetter from '@/components/admin/StudentPasswordSetter'
import StudentLimitsOverride from '@/components/admin/StudentLimitsOverride'
import StudentSessionInfo from '@/components/admin/StudentSessionInfo'
import GenerateTokenButton from '@/components/admin/GenerateTokenButton'
import { getSystemSettings } from '@/lib/student-limits'
// Heavy components: lazy-loaded to reduce initial bundle
const StudentModuleAccessTable = nextDynamic(() => import('@/components/admin/StudentModuleAccessTable'))
const StudentLearningPayments = nextDynamic(() => import('@/components/admin/StudentLearningPayments'))
const StudentBonusPoints = nextDynamic(() => import('@/components/admin/StudentBonusPoints'))
const StudentEconomyAdmin = nextDynamic(() => import('@/components/admin/StudentEconomyAdmin'))

const STATUS_LABELS = {
  ACTIVE: { label: 'Activ', color: 'bg-green-100 text-green-700' },
  PAUSED: { label: 'Pauză', color: 'bg-amber-100 text-amber-700' },
  LEFT: { label: 'Plecat', color: 'bg-red-100 text-red-700' },
  COMPLETED: { label: 'Terminat', color: 'bg-blue-100 text-blue-700' },
  TRANSFERRED: { label: 'Transferat', color: 'bg-purple-100 text-purple-700' },
}

function formatDate(d) {
  if (!d) return '—'
  return new Date(d).toLocaleDateString('ro-RO', {
    day: '2-digit', month: '2-digit', year: 'numeric',
  })
}

export default async function StudentDetailPage({ params }) {
  await requireAdmin()
  const canView = await checkPermission('students.view')
  if (!canView.allowed) notFound()
  const canEdit = await checkPermission('students.edit')

  const { id } = await params

  // 1) Elev + grupele lui (cu plățile)
  const student = await prisma.student.findUnique({
    where: { id },
    include: {
      groupStudents: {
        include: {
          group: {
            include: {
              teacher: { select: { id: true, name: true } },
            },
          },
          payments: {
            orderBy: { paymentDate: 'desc' },
            include: {
              createdBy: { select: { name: true, role: true } },
            },
          },
        },
        orderBy: { enrolledAt: 'desc' },
      },
      createdBy: { select: { name: true, role: true } },
    },
  })

  if (!student) notFound()

  const groupIds = student.groupStudents.map(gs => gs.groupId)

  // Date pentru aplicația /learn: module + accese + avansări + plăți + XP
  const [allModules, moduleAccesses, moduleAdvances, moduleHiddens, lessonAccesses, learningPayments, gradedSubmissions, bonusPointsRaw, settings] = await Promise.all([
    prisma.learningModule.findMany({
      where: { active: true },
      orderBy: { order: 'asc' },
      include: {
        _count: { select: { lessons: true } },
        lessons: {
          where: { active: true },
          orderBy: { order: 'asc' },
          select: { id: true, title: true, isFree: true, order: true },
        },
      },
    }),
    prisma.moduleAccess.findMany({ where: { studentId: id }, select: { moduleId: true } }),
    prisma.moduleAdvance.findMany({ where: { studentId: id }, select: { moduleId: true } }),
    prisma.moduleHidden.findMany({ where: { studentId: id }, select: { moduleId: true } }),
    prisma.lessonAccess.findMany({ where: { studentId: id }, select: { lessonId: true } }),
    prisma.learningPayment.findMany({ where: { studentId: id }, orderBy: { paymentDate: 'desc' } }),
    prisma.problemSubmission.findMany({
      where: { studentId: id, status: 'GRADED', grade: { gte: 60 } },
      include: { problem: { select: { points: true } } },
    }),
    prisma.bonusPoint.findMany({
      where: { studentId: id },
      orderBy: { createdAt: 'desc' },
      include: { addedBy: { select: { name: true } } },
    }),
    getSystemSettings(),
  ])

  const submissionXP = gradedSubmissions.reduce((sum, s) =>
    sum + Math.round((s.problem?.points ?? 0) * (s.grade / 100)), 0
  )
  const accessIds = moduleAccesses.map(a => a.moduleId)
  const advanceIds = moduleAdvances.map(a => a.moduleId)
  const hiddenIds = moduleHiddens.map(h => h.moduleId)
  const lessonAccessIds = lessonAccesses.map(a => a.lessonId)

  // 2) Toate prezențele PRESENT ale elevului (descrescător după dată)
  // NOTĂ: Prisma + MongoDB nu suportă orderBy pe câmp relațional, sortăm în JS.
  const presencesRaw = groupIds.length === 0 ? [] : await prisma.attendance.findMany({
    where: {
      studentId: id,
      status: 'PRESENT',
      session: { groupId: { in: groupIds } },
    },
    include: {
      session: {
        include: {
          group: { select: { id: true, name: true } },
        },
      },
    },
  })
  const presences = presencesRaw.sort(
    (a, b) => new Date(b.session.date) - new Date(a.session.date)
  )

  // 3) Lecții de la ultima plată (per grupă)
  const lessonsSinceLastPaymentByGsId = new Map()
  for (const gs of student.groupStudents) {
    const lastPayment = gs.payments[0]
    if (!lastPayment) {
      const count = presences.filter(p => p.session.groupId === gs.groupId).length
      lessonsSinceLastPaymentByGsId.set(gs.id, { count, lastPaymentDate: null })
      continue
    }
    const since = new Date(lastPayment.paymentDate)
    const count = presences.filter(p =>
      p.session.groupId === gs.groupId && new Date(p.session.date) > since
    ).length
    lessonsSinceLastPaymentByGsId.set(gs.id, { count, lastPaymentDate: lastPayment.paymentDate })
  }

  // 4) Toate plățile (din toate grupele) sortate descrescător
  const allPayments = student.groupStudents
    .flatMap(gs => gs.payments.map(p => ({
      ...p,
      groupName: gs.group?.name,
      levelName: gs.group?.level,
    })))
    .sort((a, b) => new Date(b.paymentDate) - new Date(a.paymentDate))

  const totalPaid = allPayments.reduce((sum, p) => sum + (p.amount || 0), 0)
  const totalPresent = presences.length

  // 5) Lecții ratate (absent)
  const absencesCount = groupIds.length === 0 ? 0 : await prisma.attendance.count({
    where: { studentId: id, status: 'ABSENT', session: { groupId: { in: groupIds } } },
  })

  return (
    <div className="space-y-4 xs:space-y-6">
      {/* Header bar */}
      <div className="flex flex-col xs:flex-row xs:items-center xs:justify-between gap-3">
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-1 text-sm text-gray-600 hover:text-gray-900 self-start"
        >
          <ArrowLeftIcon className="w-4 h-4" />
          Înapoi la elevi
        </Link>
        {canEdit.allowed && (
          <Link
            href={`/admin/students/${id}/edit`}
            className="inline-flex items-center gap-1.5 px-3 xs:px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors self-start xs:self-auto"
          >
            <PencilSquareIcon className="w-4 h-4" />
            Editează datele
          </Link>
        )}
      </div>

      {/* Profil elev */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 xs:p-6">
        <div className="flex items-start gap-4">
          <div className="w-14 h-14 xs:w-16 xs:h-16 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-xl xs:text-2xl font-semibold">
              {student.fullName.charAt(0).toUpperCase()}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-xl xs:text-2xl font-bold text-gray-900 break-words">{student.fullName}</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {student.age ? `${student.age} ani` : 'Vârstă nedefinită'} • Înscris: {formatDate(student.createdAt)}
              {student.createdBy && <> • Adăugat de {student.createdBy.name}</>}
            </p>
            <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm">
              {student.parentName && (
                <div className="flex items-center gap-1.5 text-gray-700">
                  <UserIcon className="w-4 h-4 text-gray-400" />
                  <span className="truncate">{student.parentName}</span>
                </div>
              )}
              {student.parentPhone && (
                <a href={`tel:${student.parentPhone}`} className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800">
                  <PhoneIcon className="w-4 h-4" />
                  <span className="truncate">{student.parentPhone}</span>
                </a>
              )}
              {student.parentEmail && (
                <a href={`mailto:${student.parentEmail}`} className="flex items-center gap-1.5 text-indigo-600 hover:text-indigo-800 sm:col-span-2">
                  <EnvelopeIcon className="w-4 h-4" />
                  <span className="truncate">{student.parentEmail}</span>
                </a>
              )}
            </div>
            {student.notes && (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg text-sm text-amber-900 whitespace-pre-wrap">
                <strong>Notițe:</strong> {student.notes}
              </div>
            )}
            {canEdit.allowed && (
              <GenerateTokenButton studentId={id} initialToken={student.accessToken || ''} />
            )}
            {!canEdit.allowed && student.accessToken && (
              <div className="mt-3 p-3 bg-indigo-50 border border-indigo-200 rounded-lg flex items-start gap-2">
                <BoltIcon className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold uppercase tracking-wider text-indigo-500 mb-0.5">Link acces /learn</div>
                  <a href={`/learn/${student.accessToken}`} target="_blank" className="text-xs font-mono text-indigo-700 break-all hover:underline">
                    /learn/{student.accessToken}
                  </a>
                  <div className="text-[10px] text-indigo-400 mt-0.5">Token: <span className="font-mono">{student.accessToken}</span></div>
                </div>
              </div>
            )}
            {canEdit.allowed && (
              <div className="mt-4 space-y-2">
                <div className="flex items-center gap-3 p-3 bg-slate-50 border border-slate-200 rounded-xl">
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-slate-900">Status cont</div>
                    <div className="text-xs text-slate-500">Dezactivează pentru a bloca accesul elevului în aplicație</div>
                  </div>
                  <StudentActiveToggle studentId={id} initialValue={student.active !== false} />
                </div>
                <div className="flex items-center gap-3 p-3 bg-indigo-50 border border-indigo-200 rounded-xl">
                  <BoltIcon className="w-5 h-5 text-indigo-500 shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="text-sm font-semibold text-indigo-900">Super elev</div>
                    <div className="text-xs text-indigo-600">Accesează orice lecție fără restricții de progres</div>
                  </div>
                  <SuperStudentToggle studentId={id} initialValue={student.superStudent ?? false} />
                </div>
                <StudentLimitsOverride studentId={id} initial={{
                  cooldownOverrideMin: student.cooldownOverrideMin,
                  dailyXpCapOverride: student.dailyXpCapOverride,
                  cooldownDisabled: student.cooldownDisabled,
                  xpCapDisabled: student.xpCapDisabled,
                }} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* /learn — parolă, sesiune, plăți, acces module */}
      {canEdit.allowed && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 xs:gap-4">
          <StudentPasswordSetter studentId={id} hasPassword={!!student.password} />
          <StudentSessionInfo
            studentId={id}
            activeSessionId={student.activeSessionId}
            activeSessionAt={student.activeSessionAt}
            activeSessionIp={student.activeSessionIp}
            activeSessionUA={student.activeSessionUA}
          />
          <StudentLearningPayments studentId={id} initialPayments={learningPayments} />
        </div>
      )}

      {canEdit.allowed && (
        <StudentModuleAccessTable
          studentId={id}
          modules={allModules}
          accessIds={accessIds}
          advanceIds={advanceIds}
          hiddenIds={hiddenIds}
          lessonAccessIds={lessonAccessIds}
        />
      )}

      {canEdit.allowed && (
        <StudentBonusPoints
          studentId={id}
          initialBonusPoints={bonusPointsRaw}
          submissionXP={submissionXP}
          levelCurve={settings.levelCurve}
          levelNames={settings.levelNames}
        />
      )}

      {canEdit.allowed && <StudentEconomyAdmin studentId={id} />}

      {/* Statistici sumare */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4">
        <StatCard icon={BookOpenIcon} label="Grupe" value={student.groupStudents.length} color="indigo" />
        <StatCard icon={CheckCircleIcon} label="Lecții făcute" value={totalPresent} color="green" />
        <StatCard icon={XCircleIcon} label="Absențe" value={absencesCount} color="red" />
        <StatCard icon={BanknotesIcon} label="Total plătit" value={`${totalPaid.toLocaleString('ro-RO')} lei`} color="amber" />
      </div>

      {/* Grupele elevului */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-4 xs:px-6 py-3 xs:py-4 border-b border-gray-100">
          <h2 className="text-base xs:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <AcademicCapIcon className="w-5 h-5 text-indigo-600" />
            Grupe ({student.groupStudents.length})
          </h2>
        </div>
        {student.groupStudents.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Elevul nu este înscris în nicio grupă.</div>
        ) : (
          <div className="divide-y divide-gray-100">
            {student.groupStudents.map(gs => {
              const status = gs.status || 'ACTIVE'
              const statusInfo = STATUS_LABELS[status]
              const lessonsSince = lessonsSinceLastPaymentByGsId.get(gs.id)
              return (
                <div key={gs.id} className="p-4 xs:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
                    <div className="min-w-0 flex-1">
                      <Link
                        href={`/admin/groups/${gs.groupId}/students`}
                        className="font-semibold text-gray-900 hover:text-indigo-600 text-sm xs:text-base"
                      >
                        {gs.group?.name}
                      </Link>
                      <p className="text-xs xs:text-sm text-gray-500 mt-0.5">
                        {gs.group?.level}
                        {gs.group?.teacher?.name && <> • Profesor: {gs.group.teacher.name}</>}
                      </p>
                      <p className="text-[11px] xs:text-xs text-gray-400 mt-0.5">
                        Înscris în grupă: {formatDate(gs.enrolledAt)}
                      </p>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${statusInfo.color}`}>
                        {statusInfo.label}
                      </span>
                      {gs.absences > 0 && (
                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-700">
                          {gs.absences} absențe
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Info plată + lecții de la ultima plată */}
                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs xs:text-sm">
                    <div className="px-3 py-2 bg-gray-50 rounded-lg">
                      <p className="text-[11px] text-gray-500 uppercase tracking-wide">Ultima plată</p>
                      <p className="font-medium text-gray-900 mt-0.5">
                        {lessonsSince?.lastPaymentDate ? formatDate(lessonsSince.lastPaymentDate) : 'Fără plăți'}
                      </p>
                    </div>
                    <div className="px-3 py-2 bg-indigo-50 rounded-lg">
                      <p className="text-[11px] text-indigo-700 uppercase tracking-wide">Lecții de la ultima plată</p>
                      <p className="font-bold text-indigo-900 mt-0.5">
                        {lessonsSince?.count ?? 0} lecții
                      </p>
                    </div>
                  </div>

                  {gs.statusNote && (
                    <p className="mt-2 text-xs text-gray-600 italic">📝 {gs.statusNote}</p>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Istoric lecții */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-4 xs:px-6 py-3 xs:py-4 border-b border-gray-100">
          <h2 className="text-base xs:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <CalendarDaysIcon className="w-5 h-5 text-green-600" />
            Istoric lecții ({presences.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">Toate lecțiile la care a fost prezent, ordonate de la cea mai recentă</p>
        </div>
        {presences.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Nicio lecție înregistrată.</div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {presences.map(att => (
              <div key={att.id} className="px-4 xs:px-6 py-3 hover:bg-gray-50 flex items-center justify-between gap-3">
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-gray-900 text-sm">
                    {formatDate(att.session.date)}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {att.session.group?.name} • {att.session.group?.level}
                  </p>
                </div>
                <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] xs:text-xs font-medium bg-green-100 text-green-700 flex-shrink-0">
                  <CheckCircleIcon className="w-3 h-3" />
                  Prezent
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Istoric plăți */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
        <div className="px-4 xs:px-6 py-3 xs:py-4 border-b border-gray-100">
          <h2 className="text-base xs:text-lg font-semibold text-gray-900 flex items-center gap-2">
            <BanknotesIcon className="w-5 h-5 text-amber-600" />
            Istoric plăți ({allPayments.length})
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            Total plătit: <span className="font-semibold text-amber-700">{totalPaid.toLocaleString('ro-RO')} lei</span>
          </p>
        </div>
        {allPayments.length === 0 ? (
          <div className="p-8 text-center text-gray-500 text-sm">Nicio plată înregistrată.</div>
        ) : (
          <div className="divide-y divide-gray-100 max-h-[500px] overflow-y-auto">
            {allPayments.map(p => (
              <div key={p.id} className="px-4 xs:px-6 py-3 hover:bg-gray-50">
                <div className="flex items-start justify-between gap-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-semibold text-amber-700 text-sm xs:text-base">
                      {p.amount.toLocaleString('ro-RO')} lei
                      {p.lessonsAdded ? <span className="ml-2 text-xs font-normal text-gray-500">(+{p.lessonsAdded} lecții)</span> : null}
                    </p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {p.groupName} • {p.levelName}
                    </p>
                    {p.notes && <p className="text-xs text-gray-600 mt-1 italic">{p.notes}</p>}
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-xs text-gray-700 font-medium">{formatDate(p.paymentDate)}</p>
                    {p.paymentMethod && (
                      <p className="text-[11px] text-gray-400 mt-0.5 capitalize">{p.paymentMethod}</p>
                    )}
                    {p.createdBy?.name && (
                      <p className="text-[11px] text-gray-400 mt-0.5">{p.createdBy.name}</p>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function StatCard({ icon: Icon, label, value, color }) {
  const colors = {
    indigo: 'bg-indigo-50 text-indigo-700',
    green: 'bg-green-50 text-green-700',
    red: 'bg-red-50 text-red-700',
    amber: 'bg-amber-50 text-amber-700',
  }
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 xs:p-4">
      <div className={`inline-flex p-2 rounded-lg ${colors[color] || colors.indigo}`}>
        <Icon className="w-4 h-4 xs:w-5 xs:h-5" />
      </div>
      <p className="text-[11px] xs:text-xs text-gray-500 uppercase tracking-wide mt-2">{label}</p>
      <p className="text-lg xs:text-2xl font-bold text-gray-900 mt-0.5 break-words">{value}</p>
    </div>
  )
}
