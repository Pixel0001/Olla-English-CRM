export default function Loading() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
          <div className="h-5 w-32 bg-gray-100 rounded mt-2 animate-pulse"></div>
        </div>
        <div className="h-10 w-48 bg-gray-200 rounded-xl animate-pulse"></div>
      </div>

      {/* Filter skeleton */}
      <div className="flex items-center gap-2">
        <div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-8 w-24 bg-gray-200 rounded-lg animate-pulse"></div>
        <div className="h-8 w-28 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>

      {/* Notifications skeleton */}
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
            <div className="flex gap-4">
              <div className="w-12 h-12 bg-gray-200 rounded-xl animate-pulse"></div>
              <div className="flex-1">
                <div className="h-5 w-3/4 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-4 w-full bg-gray-100 rounded mt-2 animate-pulse"></div>
                <div className="h-4 w-1/2 bg-gray-100 rounded mt-1 animate-pulse"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
