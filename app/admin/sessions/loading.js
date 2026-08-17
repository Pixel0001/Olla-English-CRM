export default function SessionsLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-8 bg-gray-200 rounded-lg w-32 mb-2"></div>
        <div className="h-5 bg-gray-200 rounded w-56"></div>
      </div>

      {/* Filters skeleton */}
      <div className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
        <div className="flex flex-wrap gap-4">
          <div className="h-10 w-48 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
          <div className="h-10 w-36 bg-gray-200 rounded-lg"></div>
        </div>
      </div>

      {/* Sessions list skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 bg-gray-200 rounded-xl"></div>
                <div>
                  <div className="h-5 bg-gray-200 rounded w-40 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="h-6 w-16 bg-gray-200 rounded-full"></div>
                <div className="h-6 w-12 bg-gray-200 rounded-lg"></div>
                <div className="h-8 w-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
