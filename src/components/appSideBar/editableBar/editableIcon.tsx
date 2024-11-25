import { Tooltip } from "@/components/tooltip/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import * as fabric from "fabric";
import { Blend, PenLine, PaintBucket } from "lucide-react";
import { useState } from "react";
import { ButtonIcon } from "./buttonIcon";
import { ColorPicker } from "@/components/colorPicker";

export const EditICon = ({
  object,
  canvas,
}: {
  object: fabric.FabricImage;
  canvas: fabric.Canvas | null;
}) => {
  const [opacity, setOpacity] = useState<number[]>([object?.opacity * 100]);
  const [color, setColor] = useState<string | fabric.TFiller | null>("#000");
  const [colorStroke, setColorStroke] = useState<
    string | fabric.TFiller | null
  >("#000");

  const handleOpacity = (e: number[]) => {
    if (!object || !canvas) return;
    setOpacity(e);
    object.set({ opacity: e[0] / 100 });
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  const handleChangeColorStroke = (e: string) => {
    if (!object || !canvas) return;
    setColorStroke(e);
    object.set({ stroke: e.toString() });
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  const handleChangeColor = (e: string) => {
    if (!object || !canvas) return;
    setColor(e);
    object.set({ fill: e.toString() });
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  return (
    <>
      <DropdownMenu>
        <Tooltip content="Cor da borda">
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-300/70"
            >
              <PenLine className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
          <div className="flex justify-between w-full">
            <span className="text-xs">Cor da borda</span>
            <p className="text-start text-xs">{opacity}%</p>
          </div>
          <ColorPicker
            value={colorStroke as string}
            onChange={handleChangeColorStroke}
            className="border-gray-300"
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <Tooltip content="Cor de fundo">
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-300/70"
            >
              <PaintBucket className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
          <div className="flex justify-between w-full">
            <span className="text-xs">Cor de fundo</span>
            <p className="text-start text-xs">{opacity}%</p>
          </div>
          <ColorPicker
            value={color as string}
            onChange={handleChangeColor}
            className="border-gray-300"
          />
        </DropdownMenuContent>
      </DropdownMenu>
      <DropdownMenu>
        <Tooltip content="Opacidade">
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="flex justify-center items-center w-10 h-10 rounded-full hover:bg-gray-300/70"
            >
              <Blend className="w-6 h-6" />
            </button>
          </DropdownMenuTrigger>
        </Tooltip>
        <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
          <div className="flex justify-between w-full">
            <span className="text-xs">Opacidade</span>
            <p className="text-start text-xs">{opacity}%</p>
          </div>
          <Slider
            value={opacity}
            max={100}
            min={1}
            step={1}
            className="w-full"
            onValueChange={handleOpacity}
          />
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
};
