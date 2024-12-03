import { Tooltip } from "@/components/tooltip/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Slider } from "@/components/ui/slider";
import * as fabric from "fabric";
import {
  Blend,
  PenLine,
  PaintBucket,
  Layers,
  ChevronUp,
  ChevronDown,
  ChevronsDown,
  ChevronsUp,
} from "lucide-react";
import { useEffect, useState } from "react";
import { ColorPicker } from "@/components/colorPicker";
import { ButtonIcon } from "./buttonIcon";
import { cn } from "@/lib/utils";

type EditIconProps = {
  object: fabric.FabricImage;
  canvas: fabric.Canvas | null;
};

export const EditICon = ({ object, canvas }: EditIconProps) => {
  return (
    <div className="flex gap-2 flex-1">
      <HandleStrokeColor object={object} canvas={canvas} />
      <HandleFillColor object={object} canvas={canvas} />
      <HandleOpacity object={object} canvas={canvas} />
      <HandleLayer object={object} canvas={canvas} />
    </div>
  );
};

const HandleFillColor = ({ object, canvas }: EditIconProps) => {
  const [color, setColor] = useState<string | fabric.TFiller | null>("#000");

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
      <Tooltip content="Cor de fundo">
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
          <span className="text-xs">Cor de fundo</span>
        </div>
        <ColorPicker
          value={color as string}
          onChange={handleChangeColor}
          className="border-gray-300"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const HandleStrokeColor = ({ object, canvas }: EditIconProps) => {
  const [colorStroke, setColorStroke] = useState<
    string | fabric.TFiller | null
  >(null);

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
      <Tooltip content="Cor da borda">
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
          <span className="text-xs">Cor da borda</span>
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

const HandleOpacity = ({ object, canvas }: EditIconProps) => {
  const [opacity, setOpacity] = useState<number[]>([object?.opacity * 100]);

  const handleOpacity = (e: number[]) => {
    if (!object || !canvas) return;
    setOpacity(e);
    object.set({ opacity: e[0] / 100 });
    //@ts-ignore
    canvas.fire("modified", { target: object });

    canvas.bringObjectToFront(object);

    canvas.renderAll();
  };

  useEffect(() => {
    setOpacity([object?.opacity * 100]);
  }, [object]);

  return (
    <DropdownMenu>
      <Tooltip content="Opacidade">
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
  );
};

const HandleLayer = ({ object, canvas }: EditIconProps) => {
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
      <Tooltip content="Posição">
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
          <span className="text-xs">Posição</span>
        </div>

        <div className="flex">
          <button
            type="button"
            className="flex gap-2 items-center px-2 rounded-full hover:bg-gray-300/70 w-[145px]"
            onClick={() => handleChangeLayer("forward")}
          >
            <ChevronUp className="w-6 h-6" /> Cima
          </button>
          <button
            type="button"
            className="flex gap-2 items-center px-2 rounded-full hover:bg-gray-300/70 w-[145px]"
            onClick={() => handleChangeLayer("backwards")}
          >
            <ChevronDown className="w-6 h-6" /> Baixo
          </button>
        </div>

        <div className="flex">
          <button
            type="button"
            className="flex gap-2 items-center px-2 rounded-full hover:bg-gray-300/70 w-[145px]"
            onClick={() => handleChangeLayer("front")}
          >
            <ChevronsUp className="w-6 h-6" /> Para frente
          </button>
          <button
            type="button"
            className="flex gap-2 items-center px-2 rounded-full hover:bg-gray-300/70 w-[145px]"
            onClick={() => handleChangeLayer("back")}
          >
            <ChevronsDown className="w-6 h-6" /> Para trás
          </button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
