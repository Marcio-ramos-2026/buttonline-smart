"use client";

import { Tooltip } from "@/components/tooltip/tooltip";
import { cn } from "@/lib/utils";
import { useState } from "react";
import * as fabric from "fabric";
import Image from "next/image";
import shadowsvg from "@/lib/assets/shadowIcon.svg"

export const HandleShadow = ({
  canvas,
  object,
}: {
  object: fabric.Textbox;
  canvas: fabric.Canvas | null;
}) => {
  const [shadow, setShadow] = useState(false);

  const shadowValue = new fabric.Shadow({
    color: "#333",
    blur: 3,
    offsetX: 3,
    offsetY: 3,
  });

  const handleShadow = () => {
    if (!canvas) return;
    setShadow((prev) => {
      object.set({ shadow: !prev ? shadowValue : null });
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return !prev;
    });
  };

  return (
    <Tooltip content="Shadow">
      <button
        type="button"
        onClick={handleShadow}
        className={cn(
          "border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none",
          shadow ? "bg-gray-900/20" : "bg-transparent hover:bg-gray-900/20"
        )}
      >
        <Image src={shadowsvg} width={20} height={20} alt='icone shadow' />
      </button>
    </Tooltip>
  );
};
