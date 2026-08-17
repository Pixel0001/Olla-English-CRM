export default function GroupsLoading() {
  return (
    <div className="space-y-4 xs:space-y-5 md:space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-6 xs:h-7 md:h-8 bg-gray-200 rounded-lg w-40 mb-2"></div>
        <div className="h-4 xs:h-5 bg-gray-200 rounded w-56"></div>
      </div>

      {/* Groups grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 xs:gap-4 md:gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm p-4 xs:p-5 md:p-6 border border-gray-100">
            <div className="flex items-start justify-between mb-3 xs:mb-4">
              <div className="flex-1">
                <div className="h-5 xs:h-6 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
              <div className="w-14 h-5 bg-gray-200 rounded-full"></div>
            </div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-full"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex flex-wrap gap-1">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-6 w-16 bg-gray-200 rounded"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
