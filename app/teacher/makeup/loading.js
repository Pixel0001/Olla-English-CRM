export default function MakeupLoading() {
  return (
    <div className="space-y-4 xs:space-y-5 md:space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 xs:gap-4">
        <div>
          <div className="h-6 xs:h-7 md:h-8 bg-gray-200 rounded-lg w-48 mb-2"></div>
          <div className="h-4 xs:h-5 bg-gray-200 rounded w-64"></div>
        </div>
        <div className="h-10 xs:h-11 w-44 bg-gray-200 rounded-xl"></div>
      </div>

      {/* Stats cards skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-2 xs:gap-3 md:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg xs:rounded-xl p-3 xs:p-4 border border-gray-100 shadow-sm">
            <div className="flex items-center gap-2 xs:gap-3">
              <div className="w-9 h-9 xs:w-10 xs:h-10 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-3 bg-gray-200 rounded w-20 mb-1"></div>
                <div className="h-6 bg-gray-200 rounded w-10"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Scheduled sessions skeleton */}
      <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-3 xs:px-4 md:px-6 py-3 xs:py-4 md:py-5 border-b border-gray-100 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="h-5 xs:h-6 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="p-4 xs:p-5 md:p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 xs:gap-4">
            {[1, 2].map((i) => (
              <div key={i} className="bg-gray-50 rounded-xl p-3 xs:p-4">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mb-3"></div>
                <div className="flex gap-1">
                  {[1, 2, 3].map((j) => (
                    <div key={j} className="h-6 w-16 bg-gray-200 rounded-full"></div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Groups with absences skeleton */}
      <div className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="px-3 xs:px-4 md:px-6 py-3 xs:py-4 md:py-5 border-b border-gray-100">
          <div className="h-5 xs:h-6 bg-gray-200 rounded w-40"></div>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 xs:p-5">
              <div className="flex items-center justify-between mb-3 xs:mb-4">
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="w-9 h-9 xs:w-10 xs:h-10 bg-gray-200 rounded-lg"></div>
                  <div>
                    <div className="h-4 xs:h-5 bg-gray-200 rounded w-28 mb-1"></div>
                    <div className="h-3 xs:h-4 bg-gray-200 rounded w-20"></div>
                  </div>
                </div>
                <div className="h-8 w-28 bg-gray-200 rounded-lg"></div>
              </div>
              <div className="grid grid-cols-1 xs:grid-cols-2 lg:grid-cols-3 gap-2 xs:gap-3 ml-0 sm:ml-10">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="flex items-center gap-2 xs:gap-3 p-2 xs:p-3 bg-gray-50 rounded-lg xs:rounded-xl">
                    <div className="w-8 h-8 xs:w-10 xs:h-10 bg-gray-200 rounded-full"></div>
                    <div>
                      <div className="h-3 xs:h-4 bg-gray-200 rounded w-20 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-14"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
