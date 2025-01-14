import { Tooltip } from "@/components/tooltip/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import * as fabric from "fabric";
import { Blend } from "lucide-react";
import { SetStateAction, useState } from "react";
import { ButtonIcon } from "./buttonIcon";
import { RemoveActiveObject } from "./removeActiveObject";

export const EditImage = ({
  object,
  canvas,
  setObject,
}: {
  object: fabric.FabricImage;
  canvas: fabric.Canvas | null;
  setObject: (object: SetStateAction<fabric.Object | null>) => void;
}) => {
  const [opacity, setOpacity] = useState<number[]>([object?.opacity * 100]);

  const handleOpacity = (e: number[]) => {
    if (!object || !canvas) return;
    setOpacity(e);
    object.set({ opacity: e[0] / 100 });
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  return (
    <div className="flex gap-1.5 md:gap-3 flex-1 [&_label]:w-fit h-full">
      <DropdownMenu>
        <Tooltip content="Opacidade">
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
            >
              <Blend className="w-6 h-6" />
            </button>
            {/* <ButtonIcon icon={<Blend />} /> */}
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
      <RemoveActiveObject canvas={canvas} setObject={setObject} />
    </div>
  );
};
