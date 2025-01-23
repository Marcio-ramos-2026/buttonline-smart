"use client";

import * as fabric from "fabric";
import { Tooltip } from "@/components/tooltip/tooltip";
import { MoveHorizontal } from "lucide-react";

export const HandleCenterCanvasX = ({
  canvas,
  object,
}: {
  object: fabric.Textbox;
  canvas: fabric.Canvas | null;
}) => {
    const handleCenterX = () => {
        if (!canvas) return;
        canvas.centerObjectH(object)
    }

  return (
    <Tooltip content="Centralizar horizontalmente">
      <button
        type="button"
        onClick={handleCenterX}
        className="border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none"
      >
        <MoveHorizontal />
      </button>
    </Tooltip>
  );
};
