"use client";

import { Tooltip } from "@/components/tooltip/tooltip";
import { AlignJustify, AlignLeft, AlignRight } from "lucide-react";
import { CanvasObjectType } from "./type";
import { useState } from "react";

export const HandleAlignText = ({ object, canvas }: CanvasObjectType) => {
  const [alignText, setAlignText] = useState({
    icon: AlignJustify,
    align: "center",
  });

  const handleTextAlign = () => {
    if (!object || !canvas) return;
    setAlignText((prev) => {
      if (prev.align === "center") {
        object.set({ textAlign: "left" });
        //@ts-ignore
        canvas.fire("modified", { target: object });
        canvas.renderAll();
        return {
          icon: AlignLeft,
          align: "left",
        };
      }
      if (prev.align === "left") {
        object.set({ textAlign: "right" });
        //@ts-ignore
        canvas.fire("modified", { target: object });
        canvas.renderAll();
        return {
          icon: AlignRight,
          align: "right",
        };
      }
      object.set({ textAlign: "center" });
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return {
        icon: AlignJustify,
        align: "center",
      };
    });
  };
  return (
    <Tooltip content="Alinhar texto">
      <button
        type="button"
        onClick={handleTextAlign}
        className="border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none"
      >
        <alignText.icon />
      </button>
    </Tooltip>
  );
};
