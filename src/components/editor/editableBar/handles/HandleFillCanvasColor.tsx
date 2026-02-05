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
import { CanvasObjectType } from "./type";

export const HandleFillCanvasColor = ({ object, canvas }: CanvasObjectType) => {
  const [colorFill, setColorFill] = useState<string>("#000000");

  /**
   * APLICA FILL NO CANVAS
   * → único lugar que escreve no fabric
   */
  const applyFill = (color: string) => {
    if (!object || !canvas) return;

    if (object.type === "group") {
      const group = object as fabric.Group;

      group.getObjects().forEach(child => {

        if (child.type === "path") {
          (child as fabric.Path).set({
            fill: color,
            fillRule: "nonzero", // essencial para path fechado
          });
        }
      });

      group.dirty = true;
    } else if ("fill" in object) {
      object.set({ fill: color });
    }

    // evento padrão do seu editor
    // @ts-ignore
    canvas.fire("modified", { target: object });
    canvas.renderAll();
  };

  /**
   * CHANGE HANDLER
   */
  const handleChangeFill = (color: string) => {
    setColorFill(color);
    applyFill(color);
  };

  /**
   * LEITURA DO ESTADO ATUAL
   * → NÃO escreve no canvas
   */
  useEffect(() => {
    if (!object) return;

    if (object.type === "group") {
      const group = object as fabric.Group;

      const firstPathWithFill = group
        .getObjects()
        .find(
          o => o.type === "path" && (o as fabric.Path).fill
        ) as fabric.Path | undefined;

      setColorFill(
        (firstPathWithFill?.fill as string) ?? "#000000"
      );
    } else {
      setColorFill((object as any)?.fill?.toString() ?? "#000000");
    }
  }, [object]);

  return (
    <DropdownMenu>
      <Tooltip content="Cor de preenchimento">
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            className="border border-gray-300 rounded-lg px-2 py-1 hover:bg-gray-900/20"
          >
            <PaintBucket className="w-6 h-6" />
          </button>
        </DropdownMenuTrigger>
      </Tooltip>

      <DropdownMenuContent className="w-64 px-4 py-3 flex flex-col gap-2">
        <ColorPicker
          value={colorFill}
          onChange={handleChangeFill}
          className="border-gray-300"
        />
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
