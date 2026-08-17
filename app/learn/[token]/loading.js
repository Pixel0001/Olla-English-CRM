export default function LearnLoading() {
  return (
    <div className="flex bg-[#f0fafb] overflow-hidden animate-pulse" style={{ height: 'calc(100vh - env(safe-area-inset-top))' }}>
      {/* Sidebar skeleton */}
      <aside className="hidden lg:flex flex-col w-72 xl:w-80 shrink-0" style={{ background: 'linear-gradient(to bottom, #0c1a1d, #0f2127, #136976)' }}>
        <div className="p-5 space-y-4 flex-1">
          <div className="pt-1 space-y-2">
            <div className="h-5 w-24 bg-white/20 rounded-full" />
            <div className="h-7 w-40 bg-white/20 rounded-lg" />
            <div className="h-3 w-28 bg-white/10 rounded" />
          </div>
          <div className="flex items-center gap-3 bg-white/10 rounded-2xl p-4">
            <div className="w-16 h-16 rounded-full bg-white/20 shrink-0" />
            <div className="space-y-2 flex-1">
              <div className="h-3 w-20 bg-white/20 rounded" />
              <div className="h-8 w-16 bg-white/20 rounded" />
              <div className="h-2 w-24 bg-white/10 rounded" />
            </div>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <div className="bg-white/10 rounded-xl h-16" />
            <div className="bg-white/10 rounded-xl h-16" />
          </div>
          <div className="bg-white/10 rounded-2xl h-20" />
          <div className="bg-white/10 rounded-xl h-12" />
          <div className="space-y-1">
            <div className="h-2 w-16 bg-white/10 rounded mb-2" />
            {[1,2,3].map(i => <div key={i} className="h-10 bg-white/10 rounded-xl" />)}
          </div>
        </div>
      </aside>

      {/* Main skeleton */}
      <main className="flex-1 min-w-0 overflow-y-auto">
        <div className="p-4 sm:p-5 lg:p-6 space-y-4">
          {/* Mobile top bar */}
          <div className="lg:hidden rounded-2xl h-20" style={{ background: 'linear-gradient(to right, #0c1a1d, #136976)' }} />

          {/* Module cards */}
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white rounded-2xl shadow-sm overflow-hidden">
              <div className="h-1.5 bg-slate-200" />
              <div className="px-5 py-4 bg-slate-50 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-slate-200 shrink-0" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-16 bg-slate-200 rounded-full" />
                  <div className="h-5 w-40 bg-slate-200 rounded" />
                </div>
                <div className="text-right hidden sm:block space-y-1">
                  <div className="h-6 w-12 bg-slate-200 rounded" />
                  <div className="h-3 w-16 bg-slate-100 rounded" />
                </div>
              </div>
              <div className="h-1 bg-slate-100" />
              <div className="p-4">
                <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-2">
                  {[1,2,3,4].map(j => (
                    <div key={j} className="flex items-center gap-3 p-3 rounded-xl border border-slate-100">
                      <div className="w-9 h-9 rounded-lg bg-slate-200 shrink-0" />
                      <div className="flex-1 space-y-1.5">
                        <div className="h-3.5 bg-slate-200 rounded w-3/4" />
                        <div className="h-2.5 bg-slate-100 rounded w-1/2" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
