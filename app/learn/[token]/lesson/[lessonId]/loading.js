export default function LessonLoading() {
  return (
    <div className="flex bg-[#f0fafb] overflow-hidden animate-pulse" style={{ height: 'calc(100vh - env(safe-area-inset-top))' }}>
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex flex-col w-64 xl:w-72 shrink-0" style={{ background: 'linear-gradient(to bottom, #0c1a1d, #0f2127, #0c1a1d)' }}>
        <div className="p-4 border-b border-white/10">
          <div className="h-4 w-32 bg-white/20 rounded-full" />
        </div>
        <div className="p-4 space-y-3 flex-1">
          <div className="h-2 w-20 bg-white/10 rounded" />
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 rounded-lg bg-white/20 shrink-0" />
            <div className="h-4 w-36 bg-white/20 rounded" />
          </div>
          <div className="grid grid-cols-2 gap-1.5">
            <div className="h-10 bg-white/10 rounded-xl" />
            <div className="h-10 bg-white/10 rounded-xl" />
          </div>
          <div>
            <div className="h-2 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full w-1/3 bg-white/20 rounded-full" />
            </div>
          </div>
          <div className="space-y-1.5 pt-2">
            {[1,2,3,4,5].map(i => (
              <div key={i} className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl">
                <div className="w-7 h-7 rounded-lg bg-white/20 shrink-0" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 bg-white/20 rounded w-3/4" />
                  <div className="h-2 bg-white/10 rounded w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </aside>

      {/* Main skeleton */}
      <main className="flex-1 min-w-0 flex flex-col overflow-hidden">
        {/* Top bar */}
        <div className="h-14 shrink-0 flex items-center px-4 gap-4" style={{ background: 'linear-gradient(to right, #0c1a1d, #136976)' }}>
          <div className="h-4 w-32 bg-white/20 rounded-full" />
          <div className="flex-1" />
          <div className="h-7 w-20 bg-white/20 rounded-full" />
        </div>
        {/* Progress bar */}
        <div className="h-1 bg-teal-100 shrink-0">
          <div className="h-full w-1/4 bg-[#30919f]/50" />
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto p-4 sm:p-6 lg:p-8 space-y-4">
            {/* Nav pills */}
            <div className="bg-white rounded-xl shadow-sm p-2 flex gap-1.5 border border-teal-100">
              {[1,2,3,4,5].map(i => (
                <div key={i} className="min-w-[38px] h-9 rounded-lg bg-slate-100 flex-shrink-0" />
              ))}
            </div>

            {/* Problem card */}
            <div className="bg-white rounded-2xl shadow-sm overflow-hidden border border-teal-100">
              <div className="px-5 py-4 bg-teal-50 border-b border-teal-100 flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 shrink-0" />
                <div className="space-y-2 flex-1">
                  <div className="h-3 w-16 bg-teal-200 rounded-full" />
                  <div className="h-5 w-48 bg-teal-200 rounded" />
                </div>
              </div>
              <div className="p-5 sm:p-6 space-y-4">
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
                <div className="h-4 bg-slate-100 rounded w-4/6" />
                <div className="h-24 bg-slate-100 rounded-xl mt-4" />
                <div className="flex justify-between pt-3">
                  <div className="h-10 w-24 bg-slate-100 rounded-xl" />
                  <div className="h-10 w-32 bg-teal-100 rounded-xl" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
