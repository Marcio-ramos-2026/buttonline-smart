import { editor_canvas } from "@prisma/client";
import * as fabric from "fabric";

export type ModelType = {
  [key: string]: () => fabric.Object; // The key is a string and the value is a function returning an object
};

type ModelConfig = {
  objects: ShapeCollection;
};

type ShapeEllipse = {
  type: string;
  width: number;
  height: number;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
};
type ShapeCircle = { type: string; radius: number };

type Shapes = ShapeCircle | ShapeEllipse;

type ShapeCollection = Record<string, Shapes>;

export const getModels = (
  canvas: fabric.Canvas,
  model: editor_canvas
): ModelType | null => {
  const maxSize = 800; // limite máximo do editor
  const canvasWidth = canvas.width || 0;
  const canvasHeight = canvas.height || 0;
  const maxRadius = Math.min(canvasWidth, canvasHeight, maxSize) * 0.5; //determina o max radius entre o limite máximo do editor e o tamanho da tela

  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

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
      top: centerY,
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

  const elements = (Object.values(objConfig.objects) as Shapes[]).map((obj) => {
    switch (obj.type) {
      case "ShapeEllipse":
        break;
    }
  });

  return null;

  // return new fabric.Group(elements, {
  //   selectable: false,
  //   moveCursor: "default",
  //   hoverCursor: "default",
  // });

  // return {
  //   circle: () => {
  //     const elements = [createCircle(Number(model.object_1))];
  //     elements.push(
  //       createCircle(Number(model.object_2), { strokeDashArray: [5, 5] })
  //     );
  //     elements.push(createCircle(Number(model.object_3), { strokeWidth: 1 }));
  //   },

  //   square: () => {
  //     const elements = [createSquare(Number(model.object_1))];
  //     elements.push(
  //       createSquare(Number(model.object_2), { strokeDashArray: [5, 5] })
  //     );
  //     elements.push(createSquare(Number(model.object_3), { strokeWidth: 1 }));
  //     elements.push(createMark(elements[0]));

  //     return new fabric.Group(elements, {
  //       selectable: false,
  //       moveCursor: "default",
  //       hoverCursor: "default",
  //     });
  //   },

  //   rectangle: () => {
  //     const elements = [createRectangle(model?.config?.object_1)];
  //     elements.push(
  //       createRectangle(model?.config?.object_2, {
  //         strokeDashArray: [5, 5],
  //       })
  //     );
  //     elements.push(
  //       createRectangle(model?.config?.object_3, { strokeWidth: 1 })
  //     );
  //     elements.push(createMark(elements[0]));

  //     return new fabric.Group(elements, {
  //       selectable: false,
  //       moveCursor: "default",
  //       hoverCursor: "default",
  //     });
  //   },

  //   ellipse: () => {
  //     const elements = [createEllipse(model?.config?.object_1)];
  //     elements.push(
  //       createEllipse(model?.config?.object_2, {
  //         strokeDashArray: [5, 5],
  //       })
  //     );
  //     elements.push(createEllipse(model?.config?.object_3, { strokeWidth: 1 }));
  //     elements.push(createMark(elements[0]));

  //     return new fabric.Group(elements, {
  //       selectable: false,
  //       moveCursor: "default",
  //       hoverCursor: "default",
  //     });
  //   },
  // };
};

// const ellipse = (
//   width: number,
//   height: number,
//   options: Partial<fabric.Rect> = {}
// ) => {
//   const scaleFactor = maxRadius / model?.config?.object_1.width;

//   return new fabric.Ellipse({
//     rx: size.width * scaleFactor,
//     ry: size.height * scaleFactor,
//     fill: "white",
//     stroke: "#000",
//     strokeWidth: 4,
//     selectable: false,
//     moveCursor: "default",
//     top: centerY,
//     left: centerX,
//     originX: "center",
//     originY: "center",
//     hoverCursor: "default",
//     ...options,
//   });
// };

// const circle = (radius: number, options: Partial<fabric.Circle> = {}) => {
//   const scaleFactor = maxRadius / Number(model.object_1);
//   return new fabric.Circle({
//     radius: radius * scaleFactor,
//     fill: "white",
//     stroke: "#000",
//     strokeWidth: 4,
//     selectable: false,
//     moveCursor: "default",
//     top: centerY,
//     left: centerX,
//     originX: "center",
//     originY: "center",
//     hoverCursor: "default",
//     ...options,
//   });
// };

// const square = (size: number, options: Partial<fabric.Rect> = {}) => {
//   const scaleFactor = maxRadius / Number(model.object_1);
//   return new fabric.Rect({
//     width: size * scaleFactor,
//     height: size * scaleFactor,
//     fill: "white",
//     stroke: "#000",
//     strokeWidth: 4,
//     selectable: false,
//     moveCursor: "default",
//     top: centerY,
//     left: centerX,
//     originX: "center",
//     originY: "center",
//     hoverCursor: "default",
//     rx: 45,
//     ry: 45,
//     ...options,
//   });
// };

// const rectangle = (
//   size: { width: number; height: number },
//   options: Partial<fabric.Rect> = {}
// ) => {
//   const scaleFactor = maxRadius / model.config.object_1.width;

//   return new fabric.Rect({
//     width: size.width * scaleFactor,
//     height: size.height * scaleFactor,
//     fill: "white",
//     stroke: "#000",
//     strokeWidth: 4,
//     selectable: false,
//     moveCursor: "default",
//     top: centerY,
//     left: centerX,
//     originX: "center",
//     originY: "center",
//     hoverCursor: "default",
//     rx: 5,
//     ry: 5,
//     ...options,
//   });
// };
