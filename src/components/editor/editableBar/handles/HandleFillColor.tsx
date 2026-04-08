import { Tooltip } from "@/components/tooltip/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as fabric from "fabric";
import { PaintBucket } from "lucide-react";
import { useEffect, useState } from "react";
import { ColorPicker } from "@/components/colorPicker";
import { useTranslations } from "next-intl";
import { CanvasObjectType } from "./type";

export const HandleFillColor = ({ object, canvas }: CanvasObjectType) => {
  const [color, setColor] = useState<string | fabric.TFiller | null>("#000");
  const t = useTranslations("pages.editor.editableBar")

  const handleChangeColor = (e: string) => {
    if (!object || !canvas) return;
    setColor(e);
    object.set({ fill: e.toString() });
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  useEffect(() => {
    setColor(object.fill === "currentColor" ? "#000" : object.fill);
  }, [object]);

  return (
    <DropdownMenu>
      <Tooltip content={t("fillColor")}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
          >
            <PaintBucket className="w-6 h-6" />
          </button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
        <div className="flex justify-between w-full">
          <span className="text-xs">{t("fillColor")}</span>
        </div>
        <ColorPicker
          value={color as string}
          onChange={handleChangeColor}
          className="min-h-8 w-full border-gray-300"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
