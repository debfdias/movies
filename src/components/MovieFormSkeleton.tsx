export default function MovieFormSkeleton() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="max-w-5xl w-full rounded-xl shadow-2xl overflow-hidden">
        <div className="flex flex-col md:flex-row h-auto md:h-[600px]">
          <div className="w-full md:w-1/2 p-4 sm:p-6 bg-white border-b md:border-b-0 md:border-r border-gray-200">
            <div className="h-64 sm:h-80 md:h-full w-full rounded-lg border-2 border-gray-300 overflow-hidden bg-gray-200 animate-pulse">
              <div className="h-full w-full bg-gray-300" />
            </div>
          </div>

          <div className="w-full md:w-1/2 p-4 sm:p-8 bg-[#132b34] flex flex-col">
            <div className="h-10 w-1/2 bg-[#224957] rounded-lg mb-8 animate-pulse" />

            <div className="space-y-6 flex-1">
              <div className="relative">
                <div className="h-16 w-full bg-[#224957] rounded-lg animate-pulse" />
              </div>

              <div className="relative">
                <div className="h-16 w-full bg-[#224957] rounded-lg animate-pulse" />
              </div>

              <div className="relative">
                <div className="h-16 w-full bg-[#224957] rounded-lg animate-pulse" />
              </div>
            </div>

            <div className="mt-auto pt-8">
              <div className="flex space-x-4">
                <div className="flex-1 h-12 bg-gray-600 rounded-lg animate-pulse" />
                <div className="flex-1 h-12 bg-gray-600 rounded-lg animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
