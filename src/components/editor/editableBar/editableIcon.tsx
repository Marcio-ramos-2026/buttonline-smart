import * as fabric from "fabric";
import { HandleStrokeColor } from "./handles/HandleStrokeColor";
import { HandleFillColor } from "./handles/HandleFillColor";
import { HandleOpacity } from "./handles/HandleOpacity";
import { HandleLayer } from "./handles/HandleLayer";

type EditIconProps = {
  object: fabric.FabricImage;
  canvas: fabric.Canvas | null;
};

export const EditICon = ({ object, canvas }: EditIconProps) => {
  return (
    <div className="flex gap-2 flex-1">
      <HandleStrokeColor object={object} canvas={canvas} />
      <HandleFillColor object={object} canvas={canvas} />
      <HandleOpacity object={object} canvas={canvas} />
      <HandleLayer object={object} canvas={canvas} />
    </div>
  );
};
