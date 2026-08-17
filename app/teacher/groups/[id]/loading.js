export default function GroupDetailLoading() {
  return (
    <div className="space-y-4 xs:space-y-5 md:space-y-6 animate-pulse">
      {/* Back link & Header skeleton */}
      <div>
        <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
        <div className="flex items-center gap-3">
          <div className="h-7 xs:h-8 md:h-9 bg-gray-200 rounded-lg w-40"></div>
          <div className="h-6 w-14 bg-gray-200 rounded-full"></div>
        </div>
        <div className="h-4 bg-gray-200 rounded w-32 mt-1"></div>
      </div>

      {/* Button skeleton */}
      <div className="h-10 xs:h-11 md:h-12 bg-gray-200 rounded-lg w-48"></div>

      {/* Info cards skeleton */}
      <div className="grid grid-cols-3 gap-2 xs:gap-3 md:gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg xs:rounded-xl shadow-sm p-3 xs:p-4 md:p-6">
            <div className="flex flex-col xs:flex-row items-center xs:items-start gap-2 xs:gap-3">
              <div className="w-10 h-10 xs:w-11 xs:h-11 md:w-14 md:h-14 bg-gray-200 rounded-lg"></div>
              <div>
                <div className="h-3 xs:h-4 bg-gray-200 rounded w-16 mb-2"></div>
                <div className="h-5 xs:h-6 bg-gray-200 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Students list skeleton */}
      <div className="bg-white rounded-lg xs:rounded-xl shadow-sm p-3 xs:p-4 md:p-6">
        <div className="h-5 xs:h-6 bg-gray-200 rounded w-36 mb-4"></div>
        <div className="space-y-2 xs:space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-2.5 xs:p-3 md:p-4 bg-gray-50 rounded-lg xs:rounded-xl">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 xs:gap-3">
                  <div className="w-8 h-8 xs:w-9 xs:h-9 md:w-10 md:h-10 bg-gray-200 rounded-full"></div>
                  <div>
                    <div className="h-4 bg-gray-200 rounded w-28 mb-1"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-8 bg-gray-200 rounded"></div>
                  <div className="h-6 w-8 bg-gray-200 rounded"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
