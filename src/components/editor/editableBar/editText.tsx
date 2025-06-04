"use client";

import {
  SpaceIcon,  
  AArrowDown,
  AArrowUp,
  Radius,
  Type,
  ArrowDownFromLine,
} from "lucide-react";
import { useState, SetStateAction, useEffect } from "react";
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
import { createPathFromCircleInGroup, createPathFromEllipseInGroup, createPathFromRectInGroup } from "../text/addText";

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

  const [radius, setRadius] = useState(object?.angle);
  const [letterSpace, setLetterSpace] = useState(object?.charSpacing);
  const [curvedText, setCurvedText] =  useState(object.text);
  const [curvedDistance, setCurvedDistance] = useState(0)

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
    object.set("angle",e[0])
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
    canvas.centerObject(object);
  };

  const HandleLetterSpacing = (e: number[]) => {
    if (!object || !canvas) return;
    setLetterSpace(e[0]);
    object.set("charSpacing",e[0])
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
    canvas.centerObject(object);
  };

  const handleChangeText = (e: any) => {
    if (!object || !canvas) return;
    
    object.set("text",e.target.value)
    setCurvedText(e.target.value)

    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.requestRenderAll();
    canvas.centerObject(object);
  };

  const handleCurvedDistance = (e: number[]) => {
    if (!object || !canvas) return;
    setCurvedDistance(e[0])

    let newPath;
    
    //@ts-ignore
    if(object.cardenas_type === 'rectangle') {
      newPath = createPathFromRectInGroup(canvas,e[0])
      //@ts-ignore
    }else if(object.cardenas_type === 'ellipse') {
      newPath = createPathFromEllipseInGroup(canvas,e[0])
    }else{
      newPath = createPathFromCircleInGroup(canvas,e[0])
    }

    object.set('path',newPath)
    // //  canvas.fire("modified", { target: object });
    canvas.requestRenderAll();
    canvas.centerObject(object);
  }

useEffect(() => {
  if (!object) return;

  const handleModified = () => {
    setRadius( ((object.angle + 180) % 360 + 360) % 360 - 180)
  };

  object.on('rotating', handleModified);
  object.on('modified', handleModified);

  return () => {
    object.off('rotating', handleModified);
    object.off('modified', handleModified);
  };
}, [object]);

  return (
    <div className="flex gap-1.5 md:gap-3 flex-1 [&_label]:w-fit [&_label]:h-full h-full">
      {["textbox"].includes(object.type) && (
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
      {object.type === "text" && (
        <>
        <HandleFontSize canvas={canvas} object={object} />
        <HandleTextColor canvas={canvas} object={object} />
        <DropdownMenu>
            <Tooltip content="Distância">
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
                >
                  <ArrowDownFromLine className="w-6 h-6" />
                </button>
              </DropdownMenuTrigger>
            </Tooltip>
            <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
              <div className="flex justify-between w-full">
                <span className="text-xs">Distância</span>
                <p className="text-start text-xs">{curvedDistance}</p>
              </div>
              <Slider
                value={[curvedDistance]}
                max={100}
                min={0}
                step={1}
                className="w-full"
                onValueChange={handleCurvedDistance}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        <DropdownMenu>
            <Tooltip content="Espaçamento">
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="border border-solid border-gray-300 rounded-lg px-2 py-0.5 md:py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
                >
                  <SpaceIcon className="w-6 h-6" />
                </button>
                {/* <ButtonIcon icon={<Blend />} /> */}
              </DropdownMenuTrigger>
            </Tooltip>
            <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
              <div className="flex justify-between w-full">
                <span className="text-xs">Espaçamento</span>
                <p className="text-start text-xs">{letterSpace}</p>
              </div>
              <Slider
                value={[letterSpace]}
                max={2000}
                min={-500}
                step={10}
                className="w-full"
                onValueChange={HandleLetterSpacing}
              />
            </DropdownMenuContent>
          </DropdownMenu>
          <DropdownMenu>
            <Tooltip content="Posição">
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
                <span className="text-xs">Posição</span>
                <p className="text-start text-xs">{radius.toFixed(2)}</p>
              </div>
              <Slider
                value={[radius]}
                max={180}
                min={-180}
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
                value={curvedText}
              />
            </DropdownMenuContent>
          </DropdownMenu>
        </>
      )}
      <RemoveActiveObject canvas={canvas} setObject={setObject} />
    </div>
  );
};
