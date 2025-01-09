import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { ReactNode } from "react";

export default function LayoutEditUser({ children }: { children: ReactNode }) {
  return (
    <>
      <header className="h-16 w-full border-b border-b-solid border-b-gray-300 shadow-sm py-3 px-10 flex items-center">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger>
            <Link
              href="/"
              className="border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-gray-900/20 block w-fit"
            >
              <ArrowLeft />
            </Link>
          </TooltipTrigger>
          <TooltipContent>Voltar</TooltipContent>
        </Tooltip>
        </TooltipProvider>
      </header>
      {children}
    </>
  );
}
