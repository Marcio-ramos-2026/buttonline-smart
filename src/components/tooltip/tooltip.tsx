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
        <TooltipContent>
          <p>{content}</p>
        </TooltipContent>
      </TooltipBase>
    </TooltipProvider>
  );
};
