"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  RefObject,
} from "react";
import * as fabric from "fabric";

import { useResizeObserver } from "@/hooks/useResizeObserver";

import resolveConfig from "tailwindcss/resolveConfig";
import tailwindConfig from "../../tailwind.config";
import type { editor_canvas } from "@prisma/client";
import { createModel, generateSVG, ModelType } from "@/components/editor/model";
import { LoadingIcon } from "@/components/loading";
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { Button } from "@/components/ui/button";
import { ReactSVG } from "react-svg";
import { height, width } from "pdfkit/js/page";

const { theme } = resolveConfig(tailwindConfig);

function saveCanvasToLocalStorage(canvas: fabric.Canvas) {
  const canvasJSON = canvas.toObject(["selectable","moveCursor","hoverCursor"]);
  localStorage.setItem(`cardenas_obj`, JSON.stringify(canvasJSON));
  console.log('Canvas saved!');
}

type canvasConfig = {
  centerX: number;
  centerY: number;
  maxScale: number;
  higherWidth: number;
};

type IEditorProvider = {
  children: React.ReactNode;
  model?: editor_canvas;
  allowed_models: editor_canvas[];
};

type IEditorContext = {
  canvas: fabric.Canvas | null;
  canvasEl: RefObject<HTMLCanvasElement>;
  containerRef: RefObject<HTMLDivElement>;
  clip: () => void;
  editable?: string;
  currentModel?: editor_canvas;
  models: editor_canvas[];
  setRealCanvas: React.Dispatch<fabric.FabricObject>
  realCanvas: fabric.FabricObject
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
  allowed_models,
}: IEditorProvider) {
  const [canvas, setcanvas] = useState<fabric.Canvas | null>(null);
  const [currentModel, setCurrentModel] = useState(model);
  const [models, setModels] = useState(allowed_models);
  const [realCanvas, setRealCanvas] = useState<fabric.FabricObject|null>(null)

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
      canvas.setDimensions({ width: containerWidth, height: containerHeight });
      // canvas.renderAll()
      centerAllObjects(canvas);
    }

  }, [model, containerWidth, containerHeight, canvas]);

  useEffect(() => {
    canvas?.on('object:modified', () => {
      saveCanvasToLocalStorage(canvas);
    });
    
    canvas?.on('object:added', () => {
      saveCanvasToLocalStorage(canvas);
    });

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
      value={{
        canvas: canvas,
        canvasEl: canvasEl,
        containerRef,
        clip: clip,
        currentModel: currentModel,
        models,
        setRealCanvas,
        realCanvas: realCanvas as fabric.FabricObject,
      }}
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

export const RenderCanvas = () => {
  const { canvasEl, containerRef, canvas, currentModel, models,setRealCanvas } =
    useEditorContext();

  useEffect(() => {
    if (!canvas) return;
    if (!currentModel) return;


    const maxSize = 800; // limite máximo do editor
    const canvasWidth = canvas.width || 0;
    const canvasHeight = canvas.height || 0;

    const canvasConfig = {
      centerX: canvas.width / 2,
      centerY: canvas.height / 2,
      maxScale: Math.min(canvasWidth, canvasHeight, maxSize) * 0.7,
      higherWidth: 0,
    };

    const canvasJSON = localStorage.getItem('cardenas_obj');
    if (canvasJSON) {
      canvas.loadFromJSON(JSON.parse(canvasJSON)).then(canvas => {
        canvas.getObjects().forEach((obj) => {
          if (obj.selectable !== true) {
            obj.set({ selectable: false });
          }
        });
        canvas.renderAll()
      });
      return
    }

    const canvasModel = createModel(currentModel);
    if (canvasModel) {
      canvas.remove(...canvas.getObjects());

      const scale = canvasConfig.maxScale / canvasModel.width;
      canvasModel.scale(scale);

      canvas.add(canvasModel);
      canvas.centerObject(canvasModel);
      canvas.renderAll();
      setRealCanvas(canvasModel)
    }
  }, [canvas, currentModel]);

  if (!currentModel) {
    return (
      <div className="flex items-center flex-col w-full p-8 gap-6">
        <h1 className="text-4xl">selecione um modelo</h1>
        <div className="grid grid-cols-4 w-full gap-6">
          {models.map((m) => {
            return (
              <div className="overflow-hidden rounded-lg bg-white shadow-sm border">
                <div className="px-4 py-5 sm:px-6">
                  <h5 className="text-primary text-center">{m.name}</h5>
                </div>
                <div className="px-4 py-5 sm:p-6">
                  <ReactSVG
                    src={`data:image/svg+xml;base64,${btoa(generateSVG(createModel(m)))}`}
                  />
                </div>
                <div className="p-4">
                  <Button full>eu quero esse</Button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-gray-100 h-full w-full relative">
      <Button className="absolute r-10 t-10 z-50" onClick={async ()=> {
        const dpi = getScreenDPI()

        const x = canvas?.getObjects().map(obj => {
          return obj.toSVG()
        })


        const svg = canvas?.toSVG({
          //@ts-ignore
          width: fabric.util.parseUnit(`${currentModel.config.objects["1"].radius}mm`),
          //@ts-ignore
          height: fabric.util.parseUnit(`${currentModel.config.objects["1"].radius}mm`),
          // objects: canvas.getObjects().map(obj => {
          //   return obj.toSVG()
          // }),
          // viewBox: {
          //   //@ts-ignore
          //   height:fabric.util.parseUnit(`${currentModel.config.objects["1"].radius}mm`),
          //   //@ts-ignore
          //   width:fabric.util.parseUnit(`${currentModel.config.objects["1"].radius}mm`),
          //   x:0,
          //   y:0
          // }
        })
        fetch("/api/print", {
          method: "POST",
          body: JSON.stringify({ svg: svg,model_id: currentModel.id,dpi}), // Send any necessary data for PDF generation
          headers: {
            "Content-Type": "application/json",
          },
        })
        .then((response) => response.blob())  // Get the response as a Blob (binary data)
        .then((blob) => {
          // Create a URL for the Blob
          const url = window.URL.createObjectURL(blob);
          
          // Open the PDF in a new tab
          window.open(url, "_blank");
        })
        .catch((error) => {
          console.error("Error fetching the PDF:", error);
        });

      }}>imprimir</Button>
      <canvas ref={canvasEl} />
    </div>
  );
};


function getScreenDPI() {
  const div = document.createElement('div');
  div.style.width = '1in'; // 1 inch in CSS units
  div.style.height = '1in';
  div.style.position = 'absolute';
  div.style.visibility = 'hidden';
  document.body.appendChild(div);

  const dpi = div.offsetWidth; // The number of pixels in 1 inch
  document.body.removeChild(div);

  return dpi;
}

function pixelsToMillimeters(pixels: number) {
  const dpi = getScreenDPI(); // Get the user's screen DPI
  const mm = (pixels / dpi) * 25.4; // Convert to millimeters
  return mm.toString();
}