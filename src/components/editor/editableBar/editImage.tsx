import * as fabric from "fabric";
import { SetStateAction } from "react";
import { RemoveActiveObject } from "./removeActiveObject";
import { HandleOpacity } from "./handles/HandleOpacity";

export const EditImage = ({
  object,
  canvas,
  setObject,
}: {
  object: fabric.FabricImage;
  canvas: fabric.Canvas | null;
  setObject: (object: SetStateAction<fabric.Object | null>) => void;
}) => {

  return (
    <div className="flex gap-1.5 md:gap-3 flex-1 [&_label]:w-fit h-full">
      <HandleOpacity canvas={canvas} object={object} />
      <RemoveActiveObject canvas={canvas} setObject={setObject} />
    </div>
  );
};
