export default function OrarLoading() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="h-8 w-24 bg-gray-200 rounded animate-pulse"></div>
          <div className="h-4 w-48 bg-gray-200 rounded animate-pulse mt-2"></div>
        </div>
        <div className="h-10 w-40 bg-gray-200 rounded-lg animate-pulse"></div>
      </div>
      
      {[1, 2, 3].map(i => (
        <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="px-6 py-3 bg-gray-50 border-b border-gray-100">
            <div className="h-6 w-32 bg-gray-200 rounded animate-pulse"></div>
          </div>
          <div className="p-4 space-y-3">
            {[1, 2, 3].map(j => (
              <div key={j} className="flex gap-4 items-center">
                <div className="h-5 w-16 bg-gray-200 rounded animate-pulse"></div>
                <div className="flex-1 h-5 bg-gray-200 rounded animate-pulse"></div>
                <div className="h-5 w-24 bg-gray-200 rounded animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
