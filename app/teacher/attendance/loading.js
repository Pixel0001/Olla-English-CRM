export default function AttendanceLoading() {
  return (
    <div className="space-y-4 xs:space-y-5 md:space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-6 xs:h-7 md:h-8 bg-gray-200 rounded-lg w-44 mb-2"></div>
        <div className="h-4 xs:h-5 bg-gray-200 rounded w-72"></div>
      </div>

      {/* Sessions list skeleton */}
      <div className="space-y-3 xs:space-y-4">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-3 xs:p-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 xs:gap-4">
              {/* Date & Group Info */}
              <div className="flex items-start gap-2.5 xs:gap-3 flex-1">
                <div className="w-9 h-9 xs:w-11 xs:h-11 bg-gray-200 rounded-lg"></div>
                <div>
                  <div className="h-4 xs:h-5 bg-gray-200 rounded w-36 mb-1"></div>
                  <div className="h-3 xs:h-4 bg-gray-200 rounded w-28 mb-1"></div>
                  <div className="h-3 bg-gray-200 rounded w-20"></div>
                </div>
              </div>

              {/* Stats */}
              <div className="flex items-center gap-2 xs:gap-3">
                <div className="h-7 w-12 bg-gray-200 rounded-lg"></div>
                <div className="h-7 w-12 bg-gray-200 rounded-lg"></div>
                <div className="h-7 w-20 bg-gray-200 rounded-lg"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
