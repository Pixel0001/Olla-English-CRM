export default function TeachersLoading() {
  return (
    <div className="space-y-6 animate-pulse">
      {/* Header skeleton */}
      <div className="flex justify-between items-center">
        <div>
          <div className="h-8 bg-gray-200 rounded-lg w-32 mb-2"></div>
          <div className="h-5 bg-gray-200 rounded w-48"></div>
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded-lg"></div>
      </div>

      {/* Grid skeleton */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-start gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
              <div className="flex-1">
                <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-40 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-24"></div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100">
              <div className="flex gap-2">
                {[1, 2, 3].map((j) => (
                  <div key={j} className="h-6 w-16 bg-gray-200 rounded-full"></div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
