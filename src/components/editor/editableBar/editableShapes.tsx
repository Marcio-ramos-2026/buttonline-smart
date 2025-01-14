import * as fabric from "fabric";
import { HandleOpacity } from "./handles/HandleOpacity";
import { HandleStrokeColor } from "./handles/HandleStrokeColor";
import { HandleFillColor } from "./handles/HandleFillColor";
import { HandleLayer } from "./handles/HandleLayer";
import { SetStateAction } from "react";
import { RemoveActiveObject } from "./removeActiveObject";

type EditShapedProps = {
  object: fabric.FabricImage;
  canvas: fabric.Canvas | null;
  setObject: (object: SetStateAction<fabric.Object | null>) => void;
};

export const EditShapes = ({ object, canvas, setObject }: EditShapedProps) => {
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
