import { cn } from "@/lib/utils";
import { TesteTrigger, useSidebar } from "../ui/sidebar-admin";

export const TriggerSidebar = ({ isOpenSidebar }: { isOpenSidebar: boolean }) => {
  return (
    <div className={cn(
        "absolute top-4 z-50 h-10 w-10 rounded-full bg-gray-200/10 backdrop-blur-sm border border-solid border-gray-800/20 flex items-center justify-center focus-visible:outline-none",
        isOpenSidebar ? '-right-5' : '-right-4'
    )}>
      <TesteTrigger className="text-gray-800"/>
    </div>
  );
};
