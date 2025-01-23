"use client";

import { Tooltip } from "@/components/tooltip/tooltip";
import { MoveVertical } from "lucide-react";
import { CanvasObjectType } from "./type";

export const HandleCenterCanvasY = ({
  canvas,
  object,
}: CanvasObjectType) => {
    const handleCenterY = () => {
        if (!canvas) return;
        canvas.centerObjectV(object)
    }

  return (
    <Tooltip content="Centralizar verticalmente">
      <button
        type="button"
        onClick={handleCenterY}
        className="border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none"
      >
        <MoveVertical />
      </button>
    </Tooltip>
  );
};
