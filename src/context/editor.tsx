"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  RefObject,
  useMemo,
} from "react";
import * as fabric from "fabric";

import { useResizeObserver } from "@/hooks/useResizeObserver";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import type { editor_canvas } from "@prisma/client";
import { createModel, ModelType } from "@/components/editor/model";
import { LoadingIcon } from "@/components/loading";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";

const { theme } = resolveConfig(tailwindConfig);

type IEditorProvider = {
  children: React.ReactNode;
  model?: editor_canvas;
};

type IEditorContext = {
  canvas: fabric.Canvas | null;
  canvasEl: RefObject<HTMLCanvasElement>;
  containerRef: RefObject<HTMLDivElement>;
  clip: () => void;
  editable?: string;
};

const FabricContext = createContext<IEditorContext | null>(null);

const getClip = (canvas: fabric.Canvas, model?: editor_canvas) => {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  let radius = (canvas.height * 0.6) / 2;
  if (radius >= 800) radius = 800;

  const first = new fabric.Circle({
    radius: radius,
    fill: "white",
    stroke: "#000",
    strokeWidth: 4,

    selectable: false,
    moveCursor: "default",
    top: centerY,
    left: centerX,
    originX: "center",
    originY: "center",
    hoverCursor: "default",
  });
  if (!first) return;

  const second = new fabric.Circle({
    radius: radius - 20,
    fill: "transparent",
    stroke: "#000",
    strokeWidth: 4,
    strokeDashArray: [10, 10],

    selectable: false,
    moveCursor: "default",
    top: centerY,
    left: centerX,
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    excludeFromExport: true,
  });
  if (!second) return;

  const third = new fabric.Circle({
    radius: radius - 40,
    fill: "transparent",
    stroke: "#000",
    strokeWidth: 1,

    selectable: false,
    moveCursor: "default",
    top: centerY,
    left: centerX,
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    excludeFromExport: true,
  });
  if (!third) return;

  return new fabric.Group([first, second, third], {
    selectable: false,
    moveCursor: "default",
    hoverCursor: "default",
  });
};
type Size = {
  width?: number;
  height?: number;
};

export default function FabricContextProvider({
  children,
  model,
}: IEditorProvider) {
  const [canvas, setcanvas] = useState<fabric.Canvas | null>(null);
  const [{ width: containerWidth, height: containerHeight }, setSize] =
    useState<Size>({
      width: undefined,
      height: undefined,
    });

  const containerRef = useRef<HTMLDivElement>(null);
  const canvasEl = useRef<HTMLCanvasElement>(null);

  const onResize = useDebounceCallback(setSize, 160);
  useResizeObserver({
    ref: containerRef,
    onResize,
  });

  //console.log('containerWidth',containerWidth)

  useEffect(() => {
    if (!model || !containerHeight || !containerWidth) return;

    if (!canvas) {
      // Create a new fabric.Canvas with proper width/height adjustments)
      const canvasInstance = new fabric.Canvas(
        canvasEl.current as HTMLCanvasElement,
        {
          backgroundColor: theme.colors.gray[100],
          width: containerWidth,
          height: containerHeight,
        }
      );
      // Make the fabric.Canvas instance available to your app if needed
      fabric
        .loadSVGFromString(
          '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><path fill="#FF156D" stroke="#FF156D" stroke-width="15" transform-origin="center" d="m148 84.7 13.8-8-10-17.3-13.8 8a50 50 0 0 0-27.4-15.9v-16h-20v16A50 50 0 0 0 63 67.4l-13.8-8-10 17.3 13.8 8a50 50 0 0 0 0 31.7l-13.8 8 10 17.3 13.8-8a50 50 0 0 0 27.5 15.9v16h20v-16a50 50 0 0 0 27.4-15.9l13.8 8 10-17.3-13.8-8a50 50 0 0 0 0-31.7Zm-47.5 50.8a35 35 0 1 1 0-70 35 35 0 0 1 0 70Z"><animateTransform type="rotate" attributeName="transform" calcMode="spline" dur="2" values="0;120" keyTimes="0;1" keySplines="0 0 1 1" repeatCount="indefinite"></animateTransform></path></svg>'
        )
        .then(({ objects, options }) => {
          let svgObject;
          if (Array.isArray(objects)) {
            //@ts-ignore
            svgObject = fabric.util.groupSVGElements(objects, options);
          } else {
            svgObject = objects;
          }

          canvasInstance.add(svgObject);
          canvasInstance.centerObject(svgObject);
          canvasInstance.renderAll();
        });
      setcanvas(canvasInstance);
    } else {
      //console.log('containerWidth else',containerWidth,containerHeight)
      canvas.setDimensions({ width: containerWidth, height: containerHeight });
      //canvas.renderAll()
      centerAllObjects(canvas);
    }
  }, [model, containerWidth, containerHeight, canvas]);

  useEffect(() => {
    return () => {
      if (canvas) canvas.dispose();
    };
  }, [canvas]);

  function centerAllObjects(canvas: fabric.Canvas) {
    const canvasCenterX = canvas.width! / 2;
    const canvasCenterY = canvas.height! / 2;

    // Loop through all objects
    canvas.getObjects().forEach((obj) => {
      if (!obj) return;

      // Calculate object's center position
      const objectCenter = obj.getCenterPoint();

      // Adjust object's position to be centered
      obj.left = canvasCenterX - (objectCenter.x - obj.left!);
      obj.top = canvasCenterY - (objectCenter.y - obj.top!);

      // Update object position
      obj.setCoords();
    });

    // Re-render the canvas
    canvas.renderAll();
  }

  const clip = () => {
    // Your clip logic
  };

  return (
    <FabricContext.Provider
      value={{ canvas: canvas, canvasEl: canvasEl, containerRef, clip: clip }}
    >
      {children}
    </FabricContext.Provider>
  );
}

export const useEditorContext = () => {
  const values = useContext(FabricContext);

  if (!values) throw new Error("batatatatatat");

  return values;
};

export type RenderCanvasType = {
  model: editor_canvas;
};

export const RenderCanvas = ({ model }: RenderCanvasType) => {
  const { canvasEl, containerRef, canvas } = useEditorContext();

  useEffect(() => {
    if (!canvas) return;
    if (!model) return;

    
    const canvasModel = createModel(canvas, model);
    if (canvasModel) {
      canvas.remove(...canvas.getObjects());
      canvas.add(canvasModel);
      canvas.centerObject(canvasModel)
      canvas.renderAll();
    }
  }, [canvas, model]);

  return (
    <div ref={containerRef} className="bg-gray-100 h-full w-full">
      <canvas ref={canvasEl} />
    </div>
  );
};
