import { editor_canvas } from "@prisma/client";
import * as fabric from "fabric";

export type ModelType = {
  [key: string]: () => fabric.Object; // The key is a string and the value is a function returning an object
};

export const pageSizes = {
  A4: [595.44, 841.68], // A4 size in points
  Letter: [612, 792], // Letter size in points
};

type shapeRectangle = {
  type: string;
  width: number;
  height: number;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
  radius?: number;
};

type shapeEllipse = {
  type: string;
  width: number;
  height: number;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
};

type shapeCircle = {
  type: string;
  radius: number;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
};

type Shapes = shapeCircle | shapeEllipse;

type ShapeCollection = Record<string, Shapes>;
type gabarito = {
  pdf: keyof typeof pageSizes;
  positions: Record<string, { x: number; y: number }>;
};

type mark = {
  position?: string;
  height?: number;
  width?: number;
};

export type ModelConfig = {
  mark?: mark;
  objects: ShapeCollection;
  gabarito: gabarito;
};

export const createModel = (model: editor_canvas): fabric.Object => {
  const objConfig = model?.config as ModelConfig;

  const createMark = (element: fabric.FabricObject) => {
    const markWidth = objConfig?.mark?.width ?? 10;
    const markHeight = objConfig?.mark?.height ?? 10;

    const positions = {
      top: {
        top:
          element.top -
          element.height / 2 +
          markHeight / 2 +
          element.strokeWidth / 2,
      },
      left: {
        left:
          element.left -
          element.width / 2 +
          markWidth / 2 +
          element.strokeWidth / 2,
      },
      bottom: {
        top:
          element.top +
          element.height / 2 -
          markHeight / 2 -
          element.strokeWidth / 2,
      },
      right: {
        left:
          element.left +
          element.width / 2 -
          markWidth / 2 -
          element.strokeWidth / 2,
      },
    };

    const position = objConfig?.mark?.position ?? "left";

    const mark = new fabric.Rect({
      width: markWidth,
      height: markHeight,
      fill: "red",
      stroke: "red",
      strokeWidth: 0,
      selectable: false,
      moveCursor: "default",
      originX: "center",
      originY: "center",
      hoverCursor: "default",
      ...positions[position as keyof typeof positions],
    });

    return mark;
  };

  ////////////////////////////////////////////////////////

  const elements = Object.values(objConfig?.objects)
    .map((obj, k) => {
      switch (obj.type) {
        case "ellipse":
          const typeEllipse = obj as shapeEllipse;

          const fabricObjectEllipse = ellipse(typeEllipse);
          return fabricObjectEllipse;
          break;
        case "circle":
          const typeCircle = obj as shapeCircle;

          const fabricObjectCircle = circle(typeCircle);
          return fabricObjectCircle;
          break;
        case "rectangle":
          const typeRectangle = obj as shapeRectangle;

          const fabricObjectRectangle = rectangle(typeRectangle);
          return fabricObjectRectangle;
          break;
      }
    })
    .filter((el): el is NonNullable<typeof el> => el !== null);

  elements.push(createMark(elements[0]));

  return new fabric.Group(elements, {
    selectable: false,
    moveCursor: "default",
    hoverCursor: "default",
    cardenas_canvas: "true",
  });
};

const ellipse = (config: shapeEllipse): fabric.FabricObject => {
  return new fabric.Ellipse({
    rx: config.width,
    ry: config.height,
    fill: "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 1,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
  });
};

const circle = (config: shapeCircle) => {
  return new fabric.Circle({
    radius: fabric.util.parseUnit(`${config.radius}mm`),
    fill: "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 1,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    cardenas_canvas: "true",
  });
};

const rectangle = (config: shapeRectangle) => {
  return new fabric.Rect({
    width: config.width,
    height: config.height,
    fill: "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 1,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    rx: config?.radius ?? 0,
    ry: config?.radius ?? 0,
  });
};

export const generateSVG = (element: fabric.FabricObject) => {
  const viewBox = `${-element.width / 2} ${-element.height / 2} ${element.width} ${element.height}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="${viewBox}">${element.toSVG()}</svg>`;
};
