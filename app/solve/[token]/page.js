import SolveSet from '@/components/student/SolveSet'

export const dynamic = 'force-dynamic'

export const metadata = {
  title: 'Set de probleme — Olla English',
  robots: { index: false, follow: false },
}

export default async function SolvePage({ params }) {
  const { token } = await params
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50">
      <SolveSet token={token} />
    </div>
  )
}
