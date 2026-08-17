export const revalidate = 120 // ISR: leaderboard revalidat la fiecare 2min

import Link from 'next/link'
import prisma from '@/lib/prisma'
import { notFound } from 'next/navigation'
import { TrophyIcon, ArrowLeftIcon } from '@heroicons/react/24/outline'
import { getStudentByToken, getThemeById, getLeaderboardRanking } from '@/lib/student-cache'
import LeaderboardTabs from '@/components/student/LeaderboardTabs'
import LeaderboardPodium from '@/components/student/LeaderboardPodium'
import CosmeticArt from '@/components/student/CosmeticArt'

export default async function LeaderboardPage({ params }) {
  const { token } = await params

  // React cache() — deduplicat cu layout, include equipped + activeThemeId
  const me = await getStudentByToken(token)
  if (!me || me.active === false) notFound()

  // Tema + ranking + events active in paralel — ranking e cached 60s
  const now = new Date()
  const [theme, ranked, activeEvents] = await Promise.all([
    me.activeThemeId ? getThemeById(me.activeThemeId) : Promise.resolve(null),
    getLeaderboardRanking(),
    prisma.leaderboardEvent.findMany({
      where: { active: true, startsAt: { lte: now }, endsAt: { gte: now } },
      orderBy: { endsAt: 'asc' },
      include: {
        entries: {
          orderBy: { score: 'desc' },
          include: { student: { select: { id: true, fullName: true } } },
        },
        rewards: {
          orderBy: { rank: 'asc' },
          include: {
            event: false,
          },
        },
      },
    }),
  ])

  const ranked_top3 = ranked.slice(0, 3)

  return (
    <div className="min-h-screen bg-[#0c1a1d]">

      {/* TOP BAR + PODIUM */}
      <div className="text-white px-4 pt-4 pb-8 shadow-xl" style={{ background: 'linear-gradient(to bottom, #0c1a1d, #0f2127, #136976)' }}>
        <div className="flex items-center gap-3 mb-6">
          <Link href={'/learn/' + token} className="p-2 hover:bg-white/10 rounded-xl transition">
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
          <div className="flex-1">
            <h1 className="font-extrabold text-xl leading-tight">Clasament</h1>
            <p className="text-white/50 text-xs">Toți elevii după XP acumulat</p>
          </div>
          <TrophyIcon className="w-7 h-7 text-amber-300" />
        </div>

        {ranked_top3.length >= 3 && (
          <LeaderboardPodium top3={ranked_top3} />
        )}
      </div>

      {/* TABS — Global + Events */}
      <LeaderboardTabs
        ranked={ranked}
        activeEvents={activeEvents}
        me={me}
        token={token}
        theme={theme}
      />
    </div>
  )
}
