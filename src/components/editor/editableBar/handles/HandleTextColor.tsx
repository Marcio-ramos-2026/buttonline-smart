"use client";

import { ColorPicker } from "@/components/colorPicker";
import * as fabric from "fabric";
import { useEffect, useState } from "react";
import { CanvasObjectType } from "./type";

export const HandleTextColor = ({ object, canvas }: CanvasObjectType) => {
  const [color, setColor] = useState<string | fabric.TFiller | null>(null);

  const handleChangeColor = (e: string) => {
    if (!object || !canvas) return;
    setColor(e);
    object.set({ fill: e.toString() });
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  useEffect(() => {
    if (!object) return;

    setColor(object.fill);
  }, [object]);

  return (
    <ColorPicker
      value={color as string}
      onChange={handleChangeColor}
      className="border-gray-300 !h-[40px]"
    />
  );
};
