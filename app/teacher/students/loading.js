export default function StudentsLoading() {
  return (
    <div className="space-y-4 xs:space-y-5 md:space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-6 xs:h-7 bg-gray-200 rounded-lg w-32 mb-2"></div>
        <div className="h-4 xs:h-5 bg-gray-200 rounded w-64"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg xs:rounded-xl p-2.5 xs:p-3 md:p-4 border border-gray-200 shadow-sm">
            <div className="flex items-center gap-2 xs:gap-3">
              <div className="w-8 h-8 xs:w-9 xs:h-9 md:w-10 md:h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-16 mb-1"></div>
                <div className="h-5 xs:h-6 bg-gray-200 rounded w-8"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Filters skeleton */}
      <div className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 border border-gray-200 shadow-sm">
        <div className="flex flex-col sm:flex-row gap-2 xs:gap-3">
          <div className="flex-1 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex gap-2 xs:gap-3">
            <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
            <div className="h-10 w-24 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </div>

      {/* Students list skeleton */}
      <div className="space-y-2 xs:space-y-3 md:space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-lg xs:rounded-xl border border-gray-200 shadow-sm p-3 xs:p-4">
            <div className="flex items-center justify-between gap-2 xs:gap-3">
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="w-9 h-9 xs:w-10 xs:h-10 md:w-12 md:h-12 bg-gray-200 rounded-full"></div>
                <div>
                  <div className="h-4 xs:h-5 bg-gray-200 rounded w-32 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-24 mb-1"></div>
                  <div className="flex gap-1">
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                    <div className="h-5 w-16 bg-gray-200 rounded"></div>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-6 w-12 bg-gray-200 rounded-full"></div>
                <div className="w-4 h-4 xs:w-5 xs:h-5 bg-gray-200 rounded"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
