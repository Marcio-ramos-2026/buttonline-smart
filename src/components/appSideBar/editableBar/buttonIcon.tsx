import { cn } from "@/lib/utils";
import { ReactNode } from "react";

//TODO colocar forwardref

export const ButtonIcon = ({ icon, handler, selected = false } : { icon: ReactNode, handler?: () => void, selected?: boolean }) => {
  return (
    <button
      type="button"
      onClick={handler}
      className={cn(
        "border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none",
        selected ? "bg-gray-900/20" : "bg-transparent hover:bg-gray-900/20"
      )}
    >
      {icon}
    </button>
  );
};
