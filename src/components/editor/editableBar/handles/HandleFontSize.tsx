'use client'

import { Input } from "@/components/ui/input"
import { ChangeEvent, useEffect, useState } from "react";
import { CanvasObjectType } from "./type";

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 200;

export const HandleFontSize = ({
  canvas,
  object,
}: CanvasObjectType) => {
    const [fontSize, setFontSize] = useState<string>("");
    
    const handleChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
        if (!object || !canvas) return;
        if (!e.target.value) {
          setFontSize("");
          return;
        }
        if (Number(e.target.value) < MIN_FONT_SIZE) {
          setFontSize(MIN_FONT_SIZE.toString());
          object.set({ fontSize: Number(MIN_FONT_SIZE) });
          //@ts-ignore
          canvas.fire("modified", { target: object });
          canvas.renderAll();
          return;
        }
        if (Number(e.target.value) > MAX_FONT_SIZE) {
          setFontSize(MAX_FONT_SIZE.toString());
          object.set({ fontSize: Number(MAX_FONT_SIZE) });
          //@ts-ignore
          canvas.fire("modified", { target: object });
          canvas.renderAll();
          return;
        }
        setFontSize(e.target.value);
        object.set({ fontSize: Number(e.target.value) });
        //TODO evento customizado: deve ser mudado
        //@ts-ignore
        canvas.fire("modified", { target: object });
        canvas.renderAll();
      };

      useEffect(() => {
        if (!object) return;
        //@ts-ignore
        setFontSize(object.fontSize?.toString());
      }, [object])

    return (
        <Input
            type="number"
            className="[&_input]:max-w-20 [&_input]:min-w-12 [&_input]:py-1 md:[&_input]:py-2 [&_input]:h-full [&_input]:border-gray-300 h-full"
            value={fontSize}
            onChange={handleChangeSize}
          />
    )
}