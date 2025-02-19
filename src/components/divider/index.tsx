import { PlusIcon } from '@heroicons/react/20/solid'
import { cn } from "@/lib/utils";

export default function DividerHorizontal({className}:{className?:string}) {
  return (
    <div className={cn("relative", className)}>
      <div aria-hidden="true" className=" inset-0 flex items-center">
        <div className="w-full border-t border-gray-300" />
      </div>
      {/* <div className="relative flex justify-center">
        <span className="bg-white px-2 text-gray-500">
          
        </span>
      </div> */}
    </div>
  )
}
