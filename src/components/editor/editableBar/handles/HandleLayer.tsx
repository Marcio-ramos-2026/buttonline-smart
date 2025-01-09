import { Tooltip } from "@/components/tooltip/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import * as fabric from "fabric";
import {
  Layers,
  ChevronUp,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
} from "lucide-react";
import { useTranslations } from "next-intl";

type EditIconProps = {
  object: fabric.FabricImage;
  canvas: fabric.Canvas | null;
};

export const HandleLayer = ({ object, canvas }: EditIconProps) => {
  const t = useTranslations("pages.editor.editableBar");

  const handleChangeLayer = (type: string) => {
    if (!object || !canvas) return;

    //um pra cima
    if (type == "forward") canvas.bringObjectForward(object);
    //para frente total
    if (type == "front") canvas.bringObjectToFront(object);
    //um pra tras
    if (type == "backwards") canvas.sendObjectBackwards(object);
    //para tras total
    if (type == "back") canvas.sendObjectToBack(object);

    canvas.renderAll();
  };

  return (
    <DropdownMenu>
      <Tooltip content={t("layer.layer")}>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
          >
            <Layers className="w-6 h-6" />
          </button>
        </DropdownMenuTrigger>
      </Tooltip>
      <DropdownMenuContent className="h-auto  px-4 py-3 rounded-md flex flex-col gap-1 ">
        <div className="flex justify-between w-full">
          <span className="text-xs">{t("layer.layer")}</span>
        </div>

        <div className="flex">
          <button
            type="button"
            className="flex gap-2 items-center px-2 rounded-full hover:bg-gray-300/70 w-[145px]"
            onClick={() => handleChangeLayer("forward")}
          >
            <ChevronUp className="w-6 h-6" /> {t("layer.up")}
          </button>
          <button
            type="button"
            className="flex gap-2 items-center px-2 rounded-full hover:bg-gray-300/70 w-[145px]"
            onClick={() => handleChangeLayer("backwards")}
          >
            <ChevronDown className="w-6 h-6" /> {t("layer.down")}
          </button>
        </div>

        <div className="flex">
          <button
            type="button"
            className="flex gap-2 items-center px-2 rounded-full hover:bg-gray-300/70 w-[145px]"
            onClick={() => handleChangeLayer("front")}
          >
            <ChevronsUp className="w-6 h-6" /> {t("layer.forward")}
          </button>
          <button
            type="button"
            className="flex gap-2 items-center px-2 rounded-full hover:bg-gray-300/70 w-[145px]"
            onClick={() => handleChangeLayer("back")}
          >
            <ChevronsDown className="w-6 h-6" /> {t("layer.back")}
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
