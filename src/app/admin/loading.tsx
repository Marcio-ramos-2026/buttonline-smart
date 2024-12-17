export default function Loading() {
  return (
    <div className="max-h-[90vh] w-full overflow-y-hidden p-6">
      <div className="flex flex-col w-full h-full animate-pulse space-y-12">
        <div className="w-full flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <div className="bg-gray-400 h-8 w-44 md:w-72 rounded-md" />
            <div className="bg-gray-400 h-5 w-40 md:w-60 rounded-md" />
          </div>
          <div className="bg-gray-400 h-10 w-36 md:w-56 rounded-md" />
        </div>
        <div className="flex flex-col gap-1.5 w-full">
          <div className="w-full h-9 bg-gray-400 rounded-md mb-4" />
          <div className="">
            {Array(9)
              .fill(null)
              .map((_, index) => {
                return (
                  <div
                    key={index}
                    className="w-full flex gap-5 md:gap-8 px-2 items-center even:bg-gray-200 h-[74px] rounded-md"
                  >
                    <div className="w-4/5 md:w-1/4 h-5 bg-gray-400 rounded-md" />
                    <div className="w-4/5 md:w-1/4 h-5 bg-gray-400 rounded-md" />
                    <div className="w-1/4 h-5 bg-gray-400 rounded-md hidden md:block" />
                    <div className="w-1/4 h-5 bg-gray-400 rounded-md hidden md:block" />
                    <div className="w-6 h-6 bg-gray-400 rounded-md" />
                  </div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
