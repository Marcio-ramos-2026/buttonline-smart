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
} from "lucide-react";
import { useState, ChangeEvent, useEffect } from "react";
import * as fabric from "fabric";
import { Tooltip } from "@/components/tooltip/tooltip";
import { Input } from "@/components/ui/input";

const MIN_FONT_SIZE = 1;
const MAX_FONT_SIZE = 200;

const fontFamilys = ["Font 1", "Font 2", "Font 3"];

export const EditText = ({
  object,
  canvas,
}: {
  object: fabric.Textbox;
  canvas: fabric.Canvas | null;
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

  useEffect(() => {
    if (!object || !canvas) return;

    setColor(object.fill);
    setFontSize(object.fontSize?.toString());
  }, [object, canvas]);

  return (
      <div className="flex gap-2 flex-1 [&_label]:w-fit">
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
      </div>
  );
};
