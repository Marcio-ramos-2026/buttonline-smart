import * as fabric from "fabric";
import { HandleStrokeColor } from "./handles/HandleStrokeColor";
import { HandleFillColor } from "./handles/HandleFillColor";
import { HandleOpacity } from "./handles/HandleOpacity";
import { HandleLayer } from "./handles/HandleLayer";
import { SetStateAction } from "react";
import { RemoveActiveObject } from "./removeActiveObject";

type EditIconProps = {
  object: fabric.FabricImage;
  canvas: fabric.Canvas | null;
  setObject: (object: SetStateAction<fabric.Object | null>) => void;
};

export const EditICon = ({ object, canvas, setObject }: EditIconProps) => {
  return (
    <div className="flex gap-1.5 md:gap-3 flex-1 h-full">
      <HandleStrokeColor object={object} canvas={canvas} />
      <HandleFillColor object={object} canvas={canvas} />
      <HandleOpacity object={object} canvas={canvas} />
      <HandleLayer object={object} canvas={canvas} />
      <RemoveActiveObject canvas={canvas} setObject={setObject} />
    </div>
  );
};
