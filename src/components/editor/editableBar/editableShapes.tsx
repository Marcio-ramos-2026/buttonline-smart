import * as fabric from "fabric";
import { HandleOpacity } from "./handles/HandleOpacity";
import { HandleStrokeColor } from "./handles/HandleStrokeColor";
import { HandleFillColor } from "./handles/HandleFillColor";
import { HandleLayer } from "./handles/HandleLayer";

type EditShapedProps = {
  object: fabric.FabricImage;
  canvas: fabric.Canvas | null;
};

export const EditShapes = ({ object, canvas }: EditShapedProps) => {
  return (
    <div className="flex gap-2 flex-1">
      <HandleStrokeColor object={object} canvas={canvas} />
      <HandleFillColor object={object} canvas={canvas} />
      <HandleOpacity object={object} canvas={canvas} />
      <HandleLayer object={object} canvas={canvas} />
    </div>
  );
};
