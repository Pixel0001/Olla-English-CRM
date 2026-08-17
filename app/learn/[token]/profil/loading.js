export default function ProfilLoading() {
  return (
    <div className="min-h-screen bg-[#0c1a1d] animate-pulse">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 space-y-4">
        {/* Back button */}
        <div className="h-9 w-32 bg-[#0f2127] rounded-xl" />

        {/* Profile header */}
        <div className="bg-[#0f2127] rounded-2xl shadow-sm p-5 flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-[#30919f]/20 shrink-0" />
          <div className="flex-1 space-y-2">
            <div className="h-6 w-48 bg-[#30919f]/20 rounded-lg" />
            <div className="h-4 w-32 bg-white/5 rounded" />
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="bg-[#0f2127] rounded-2xl shadow-sm p-4 space-y-2">
              <div className="h-4 w-20 bg-[#30919f]/20 rounded" />
              <div className="h-8 w-12 bg-[#30919f]/20 rounded-lg" />
            </div>
          ))}
        </div>

        {/* Main cards */}
        <div className="h-64 bg-[#0f2127] rounded-2xl shadow-sm" />
        <div className="h-48 bg-[#0f2127] rounded-2xl shadow-sm" />
        <div className="h-56 bg-[#0f2127] rounded-2xl shadow-sm" />
      </div>
    </div>
  )
}
