export default function EditUserLoading() {
  return (
    <>
        <div className="container mx-auto py-10 space-y-12">
          <div className="animate-pulse bg-gray-600 h-8 rounded-lg w-36" />
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 md:grid-cols-2">
            <div className="flex flex-col gap-2">
              <div className="animate-pulse bg-gray-600 rounded-lg h-6 w-24" />
              <div className="animate-pulse bg-gray-600 rounded-lg h-12" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="animate-pulse bg-gray-600 rounded-lg h-6 w-24" />
              <div className="animate-pulse bg-gray-600 rounded-lg h-12" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="animate-pulse bg-gray-600 rounded-lg h-6 w-24" />
              <div className="animate-pulse bg-gray-600 rounded-lg h-12" />
            </div>
            <div className="flex flex-col gap-2">
              <div className="animate-pulse bg-gray-600 rounded-lg h-6 w-24" />
              <div className="animate-pulse bg-gray-600 rounded-lg h-12" />
            </div>
          </div>
        </div>
      </>
  );
}
