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

export const HandleStrokeColor = ({ object, canvas }: EditShapedProps) => {
  const [colorStroke, setColorStroke] = useState<
    string | fabric.TFiller | null
  >(null);
  const t = useTranslations("pages.editor.editableBar");

  const handleChangeColorStroke = (e: string) => {
    if (!object || !canvas) return;
    setColorStroke(e);
    object.set({ stroke: e.toString() });
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  useEffect(() => {
    setColorStroke(object.stroke || "#000");
  }, [object]);

  return (
    <DropdownMenu>
      <Tooltip content={t('strokeColor')}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
          >
            <PenLine className="w-6 h-6" />
          </button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
        <div className="flex justify-between w-full">
          <span className="text-xs">{t('strokeColor')}</span>
        </div>
        <ColorPicker
          value={colorStroke as string}
          onChange={handleChangeColorStroke}
          className="border-gray-300"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
