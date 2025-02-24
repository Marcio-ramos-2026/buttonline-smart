"use client";

import { Button } from "@/components/ui/button";
import { CopyPlus, Trash2, Printer } from "lucide-react";
import * as fabric from "fabric";
import { useState } from "react";
import { useEditorContext } from "@/context/editor";
import { ReactSVG } from "react-svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IncrementorInput } from "@/components/ui/inputNumber";
import DividerHorizontal from "@/components/divider";

type ButtonItem = {
  canvas: fabric.Canvas; // Se souber o tipo exato, substitua `any` pelo tipo correto
  qty: number;
  name?: string;
};

export const MultipleButton = () => {
  const { canvas, currentModel } = useEditorContext();

  const [buttons, setButtons] = useState<ButtonItem[]>([]);

  const addMultiple = async () => {
    if (!canvas) return;
    const canvasCopy = await canvas.clone([
      "cardenas_print",
      "cardenas_canvas",
    ]);

    setButtons((current) => [
      ...current,
      { canvas: canvasCopy, qty: 1, name: currentModel?.name },
    ]);
  };

  const removeMultiple = (index: number) => {
    setButtons((prevItems) => prevItems.filter((_, i) => i !== index));
  };

  const changeQty = (index: number, qty: string) => {
    setButtons((current) =>
      current.map((button, i) =>
        i === index ? { ...button, qty: Number(qty) } : button
      )
    );
  };

  return (
    <div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            icon={<CopyPlus />}
            variant={"outline"}
            className="relative"
            // onClick={addMultiple}
          >
            Multiple
            {buttons.length > 0 && (
              <div className="absolute -right-2 -top-2 h-6 w-6 bg-danger text-white font-bold rounded-full text-sm flex justify-center items-center">
                {buttons.length}
              </div>
            )}
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="h-auto w-64 px-4 py-3 rounded-md flex flex-col gap-1 items-center justify-center">
          <div className="flex justify-between w-full flex-col">
            <Button
              icon={<CopyPlus />}
              variant={"solid"}
              className="relative mb-2"
              onClick={addMultiple}
            >
              Add current Button
            </Button>

            <div className="max-h-80 overflow-y-auto ">
              {buttons.map((item, key) => {
                return (
                  <div key={key}>
                    <p className="text-xs">{item?.name}</p>
                    <div className="flex items-center justify-center">
                      <ReactSVG
                        className=" text-red-500"
                        src={`data:image/svg+xml;base64,${btoa(item.canvas.toSVG({ height: "40px", width: "40px" }))}`}
                      />
                      <div className="flex flex-col">
                        <IncrementorInput
                          min={1}
                          defaultValue={item.qty}
                          onChange={(e) =>
                            changeQty(key, e.currentTarget.value)
                          }
                        />
                      </div>

                      <Trash2
                        height={30}
                        width={30}
                        onClick={() => removeMultiple(key)}
                        color="red"
                      />
                    </div>

                    <DividerHorizontal className="my-1" />
                  </div>
                );
              })}
            </div>

            {buttons.length > 0 && (
              <Button
                icon={<Printer />}
                variant={"outline"}
                className="relative mt-2"
                onClick={addMultiple}
              >
                Print
              </Button>
            )}
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
