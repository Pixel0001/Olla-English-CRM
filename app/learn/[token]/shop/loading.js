export default function ShopLoading() {
  return (
    <div className="min-h-screen bg-[#f0fafb] animate-pulse">
      <div className="max-w-4xl mx-auto px-4 pt-6 pb-10 space-y-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-slate-200 rounded-lg" />
          <div className="h-8 w-36 bg-slate-200 rounded-xl" />
        </div>

        {/* Economy bar */}
        <div className="h-14 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200" />

        {/* Tabs */}
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map(i => (
            <div key={i} className="h-9 w-20 bg-white rounded-xl shadow-sm" />
          ))}
        </div>

        {/* Item grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <div key={i} className="h-48 bg-white rounded-2xl shadow-sm ring-1 ring-slate-200" />
          ))}
        </div>
      </div>
    </div>
  )
}
