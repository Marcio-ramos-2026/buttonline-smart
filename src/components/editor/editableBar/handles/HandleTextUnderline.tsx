"use client";

import { Tooltip } from "@/components/tooltip/tooltip";
import { Underline } from "lucide-react";
import { CanvasObjectType } from "./type";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const HandleTextUnderline = ({ object, canvas }: CanvasObjectType) => {
    const [textUnderline, setUnderline] = useState(false);

  const handleTextUnderline = () => {
    if (!object || !canvas) return;
    setUnderline((prev) => {
      prev = !prev;
      if (prev) {
        object.set({ underline: prev });
      } else {
        object.set({ underline: prev });
      }
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return prev;
    });
  };
  return (
    <Tooltip content="Sublinhado">
      <button
        type="button"
        onClick={handleTextUnderline}
        className={cn(
          "border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none",
          textUnderline
            ? "bg-gray-900/20"
            : "bg-transparent hover:bg-gray-900/20"
        )}
      >
        <Underline />
      </button>
    </Tooltip>
  );
};
