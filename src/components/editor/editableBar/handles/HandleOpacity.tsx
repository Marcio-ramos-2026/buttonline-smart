import { Tooltip } from "@/components/tooltip/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import * as fabric from "fabric";
import { Blend, PenLine, PaintBucket } from "lucide-react";
import { useEffect, useState } from "react";
import { ColorPicker } from "@/components/colorPicker";
import { useTranslations } from "next-intl";

type EditShapedProps = {
  object: fabric.FabricImage;
  canvas: fabric.Canvas | null;
};

export const HandleOpacity = ({ object, canvas }: EditShapedProps) => {
  const [opacity, setOpacity] = useState<number[]>([object?.opacity * 100]);
  const t = useTranslations("pages.editor.editableBar");

  const handleOpacity = (e: number[]) => {
    if (!object || !canvas) return;
    setOpacity(e);
    object.set({ opacity: e[0] / 100 });
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  useEffect(() => {
    setOpacity([object?.opacity * 100]);
  }, [object]);

  return (
    <DropdownMenu>
      <Tooltip content={t("opacity")}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
          >
            <Blend className="w-6 h-6" />
          </button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
        <div className="flex justify-between w-full">
          <span className="text-xs">{t("opacity")}</span>
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
  );
};
