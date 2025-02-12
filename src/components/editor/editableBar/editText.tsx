"use client";

import { cn } from "@/lib/utils";
import { ColorPicker } from "@/components/colorPicker";
import {
  Bold,
  Italic,
  Underline,
  AlignJustify,
  AlignLeft,
  AlignRight,
  AArrowDown,
  AArrowUp,
  Radius,
  Type,
} from "lucide-react";
import { useState, SetStateAction } from "react";
import * as fabric from "fabric";
import { Tooltip } from "@/components/tooltip/tooltip";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { RemoveActiveObject } from "./removeActiveObject";
import { HandleShadow } from "./handles/HandleShadow";
import { HandleCenterCanvasY } from "./handles/HandleCenterCanvasY";
import { HandleCenterCanvasX } from "./handles/HandleCenterCanvasX";
import { HandleFontFamily } from "./handles/HandleFontFamily";
import { HandleFontSize } from "./handles/HandleFontSize";
import { HandleTextColor } from "./handles/HandleTextColor";
import { HandleTextBold } from "./handles/HandleTextBold";
import { HandleTextItalico } from "./handles/HandleTextItalico";
import { HandleTextUnderline } from "./handles/HandleTextUnderline";
import { HandleAlignText } from "./handles/HandleAlignText";

export const EditText = ({
  object,
  canvas,
  setObject,
}: {
  object: fabric.Textbox;
  canvas: fabric.Canvas | null;
  setObject: (object: SetStateAction<fabric.Object | null>) => void;
}) => {
  const [directionCurved, setDirectionCurved] = useState({
    icon: AArrowDown,
    direction: "down",
  });
  //@ts-ignore
  const [radius, setRadius] = useState(object?.radius / 10);

  const handleDirectionCurved = () => {
    if (!object || !canvas) return;
    setDirectionCurved((prev) => {
      if (prev.direction === "down") {
        //@ts-ignore
        object.setStartAngle(180);
        //@ts-ignore
        canvas.fire("modified", { target: object });
        canvas.renderAll();
        canvas.centerObject(object);
        return {
          direction: "up",
          icon: AArrowUp,
        };
      }
      //@ts-ignore
      object.setStartAngle(-180);
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      canvas.centerObject(object);
      return {
        direction: "down",
        icon: AArrowDown,
      };
    });
  };

  const handleChangeRadius = (e: number[]) => {
    if (!object || !canvas) return;
    setRadius(e[0]);
    //@ts-ignore
    object.setRadius(e[0] * 10);
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
    canvas.centerObject(object);
  };

  const handleChangeText = (e: any) => {
    if (!object || !canvas) return;
    //@ts-ignore
    object.setText(e.target.value);
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
    canvas.centerObject(object);
  };

  return (
    <div className="flex gap-1.5 md:gap-3 flex-1 [&_label]:w-fit [&_label]:h-full h-full">
      {object.type === "textbox" && (
        <>
          <HandleCenterCanvasY object={object} canvas={canvas} />
          <HandleCenterCanvasX object={object} canvas={canvas} />
          <HandleFontFamily />
          <HandleFontSize canvas={canvas} object={object} />
          <HandleTextColor canvas={canvas} object={object} />
          <HandleTextBold canvas={canvas} object={object} />
          <HandleTextItalico canvas={canvas} object={object} />
          <HandleTextUnderline object={object} canvas={canvas} />
          <HandleAlignText object={object} canvas={canvas} />
          <HandleShadow canvas={canvas} object={object} />
        </>
      )}
      {object.type === "verticalText" && (
        <>
          <HandleCenterCanvasY object={object} canvas={canvas} />
          <HandleCenterCanvasX object={object} canvas={canvas} />
          <HandleFontFamily />
          <HandleFontSize canvas={canvas} object={object} />
          <HandleTextColor canvas={canvas} object={object} />
          <HandleTextBold canvas={canvas} object={object} />
          <HandleTextItalico canvas={canvas} object={object} />
          <HandleShadow canvas={canvas} object={object} />
        </>
      )}
      {object.type === "curvedText" && (
        <>
          <Tooltip content="Orientação da curva">
            <button
              type="button"
              onClick={handleDirectionCurved}
              className="border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
            >
              <directionCurved.icon />
            </button>
          </Tooltip>
          <DropdownMenu>
            <Tooltip content="Raio">
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
                >
                  <Radius className="w-6 h-6" />
                </button>
                {/* <ButtonIcon icon={<Blend />} /> */}
              </DropdownMenuTrigger>
            </Tooltip>
            <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
              <div className="flex justify-between w-full">
                <span className="text-xs">Raio</span>
                <p className="text-start text-xs">{radius}</p>
              </div>
              <Slider
                value={[radius]}
                max={100}
                min={1}
                step={1}
                className="w-full"
                onValueChange={handleChangeRadius}
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <Tooltip content="Texto">
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
                >
                  <Type className="w-6 h-6" />
                </button>
              </DropdownMenuTrigger>
            </Tooltip>
            <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
              <Input
                label="Texto"
                name="changeCurvedText"
                className="w-full"
                onChange={handleChangeText}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      <RemoveActiveObject canvas={canvas} setObject={setObject} />
    </div>
  );
};
