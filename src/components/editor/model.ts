import { editor_canvas } from "@prisma/client";
import * as fabric from "fabric";

export type ModelType = {
  [key: string]: () => fabric.Object; // The key is a string and the value is a function returning an object
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

type ModelConfig = {
  objects: ShapeCollection;
};

type canvasConfig = {
  centerX: number;
  centerY: number;
  maxScale: number;
  higherWidth: number;
};

export const createModel = (
  canvas: fabric.Canvas,
  model: editor_canvas
): fabric.Object => {
  const maxSize = 800; // limite máximo do editor
  const canvasWidth = canvas.width || 0;
  const canvasHeight = canvas.height || 0;

  const canvasConfig = {
    centerX: canvas.width / 2,
    centerY: canvas.height / 2,
    maxScale: Math.min(canvasWidth, canvasHeight, maxSize) * 0.5,
    higherWidth: 0,
  };

  const createMark = (element: fabric.FabricObject) => {
    const markWidth = 10;
    const mark = new fabric.Rect({
      width: markWidth,
      height: 25,
      fill: "black",
      stroke: "#000",
      strokeWidth: 1,
      selectable: false,
      moveCursor: "default",
      top: canvasConfig.centerY,
      left:
        element.left -
        element.width / 2 +
        markWidth / 2 +
        element.strokeWidth / 2,
      originX: "center",
      originY: "center",
      hoverCursor: "default",
    });

    return mark;
  };

  const objConfig = model?.config as ModelConfig;

  const elements = Object.values(objConfig?.objects)
    .map((obj, k) => {
      switch (obj.type) {
        case "ellipse":
          const typeEllipse = obj as shapeEllipse;
          if (k === 0) {
            canvasConfig.higherWidth = typeEllipse.width;
          }
          const fabricObjectEllipse = ellipse(typeEllipse, canvasConfig);
          return fabricObjectEllipse;
          break;
        case "circle":
          const typeCircle = obj as shapeCircle;
          if (k === 0) {
            canvasConfig.higherWidth = typeCircle.radius;
          }
          const fabricObjectCircle = circle(typeCircle, canvasConfig);
          return fabricObjectCircle;
          break;
        case "rectangle":
          const typeRectangle = obj as shapeRectangle;
          if (k === 0) {
            canvasConfig.higherWidth = typeRectangle.width;
          }
          const fabricObjectRectangle = rectangle(typeRectangle, canvasConfig);
          return fabricObjectRectangle;
          break;
      }
    })
    .filter((el): el is NonNullable<typeof el> => el !== null);

  console.log("el", elements);
  elements.push(createMark(elements[0]));

  return new fabric.Group(elements, {
    selectable: false,
    moveCursor: "default",
    hoverCursor: "default",
  });
};

const ellipse = (
  config: shapeEllipse,
  props: canvasConfig
): fabric.FabricObject => {
  const scaleFactor = props.maxScale / props.higherWidth;

  return new fabric.Ellipse({
    rx: config.width * scaleFactor,
    ry: config.height * scaleFactor,
    fill: "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 4,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    top: props.centerY,
    left: props.centerX,
  });
};

const circle = (config: shapeCircle, props: canvasConfig) => {
  const scaleFactor = props.maxScale / props.higherWidth;
  return new fabric.Circle({
    radius: config.radius * scaleFactor,
    fill: "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 4,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    top: props.centerY,
    left: props.centerX,
  });
};

const rectangle = (config: shapeRectangle, props: canvasConfig) => {
  const scaleFactor = props.maxScale / props.higherWidth;

  return new fabric.Rect({
    width: config.width * scaleFactor,
    height: config.height * scaleFactor,
    fill: "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 4,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    rx: config?.radius ?? 0,
    ry: config?.radius ?? 0,
    top: props.centerY,
    left: props.centerX,
  });
};
