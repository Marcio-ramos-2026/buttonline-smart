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

export const HandleFillCanvasColor = ({ object, canvas }: CanvasObjectType) => {
  const [colorFill, setColorFill] = useState<string | null>(null);
  const t = useTranslations("pages.editor.editableBar");

  const applyFill = (color: string) => {
    if (!object || !canvas) return;

    // SVG / custom icon (Group)
    if (object.type === "group") {
    //@ts-ignore
      const group = object as fabric.Group;

      group.getObjects().forEach(child => {
        if ("fill" in child) {
          child.set({ fill: color });
        }
      });

      group.dirty = true;
    } 
    // Shapes / paths normais
    else if ("fill" in object) {
      object.set({ fill: color });
    }

    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  const handleChangeFill = (color: string) => {
    setColorFill(color);
    applyFill(color);
  };

  useEffect(() => {
    if (!object) return;

    if (object.type === "group") {
        //@ts-ignore
      const firstWithFill = (object as fabric.Group)
        .getObjects()
        .find(o => "fill" in o && o.fill);

      setColorFill(
        (firstWithFill as any)?.fill?.toString() ?? "#000000"
      );
    } else {
      setColorFill((object as any)?.fill?.toString() ?? "#000000");
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
          className="border-gray-300"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
