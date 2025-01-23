import * as fabric from "fabric";

export type CanvasObjectType = {
  object: fabric.Textbox | fabric.FabricImage;
  canvas: fabric.Canvas | null;
};
