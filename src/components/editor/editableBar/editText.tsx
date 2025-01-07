"use client";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../ui/select";
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
} from "lucide-react";
import { useState, ChangeEvent, useEffect, SetStateAction } from "react";
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

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 200;

const fontFamilys = ["Font 1", "Font 2", "Font 3"];

export const EditText = ({
  object,
  canvas,
  setObject,
}: {
  object: fabric.Textbox;
  canvas: fabric.Canvas | null;
  setObject: (object: SetStateAction<fabric.Object | null>) => void;
}) => {
  const [color, setColor] = useState<string | fabric.TFiller | null>(null);
  const [fontFamily, setFontFamily] = useState("");
  const [textBold, setTextBold] = useState(false);
  const [textItalic, setItalic] = useState(false);
  const [textUnderline, setUnderline] = useState(false);
  const [fontSize, setFontSize] = useState<string>("");
  const [alignText, setAlignText] = useState({
    icon: AlignJustify,
    align: "center",
  });
  const [directionCurved, setDirectionCurved] = useState({
    icon: AArrowDown,
    direction: "down",
  });
  //@ts-ignore
  const [radius, setRadius] = useState(object?.radius / 10);

  console.log("AAAAAAAAAA", radius);

  const handleChangeSize = (e: ChangeEvent<HTMLInputElement>) => {
    if (!object || !canvas) return;
    if (!e.target.value) {
      setFontSize("");
      return;
    }
    if (Number(e.target.value) < MIN_FONT_SIZE) {
      setFontSize(MIN_FONT_SIZE.toString());
      object.set({ fontSize: Number(MIN_FONT_SIZE) });
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return;
    }
    if (Number(e.target.value) > MAX_FONT_SIZE) {
      setFontSize(MAX_FONT_SIZE.toString());
      object.set({ fontSize: Number(MAX_FONT_SIZE) });
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return;
    }
    setFontSize(e.target.value);
    object.set({ fontSize: Number(e.target.value) });
    //TODO evento customizado: deve ser mudado
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  const handleChangeColor = (e: string) => {
    if (!object || !canvas) return;
    setColor(e);
    object.set({ fill: e.toString() });
    //@ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  const handleTextBold = () => {
    if (!object || !canvas) return;
    setTextBold((prev) => {
      prev = !prev;
      if (prev) {
        object.set({ fontWeight: 900 });
      } else {
        object.set({ fontWeight: 400 });
      }
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return prev;
    });
  };

  const handleTextItalic = () => {
    if (!object || !canvas) return;
    setItalic((prev) => {
      prev = !prev;
      if (prev) {
        object.set({ fontStyle: "italic" });
      } else {
        object.set({ fontStyle: "normal" });
      }
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return prev;
    });
  };

  const handleTextUnderline = () => {
    if (!object || !canvas) return;
    setUnderline((prev) => {
      prev = !prev;
      if (prev) {
        object.set({ underline: prev });
      } else {
        object.set({ underline: prev });
      }
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return prev;
    });
  };

  const handleTextAlign = () => {
    if (!object || !canvas) return;
    setAlignText((prev) => {
      if (prev.align === "center") {
        object.set({ textAlign: "left" });
        //@ts-ignore
        canvas.fire("modified", { target: object });
        canvas.renderAll();
        return {
          icon: AlignLeft,
          align: "left",
        };
      }
      if (prev.align === "left") {
        object.set({ textAlign: "right" });
        //@ts-ignore
        canvas.fire("modified", { target: object });
        canvas.renderAll();
        return {
          icon: AlignRight,
          align: "right",
        };
      }
      object.set({ textAlign: "center" });
      //@ts-ignore
      canvas.fire("modified", { target: object });
      canvas.renderAll();
      return {
        icon: AlignJustify,
        align: "center",
      };
    });
  };

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

  useEffect(() => {
    if (!object || !canvas) return;

    setColor(object.fill);
    setFontSize(object.fontSize?.toString());
  }, [object, canvas]);

  return (
    <div className="flex gap-2 flex-1 [&_label]:w-fit">
      {object.type === "textbox" && (
        <>
          <Select
            onValueChange={(e: string) => {
              setFontFamily(e);
            }}
          >
            <SelectTrigger className="w-fit focus:ring-0 focus:ring-offset-0 border border-solid border-gray-300">
              <SelectValue placeholder={fontFamilys[0]} />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {fontFamilys.map((font) => {
                  return (
                    <SelectItem
                      key={font}
                      value={font.toString()}
                      checked={font === fontFamily}
                      className={cn(
                        font === fontFamily
                          ? "bg-gray-500/35 text-gray-900 font-semibold focus:bg-gray-500/35"
                          : "focus:bg-gray-300/50"
                      )}
                    >
                      {font}
                    </SelectItem>
                  );
                })}
              </SelectGroup>
            </SelectContent>
          </Select>
          <Input
            type="number"
            className="[&_input]:max-w-20 [&_input]:border-gray-300"
            value={fontSize}
            onChange={handleChangeSize}
          />
          <ColorPicker
            value={color as string}
            onChange={handleChangeColor}
            className="border-gray-300"
          />
          <Tooltip content="Negrito">
            <button
              type="button"
              onClick={handleTextBold}
              className={cn(
                "border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none",
                textBold
                  ? "bg-gray-900/20"
                  : "bg-transparent hover:bg-gray-900/20"
              )}
            >
              <Bold />
            </button>
          </Tooltip>
          <Tooltip content="Italico">
            <button
              type="button"
              onClick={handleTextItalic}
              className={cn(
                "border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none",
                textItalic
                  ? "bg-gray-900/20"
                  : "bg-transparent hover:bg-gray-900/20"
              )}
            >
              <Italic />
            </button>
          </Tooltip>
          <Tooltip content="Sublinhado">
            <button
              type="button"
              onClick={handleTextUnderline}
              className={cn(
                "border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none",
                textUnderline
                  ? "bg-gray-900/20"
                  : "bg-transparent hover:bg-gray-900/20"
              )}
            >
              <Underline />
            </button>
          </Tooltip>
          <Tooltip content="Alinhar texto">
            <button
              type="button"
              onClick={handleTextAlign}
              className={cn(
                "border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none",
                textUnderline
                  ? "bg-gray-900/20"
                  : "bg-transparent hover:bg-gray-900/20"
              )}
            >
              <alignText.icon />
            </button>
          </Tooltip>
        </>
      )}
      {object.type === "group" && (
        <>
          <Tooltip content="Orientação da curva">
            <button
              type="button"
              onClick={handleDirectionCurved}
              className="border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
            >
              <directionCurved.icon />
            </button>
          </Tooltip>
          <DropdownMenu>
            <Tooltip content="Raio">
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="border border-solid border-gray-300 rounded-lg px-2 py-1 focus:outline-none bg-transparent hover:bg-gray-900/20"
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
        </>
      )}
      <RemoveActiveObject canvas={canvas} setObject={setObject} />
    </div>
  );
};
