import {
  Tooltip as TooltipBase,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { ReactElement } from "react";

export const Tooltip = ({
  children,
  content,
}: {
  children: ReactElement;
  content: string;
}) => {
  return (
    <TooltipProvider delayDuration={300}>
      <TooltipBase>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent className="z-[9999]">
          <p>{content}</p>
        </TooltipContent>
      </TooltipBase>
    </TooltipProvider>
  );
};
