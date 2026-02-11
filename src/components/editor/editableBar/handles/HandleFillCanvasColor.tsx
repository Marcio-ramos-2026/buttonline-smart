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
import { getFillAreaObject } from "@/components/editor/model";

export const HandleFillCanvasColor = ({ object, canvas }: CanvasObjectType) => {
  const [colorFill, setColorFill] = useState<string | null>(null);
  const t = useTranslations("pages.editor.editableBar");

  const applyFill = (color: string) => {
    if (!object || !canvas) return;

    if (object.type === "group") {
      const group = object as unknown as fabric.Group;
      const fillAreaObj = getFillAreaObject(group);
      if (fillAreaObj) {
        fillAreaObj.set("fill", color);
        fillAreaObj.set("dirty", true);
      }
      group.set("dirty", true);
      group.setCoords?.();
    } else if ("fill" in object) {
      object.set({ fill: color });
    }

    (canvas as fabric.Canvas & { _objectsToRender?: unknown })._objectsToRender = undefined;
    (canvas as fabric.Canvas & { fire(name: string, opt?: unknown): void }).fire("modified", { target: object });
    canvas.requestRenderAll?.() ?? canvas.renderAll?.();
  };

  const handleChangeFill = (color: string) => {
    setColorFill(color);
    applyFill(color);
  };

  useEffect(() => {
    if (!object) return;

    if (object.type === "group") {
      const fillAreaObj = getFillAreaObject(object as unknown as fabric.Group);
      const raw = (fillAreaObj as fabric.Object & { fill?: unknown })?.fill?.toString();
      setColorFill(raw && raw !== "transparent" ? raw : "#000000");
    } else {
      const raw = (object as fabric.Object & { fill?: unknown })?.fill?.toString();
      setColorFill(raw && raw !== "transparent" ? raw : "#000000");
    }
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
          value={colorFill as string}
          onChange={handleChangeFill}
          className="min-h-8 w-full border-gray-300"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
