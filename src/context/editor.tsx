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
// import { height, width } from "pdfkit/js/page";
import { Printer } from "lucide-react";

const { theme } = resolveConfig(tailwindConfig);

function saveCanvasToLocalStorage(canvas: fabric.Canvas) {
  const canvasJSON = canvas.toObject([
    "selectable",
    "moveCursor",
    "hoverCursor",
  ]);
  localStorage.setItem(`cardenas_obj`, JSON.stringify(canvasJSON));
  console.log("Canvas saved!");
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
  clipMask: (clip: boolean) => void;
  editable?: string;
  currentModel?: editor_canvas;
  models: editor_canvas[];
  setRealCanvas: React.Dispatch<fabric.FabricObject>;
  realCanvas: fabric.FabricObject;
};

const FabricContext = createContext<IEditorContext | null>(null);

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
  const [realCanvas, setRealCanvas] = useState<fabric.FabricObject | null>(
    null
  );

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
      canvas.renderAll()
      centerAllObjects(canvas);
    }
  }, [model, containerWidth, containerHeight, canvas]);

  useEffect(() => {
    canvas?.on('object:modified', () => {
      // saveCanvasToLocalStorage(canvas);
    });
    
    canvas?.on('object:added', () => {
      // saveCanvasToLocalStorage(canvas);
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

  const clipMask = (clip: boolean) => {
    if(!realCanvas || !canvas) return

    if(clip) {
      canvas.clipPath = realCanvas
    }else{
      canvas.clipPath = undefined
    }
    
    canvas.renderAll();

  };

  return (
    <FabricContext.Provider
      value={{
        canvas: canvas,
        canvasEl: canvasEl,
        containerRef,
        clipMask: clipMask,
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
  const {
    canvasEl,
    containerRef,
    canvas,
    currentModel,
    models,
    setRealCanvas,
    clipMask,
    realCanvas
  } = useEditorContext();

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

    // const canvasJSON = localStorage.getItem("cardenas_obj");
    // if (canvasJSON) {
    //   canvas.loadFromJSON(JSON.parse(canvasJSON)).then((canvas) => {
    //     canvas.getObjects().forEach((obj) => {
    //       if (obj.selectable !== true) {
    //         obj.set({ selectable: false });
    //       }
    //     });
    //     canvas.renderAll();
    //   });
    //   return;
    // }

    let canvasModel = createModel(currentModel) as fabric.Group;
    if (canvasModel) {
      canvas.remove(...canvas.getObjects());

      const scale = canvasConfig.maxScale / canvasModel.width;
      canvasModel.scale(scale);
      const c= canvasModel.getObjects()
      // c.forEach((m,k) => {
      //   canvas.add(m);
      //   canvas.centerObject(m);
      //   // canvas.bringObjectToFront(m)

      //   if(k == 2) {
      //     // canvas.bringObjectToFront(m)
      //   }
      // })

      canvas.add(canvasModel);
      canvas.centerObject(canvasModel);
      canvas.renderAll();
      setRealCanvas(canvasModel);
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
      <div className="absolute left-0 right-0 z-50  top-2  flex justify-center">
        <div className="bg-background inline-flex justify-center items-center gap-4 mx-auto  p-2 rounded-lg drop-shadow-md">
          <p>{currentModel.name}</p>

          <Button
            size={"default"}
            onClick={async () => {
              if(!canvas) return
          const dpi = getScreenDPI()

        let allObjects = canvas.getObjects();
        allObjects = allObjects.map((obj) => {
          if (obj.type === 'image') {
            const image = obj as fabric.FabricImage
            const imageElement = image.getElement() as HTMLImageElement

            const url = new URL(imageElement.src);
            const pathname = url.pathname; // Get the file path
            const extension = pathname.split('.').pop()?.toLowerCase(); // Extract the file extension (before query params)

            // Check for file format based on the extension
            const isJpeg = extension === 'jpg' || extension === 'jpeg';
              // Convert the image to Base64
              const base64 = image.toDataURL({
                format: isJpeg ? 'jpeg' : 'png', // Use 'jpeg' if needed
                quality: 1,    // High quality for JPEG
              });
      
            
            // Replace the image source with the Base64 data
            imageElement.src = base64;

            image.set({
              element: imageElement
            })
            return image
          }

          return obj
        });

        // Fixed canvas size
        const canvasWidth = fabric.util.parseUnit('65mm'); // Canvas width in px
        const canvasHeight = fabric.util.parseUnit('65mm'); // Canvas height in px
      
        const allObjectsGroup = new fabric.Group(allObjects, { left: canvasWidth / 2, top: canvasHeight / 2 });
        
        // Calculate the bounding dimensions of the group
        const boundingRect = allObjectsGroup.getBoundingRect();
        const groupWidth = boundingRect.width;
        const groupHeight = boundingRect.height;
        
        
        // Calculate the scale factor to fit content within canvas
        console.log('CANVAS',canvasWidth,canvasHeight)
        console.log('GROUP',groupWidth,groupHeight)
        const scaleFactor = Math.min(canvasWidth / groupWidth, canvasHeight / groupHeight);
        
        // Scale the group proportionally
        allObjectsGroup.scale(scaleFactor);
        allObjectsGroup.setCoords(); // Update coordinates after scaling

        
        const copyRealCanvas = await realCanvas.clone()
        // copyRealCanvas.scale(scaleFactor)
        
        
        // Create a new canvas with the fixed size
        const printCanvas = new fabric.Canvas('c', {
          width: canvasWidth,
          // height: canvasHeight
        });
        

        printCanvas.add(allObjectsGroup)
        printCanvas.centerObject(allObjectsGroup)      

        printCanvas.clipPath = copyRealCanvas

        const svg = printCanvas.toSVG({
          viewBox: {
            x: 0,
            y: 0,
            width: canvasWidth,
            height: canvasHeight,
          },
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
            }}
            icon={<Printer />}
          ></Button>
        </div>
        <Button onClick={()=> clipMask(true)}>CLIP</Button>
        <Button onClick={()=> clipMask(false)}>unclip</Button>
      </div>

      <div className="absolute left-0 right-0 bottom-2 z-50    flex justify-center">
        <div className=" p-2 rounded-lg ">
          <div className="flex justify-center items-center gap-2">
            <div className="flex justify-center items-center gap-[2px]">
              <span className="w-5 h-[3px] bg-black inline-block"></span> Limite
              de corte
            </div>

            <div className="flex justify-center items-center gap-[2px]">
              <span className="w-5 border-t border-t-black border-dashed	inline-block"></span>
              Posição da marca
            </div>

            <div className="flex justify-center items-center gap-[2px]">
              <span className="w-5 h-[1px] bg-black inline-block"></span> Frente
              do button
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasEl} />
    </div>
  );
};

function getScreenDPI() {
  const div = document.createElement("div");
  div.style.width = "1in"; // 1 inch in CSS units
  div.style.height = "1in";
  div.style.position = "absolute";
  div.style.visibility = "hidden";
  document.body.appendChild(div);

  const dpi = div.offsetWidth; // The number of pixels in 1 inch
  document.body.removeChild(div);

  return dpi;
}