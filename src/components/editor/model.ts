import { editor_canvas } from "@prisma/client";
import * as fabric from "fabric";

export type ModelType = {
  [key: string]: () => fabric.Object; // The key is a string and the value is a function returning an object
};

export const pageSizes = {
  A4: [595, 842], // A4 size in points
  A5: [595, 842], // A4 size in points
  Letter: [612, 792], // Letter size in points
};

type Shape = {
  background: string;
  cardenas_print: boolean;
};

type shapeCustom =  {
  type: string;
  width: number;
  height: number;
  svg: string;  
  top: number;
  left: number;
} & Shape

type shapeRectangle = {
  type: string;
  width: number;
  height: number;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
  radius?: number;
} & Shape;

type shapeEllipse = {
  type: string;
  width: number;
  height: number;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
} & Shape;

type shapeCircle = {
  type: string;
  radius: number;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
} & Shape;

type Shapes = shapeCircle | shapeEllipse;

type ShapeCollection = Record<string, Shapes>;
type gabarito = {
  orientation?: 'vertical' | 'horizontal'
  pdf: keyof typeof pageSizes;
  positions: Record<string, { x: number; y: number, rotate?:number }>;
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

export const createModel = async (model: editor_canvas): Promise<fabric.Object> => {
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
      fill: "black",
      stroke: "black",
      strokeWidth: 0,
      selectable: false,
      moveCursor: "default",
      originX: "center",
      originY: "center",
      hoverCursor: "default",
      cardenas_print: true,
      cardenas_mark: true,
      ...positions[position as keyof typeof positions],
    });

    return mark;
  };

  ////////////////////////////////////////////////////////

  const elements: fabric.FabricObject[] = await Promise.all(
    Object.values(objConfig?.objects).map(async (obj, k) => {
      switch (obj.type) {
        case "ellipse":
          const typeEllipse = obj as shapeEllipse;
          return ellipse(typeEllipse);
        case "circle":
          const typeCircle = obj as shapeCircle;
          return circle(typeCircle);
        case "rectangle":
          const typeRectangle = obj as shapeRectangle;
          return rectangle(typeRectangle);
        case 'custom':
          const typeCustom = obj as shapeCustom;
          const x = await svgShape(typeCustom);
          x.set({left:0})
          console.log('x',x)
          return x
      }
    })
  ).then(results => results.filter((el): el is fabric.FabricObject => el !== null));
    
  if (elements.length > 0) {
    elements.push(createMark(elements[0])); 
  }

  return new fabric.Group(elements, {
    selectable: false,
    moveCursor: "default",
    hoverCursor: "default",
    cardenas_canvas: "true",
  });
};

const ellipse = (config: shapeEllipse): fabric.FabricObject => {
  return new fabric.Ellipse({
    rx: fabric.util.parseUnit(`${config.width}mm`),
    ry: fabric.util.parseUnit(`${config.height}mm`),
    fill: "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 1,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    cardenas_print:
      config.cardenas_print === undefined ? true : config.cardenas_print,
  });
};

const circle = (config: shapeCircle) => {
  return new fabric.Circle({
    radius: fabric.util.parseUnit(`${config.radius/2}mm`),
    fill: config.background ?? "#fff",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 1,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    cardenas_print: config.cardenas_print === undefined ? true: config.cardenas_print
  });
}

const rectangle = (config: shapeRectangle) => {
  return new fabric.Rect({
    width: fabric.util.parseUnit(`${config.width}mm`),
    height: fabric.util.parseUnit(`${config.height}mm`),
    fill: "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 0.3,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    rx: config?.radius ?? 0,
    ry: config?.radius ?? 0,
    cardenas_print:
      config.cardenas_print === undefined ? true : config.cardenas_print, 
  });
};

export const svgShape = async (config: shapeCustom): Promise<fabric.FabricObject> => {
  const svgText = config.svg.replace(/\\+/g, '');
  const loaded = await fabric.loadSVGFromString(svgText);

  if (!loaded || !loaded.objects?.length) {
    return new fabric.Group([]);
  }

  const objects = loaded.objects.filter(Boolean) as fabric.Object[];
  const group = new fabric.Group(objects);

  // Convert mm to px for accurate scaling
  const targetWidthPx = fabric.util.parseUnit(`${config.width}mm`);
  const targetHeightPx = fabric.util.parseUnit(`${config.height}mm`);

  const scaleX = targetWidthPx / group.width!;
  const scaleY = targetHeightPx / group.height!;
  const scale = Math.min(scaleX, scaleY); // use both if you want to stretch

  group.set({
    scaleX: scale,
    scaleY: scale,
    fill:'transparent',
    originX: 'center',
    originY: 'center',
    top: config?.top ?? 0,
    left: config?.left ?? 0,
    stroke: "none",
    strokeWidth: 0,
    cardenas_print:
      config.cardenas_print === undefined ? true : config.cardenas_print, 
  });

  return group as fabric.FabricObject;
};


export const generateSVG = (element: fabric.FabricObject) => {
  const viewBox = `${-element.width / 2} ${-element.height / 2} ${element.width} ${element.height}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="${viewBox}">${element.toSVG()}</svg>`;
};

const cleanSVGViewBox = (svgText: string): string => {
  // Create a temporary DOM element to parse the SVG
  const parser = new DOMParser();
  const svgDoc = parser.parseFromString(svgText, "image/svg+xml");
  const svgElement = svgDoc.documentElement;

  // Find all elements inside the SVG (use only relevant elements like paths, groups, etc.)
  const elements = svgElement.querySelectorAll<SVGGraphicsElement>('*');

  // Get the bounding box for all elements inside the SVG
  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  // Loop through each element to calculate the bounding box
  elements.forEach((el) => {
    // Ensure the element is of type that supports getBBox()
    if (el instanceof SVGGraphicsElement) {
      const bbox = el.getBBox();
      minX = Math.min(minX, bbox.x);
      minY = Math.min(minY, bbox.y);
      maxX = Math.max(maxX, bbox.x + bbox.width);
      maxY = Math.max(maxY, bbox.y + bbox.height);
    }
  });

  // If we didn't find any elements (invalid SVG), return the original SVG text
  if (minX === Infinity || minY === Infinity || maxX === -Infinity || maxY === -Infinity) {
    return svgText;
  }

  // Adjust the viewBox to fit the bounding box
  const width = maxX - minX;
  const height = maxY - minY;
  const viewBox = `${minX} ${minY} ${width} ${height}`;

  // Update the SVG's viewBox attribute to the new bounds
  svgElement.setAttribute('viewBox', viewBox);

  // Serialize the cleaned SVG back to a string
  const serializer = new XMLSerializer();
  const cleanedSVG = serializer.serializeToString(svgDoc);

  return cleanedSVG;
};
