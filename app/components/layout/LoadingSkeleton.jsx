export default function LoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, index) => (
          <div key={index} className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="skeleton h-48 w-full" />
            <div className="p-4 space-y-3">
              <div className="skeleton h-6 w-3/4" />
              <div className="skeleton h-4 w-1/2" />
              <div className="flex gap-2">
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-4 w-1/3" />
                <div className="skeleton h-4 w-1/3" />
              </div>
              <div className="skeleton h-8 w-full" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}