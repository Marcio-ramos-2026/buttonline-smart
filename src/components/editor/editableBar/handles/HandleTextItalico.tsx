"use client";

import { Tooltip } from "@/components/tooltip/tooltip";
import { Italic } from "lucide-react";
import { CanvasObjectType } from "./type";
import { useState } from "react";
import { cn } from "@/lib/utils";

export const HandleTextItalico = ({ object, canvas }: CanvasObjectType) => {
    const [textItalic, setItalic] = useState(false);

  const handleTextItalic = () => {
    if (!object || !canvas) return;
    setItalic((prev) => {
      prev = !prev;
      if (prev) {
        object.set({ fontStyle: "italic" });
      } else {
        object.set({ fontStyle: "normal" });
      }
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return prev;
    });
  };
  return (
    <Tooltip content="Itálico">
      <button
        type="button"
        onClick={handleTextItalic}
        className={cn(
          "border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none",
          textItalic ? "bg-gray-900/20" : "bg-transparent hover:bg-gray-900/20"
        )}
      >
        <Italic />
      </button>
    </Tooltip>
  );
};
