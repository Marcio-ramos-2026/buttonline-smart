"use client";

import { Tooltip } from "@/components/tooltip/tooltip";
import { Bold } from "lucide-react";
import { CanvasObjectType } from "./type";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const HandleTextBold = ({ object, canvas }: CanvasObjectType) => {
  const [textBold, setTextBold] = useState(false);

  const handleTextBold = () => {
    if (!object || !canvas) return;
    setTextBold((prev) => {
      prev = !prev;
      if (prev) {
        object.set({ fontWeight: 900 });
      } else {
        object.set({ fontWeight: 400 });
      }
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return prev;
    });
  };
  return (
    <Tooltip content="Negrito">
      <button
        type="button"
        onClick={handleTextBold}
        className={cn(
          "border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none",
          textBold ? "bg-gray-900/20" : "bg-transparent hover:bg-gray-900/20"
        )}
      >
        <Bold />
      </button>
    </Tooltip>
  );
};
