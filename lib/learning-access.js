import prisma from '@/lib/prisma'

/**
 * Determină accesul unui elev la aplicația /learn.
 *
 * Reguli:
 * - dacă elevul e dezactivat → totul blocat
 * - dacă e superStudent → totul deblocat
 * - lecțiile `isFree` (trial) → accesibile întotdeauna
 * - dacă există plată activă (expiresAt > now) → toate modulele deblocate temporar
 * - intrările din `ModuleAccess` = override manual de la admin (funcționează permanent, indiferent de plată)
 * - probleme aleatorii: necesită fie plată activă, fie superStudent
 *
 * Returnează:
 *   {
 *     isActive, isSuper,
 *     subscriptionActive, expiresAt, daysLeft, latestPayment,
 *     manualModuleIds: Set<string>,
 *     canAccessRandom, canAccessAllModules,
 *     canAccessModule(moduleId): bool,
 *     canAccessLesson(lesson): bool,
 *     lockReason: 'INACTIVE' | 'PAYMENT_REQUIRED' | null,
 *   }
 */
export async function getStudentLearningAccess(studentId) {
  const [student, latestPayment, manualAccesses, manualLessonAccesses] = await Promise.all([
    prisma.student.findUnique({
      where: { id: studentId },
      select: { id: true, active: true, superStudent: true },
    }),
    prisma.learningPayment.findFirst({
      where: { studentId },
      orderBy: { paymentDate: 'desc' },
    }),
    prisma.moduleAccess.findMany({
      where: { studentId },
      select: { moduleId: true, source: true },
    }),
    prisma.lessonAccess.findMany({
      where: { studentId },
      select: { lessonId: true },
    }),
  ])

  const isActive = student?.active !== false
  const isSuper = !!student?.superStudent
  const now = Date.now()
  const expiresAtMs = latestPayment ? new Date(latestPayment.expiresAt).getTime() : null
  const subscriptionActive = expiresAtMs !== null && expiresAtMs > now
  const daysLeft = expiresAtMs !== null
    ? Math.ceil((expiresAtMs - now) / 86400000)
    : null

  const manualModuleIds = new Set(manualAccesses.map(a => a.moduleId))
  const manualLessonIds = new Set(manualLessonAccesses.map(a => a.lessonId))

  const hasAnyManualAccess = manualModuleIds.size > 0 || manualLessonIds.size > 0
  const canAccessAllModules = isSuper || subscriptionActive
  const canAccessRandom = isActive && (isSuper || subscriptionActive || hasAnyManualAccess)

  function canAccessModule(moduleId) {
    if (!isActive) return false
    if (isSuper) return true
    if (subscriptionActive) return true
    return manualModuleIds.has(moduleId)
  }

  function canAccessLesson(lesson) {
    if (!isActive) return false
    if (isSuper) return true
    if (lesson.isFree) return true
    if (subscriptionActive) return true
    if (manualModuleIds.has(lesson.moduleId)) return true
    return manualLessonIds.has(lesson.id)
  }

  let lockReason = null
  if (!isActive) lockReason = 'INACTIVE'
  else if (!isSuper && !subscriptionActive && !hasAnyManualAccess) lockReason = 'PAYMENT_REQUIRED'

  return {
    isActive, isSuper,
    subscriptionActive, expiresAt: latestPayment?.expiresAt || null,
    daysLeft, latestPayment,
    manualModuleIds, manualLessonIds,
    canAccessAllModules, canAccessRandom,
    canAccessModule, canAccessLesson,
    lockReason,
  }
}

export const PAYMENT_LOCK_MESSAGE = 'Vorbește cu profesorul pentru a achita abonamentul și a continua aceste module. Progresul tău este salvat și te așteaptă.'

export const AI_PAYMENT_LOCK_MESSAGE = 'Mr. Olla (AI) este disponibil doar pentru elevii cu abonament activ. Vorbește cu profesorul pentru a-ți activa accesul.'

/**
 * Verifică dacă elevul poate folosi AI-ul (grading + chat + stats).
 * Reguli (egal cu canAccessRandom):
 *   - cont activ
 *   - superStudent SAU subscriptionActive SAU acces manual la cel puțin un modul/lecție
 *   - dacă lessonId e dat și e free trial → permis indiferent de plată
 *
 * @param {string} studentId
 * @param {Object} [opts]
 * @param {string} [opts.lessonId] - dacă lecția e free trial, AI e permis
 * @returns {Promise<{ allowed: boolean, reason?: string, message?: string, access }>}
 */
export async function assertAiAccess(studentId, { lessonId } = {}) {
  const access = await getStudentLearningAccess(studentId)
  if (!access.isActive) {
    return { allowed: false, reason: 'INACTIVE', message: 'Cont dezactivat', access }
  }
  // Free-trial bypass: dacă problema vine dintr-o lecție isFree, AI permis
  if (lessonId) {
    const lesson = await prisma.lesson.findUnique({
      where: { id: lessonId },
      select: { isFree: true, moduleId: true },
    })
    if (lesson?.isFree) {
      return { allowed: true, access }
    }
    // Sau dacă are acces explicit la modul/lecție
    if (access.canAccessLesson(lesson || { isFree: false, moduleId: '__none__', id: lessonId })) {
      return { allowed: true, access }
    }
  }
  if (access.isSuper || access.subscriptionActive) {
    return { allowed: true, access }
  }
  return {
    allowed: false,
    reason: 'PAYMENT_REQUIRED',
    message: AI_PAYMENT_LOCK_MESSAGE,
    access,
  }
}
