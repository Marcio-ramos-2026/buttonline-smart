"use client";

import { Button } from "@/components/ui/button";
import { CopyPlus, Trash2, Printer } from "lucide-react";
import * as fabric from "fabric";
import { useEffect, useState } from "react";
import { useEditorContext } from "@/context/editor";
import { ReactSVG } from "react-svg";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IncrementorInput } from "@/components/ui/inputNumber";
import DividerHorizontal from "@/components/divider";

export type ButtonItemMultiple = {
  canvas: fabric.Canvas; // Se souber o tipo exato, substitua `any` pelo tipo correto
  qty: number;
  name?: string;
  size: [string, string];
  svg: string;
};

export const MultipleButton = () => {
  const { canvas, currentModel } = useEditorContext();

  const [buttons, setButtons] = useState<ButtonItemMultiple[]>([]);

  const [printing, setPrinting] = useState(false);

  useEffect(() => {
    const storedButtons = localStorage.getItem("cardenas_multiple_buttons");
    if (storedButtons) {
      const parsedButtons = JSON.parse(storedButtons);

      loadButtons(parsedButtons);
    }
  }, []);

  useEffect(() => {
    if (buttons?.length) {
      saveButtonsToLocalStorage(buttons);
    } else {
      localStorage.removeItem("cardenas_multiple_buttons");
    }
  }, [buttons]);

  const saveButtonsToLocalStorage = (buttons: ButtonItemMultiple[]) => {
    const serializedButtons = buttons.map((btn) => ({
      ...btn,
      canvas: btn.canvas.toJSON(), // Convert canvas to JSON
    }));
    localStorage.setItem(
      "cardenas_multiple_buttons",
      JSON.stringify(serializedButtons)
    );
  };

  const loadButtons = async (storedButtons: any[]) => {
    const loadedButtons: ButtonItemMultiple[] = await Promise.all(storedButtons.map(async (btn) => {
      const canvasElement = document.createElement("canvas"); // Create an actual canvas element
      const newCanvas = new fabric.Canvas(canvasElement); // Attach it to fabric.Canvas

      await newCanvas.loadFromJSON(btn.canvas, () => {
        newCanvas.renderAll();
      });

      return {
        ...btn,
        canvas: newCanvas,
      };
    }))
    setButtons(loadedButtons);
  };

  const addMultiple = async () => {
    if (!canvas) return;
    const canvasCopy = await canvas.clone([
      "cardenas_print",
      "cardenas_canvas",
    ]);

    let sizes = currentModel?.size?.split(",") as [string, ...string[]];
    if (!sizes[1]) sizes[1] = sizes[0];

    const canvasWidth = fabric.util.parseUnit(`${sizes[0]}mm`);
    const canvasHeight = fabric.util.parseUnit(`${sizes[1]}mm`);


    canvasCopy.getObjects().forEach((obj) => {
    
          
        if (obj.type === "image") {
          const image = obj as fabric.FabricImage;
          const imageElement = image.getElement() as HTMLImageElement;

          const url = new URL(imageElement.src);
          const pathname = url.pathname; // Get the file path
          const extension = pathname.split(".").pop()?.toLowerCase(); // Extract the file extension (before query params)

            // Check for file format based on the extension
          const isJpeg = extension === "jpg" || extension === "jpeg";
          // Convert the image to Base64
          const base64 = image.toDataURL({
            format: isJpeg ? "jpeg" : "png", // Use 'jpeg' if needed
            quality: 1, // High quality for JPEG
          });

          imageElement.src = base64;

          image.set({
            element: imageElement,
          });

          obj = image
        }
      // Check if the object has the 'cardenas_canvas' property and is a group
      if (!obj.cardenas_canvas) return;
    
      const canvas = obj as fabric.Group 
      // Use forEachObject to iterate through the objects inside the group

      canvas.getObjects().forEach((groupObj) => {
        if(groupObj.cardenas_print) return

        canvas.remove(groupObj)
      });
    });

    const clip = new fabric.Group(canvasCopy.getObjects(), {});
    const scaleFactor = canvasWidth / Math.max(clip.width, clip.height);
    clip.scale(scaleFactor);

    const printCanvas = new fabric.Canvas("c", {
      width: canvasWidth,
      height: canvasHeight,
    });

    printCanvas.add(clip);
    printCanvas.centerObject(clip);
    printCanvas.clipPath = clip;

    setButtons((current) => [
      ...current,
      {
        canvas: printCanvas,
        qty: 1,
        name: currentModel?.name,
        size: [sizes[0], sizes[1]],
        svg: printCanvas.toSVG({ }),
      },
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
          <Button icon={<CopyPlus />} variant={"outline"} className="relative">
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

            <div className="max-h-80 overflow-y-auto">
              {buttons.map((item, key) => (
                <div key={key}>
                  <p className="text-xs">{item?.name}</p>
                  <div className="flex items-center justify-center">
                    <ReactSVG
                      className="svgMultipleDropdown"
                      src={`data:image/svg+xml;base64,${btoa(item.svg)}`}
                    />
                    <div className="flex flex-col">
                      <IncrementorInput
                        min={1}
                        defaultValue={item.qty}
                        onChange={(e) => changeQty(key, e.currentTarget.value)}
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
              ))}
            </div>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
};
