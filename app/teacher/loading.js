export default function TeacherLoading() {
  return (
    <div className="space-y-4 xs:space-y-5 md:space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div>
        <div className="h-6 xs:h-7 md:h-8 bg-gray-200 rounded-lg w-48 mb-2"></div>
        <div className="h-4 xs:h-5 bg-gray-200 rounded w-64"></div>
      </div>

      {/* Stats grid skeleton */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 xs:gap-4 md:gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-3 xs:p-4 md:p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="h-3 xs:h-4 bg-gray-200 rounded w-20 mb-2"></div>
                <div className="h-6 xs:h-8 bg-gray-200 rounded w-12"></div>
              </div>
              <div className="w-8 h-8 xs:w-10 xs:h-10 md:w-12 md:h-12 bg-gray-200 rounded-lg xs:rounded-xl"></div>
            </div>
          </div>
        ))}
      </div>

      {/* Content cards skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 xs:gap-5 md:gap-6">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl xs:rounded-2xl shadow-sm border border-gray-100 p-4 xs:p-5 md:p-6">
            <div className="h-5 xs:h-6 bg-gray-200 rounded w-32 mb-4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((j) => (
                <div key={j} className="p-3 bg-gray-50 rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
