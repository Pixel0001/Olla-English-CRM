export default function MakeupLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 bg-gray-200 rounded-lg w-40 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-64"></div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 rounded w-10"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Sessions list skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-36 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-40"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-20 bg-gray-200 rounded-full"></div>
                <div className="h-8 w-24 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
