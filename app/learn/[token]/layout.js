export const dynamic = 'force-dynamic'

import TokenSaver from '@/components/student/TokenSaver'
import SessionGuard from '@/components/student/SessionGuard'
import StudentThemeShell from '@/components/student/StudentThemeShell'
import { preloadStudent } from '@/lib/student-cache'

export default async function LearnTokenLayout({ children, params }) {
  const { token } = await params
  // Fire the student DB query immediately — before any child component
  // starts rendering. All children that call getStudentByToken() will
  // get the cached result, eliminating serial round-trips.
  preloadStudent(token)
  return (
    <>
      <TokenSaver token={token} />
      <SessionGuard token={token} />
      <StudentThemeShell token={token}>
        {children}
      </StudentThemeShell>
    </>
  )
}
