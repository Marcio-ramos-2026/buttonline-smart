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
import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { Button } from "@/components/ui/button";
import { ReactSVG } from "react-svg";
import { CopyPlus } from "lucide-react";
import CanvasHistory from "@/lib/fabricHistory";
import { PrintButton } from "@/components/editor/printButton";
import { useTranslations } from "next-intl";
import styles from "./styles.module.css";
import { EditableBar } from "@/components/editor/editableBar";
import clsx from "clsx";
import { MultipleButton } from "@/components/editor/multiple/multiple";

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
  history: (method: "redo" | "undo") => void;
  changeButtonColor: (color: string) => void;
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
  const [historyCanvas, setHistoryCanvas] = useState<any>();

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
      setcanvas(canvasInstance);
    } else {
      // canvas.setDimensions({ width: containerWidth, height: containerHeight });
      // canvas.renderAll()
      centerAllObjects(canvas);
    }
  }, [model, containerWidth, containerHeight, canvas]);

  useEffect(() => {
    if (!canvas) return;
    canvas.on("object:modified", () => {
      // saveCanvasToLocalStorage(canvas);
    });

    canvas.on("object:added", () => {
      // saveCanvasToLocalStorage(canvas);
    });
    const canvasHistory = new CanvasHistory(canvas);
    setHistoryCanvas(canvasHistory);

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
    if (!realCanvas || !canvas) return;

    if (clip) {
      canvas.clipPath = realCanvas;
    } else {
      canvas.clipPath = undefined;
    }

    canvas.renderAll();
  };

  const changeButtonColor = (color: string) => {
    if (!realCanvas || !canvas) return;

    const buttonGroup = canvas
      .getObjects()
      .filter((obj) => obj.cardenas_canvas)[0] as fabric.Group;

    buttonGroup.getObjects().forEach((obj) => {
      if (obj?.cardenas_mark) return;

      obj.set("fill", color);
    });

    canvas.renderAll();
  };

  const history = (method: "redo" | "undo") => {
    if (method === "redo") {
      historyCanvas.redo();
      return;
    }
    if (method === "undo") {
      historyCanvas.undo();
      return;
    }
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
        history,
        changeButtonColor,
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
  } = useEditorContext();

  const t = useTranslations("pages.editor");
  const [object, setObject] = useState<fabric.Object | null>(null);

  useEffect(() => {
    if (!canvas) return;
    canvas.on("selection:created", (canva) => {
      if (canva.selected.length > 1) {
        //@ts-ignore
        setObject(canva.selected);
        return;
      }
      //@ts-ignore
      setObject(canva.selected[0]);
    });

    canvas.on("selection:updated", (canva) => {
      if (canva.selected.length > 1) {
        //@ts-ignore
        setObject(canva.selected);
        return;
      }
      //@ts-ignore
      setObject(canva.selected[0]);
    });

    //@ts-ignore
    canvas.on("modified", (canva) => {
      //@ts-ignore
      setObject(canva.target);
    });

    return () => {
      canvas.off("selection:created");
      canvas.off("selection:cleared");
    };
  }, [canvas]);


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

    createModel(currentModel).then((canvasModel)=>{
      canvas.remove(...canvas.getObjects());

      const scale = canvasConfig.maxScale / canvasModel.width;
      canvasModel.scale(scale);
      // canvasModel = canvasModel.toObject()

      canvas.add(canvasModel);
      canvas.centerObject(canvasModel);
      canvas.renderAll();

      setRealCanvas(canvasModel);
    })    
  }, [canvas, currentModel]);

  if (!currentModel) {
    return (
      <div className="flex items-center flex-col w-full p-8 gap-6">
        <h1 className="text-4xl">{t("models.selectTitle")}</h1>
        <div className="grid xl:grid-cols-4 md:grid-cols-3 sm:grid-cols-1 w-full gap-6">
          {models.map((m) => {
            return <ModelsExamples model={m} key={m.id} />;
          })}
        </div>
      </div>
    );
  }

  return (
    <div ref={containerRef} className="bg-gray-100 h-full w-full relative">
      <div className={clsx(
        "absolute left-3 right-3 z-50 top-2 flex flex-col md:flex-row gap-2 md:gap-10 max-h-14 items-center",
        !!object?.type ? 'justify-between' : 'items-end md:justify-end'
      )}>
        {!!object?.type && <div className="bg-white rounded-lg drop-shadow-md px-4 py-2 w-full md:w-fit md:max-w-[50%] min-h-14 overflow-x-auto scrollBar"><EditableBar object={object} setObject={setObject} /></div>}
        <div className="bg-background inline-flex justify-center items-center gap-4 w-fit p-2 rounded-lg drop-shadow-md">
          <p>{currentModel.name}</p>
          <PrintButton
            canvas={canvas as fabric.Canvas}
            currentModel={currentModel}
          />
          <MultipleButton />
        </div>
      </div>

      <div className="absolute left-0 right-0 bottom-6 md:bottom-2 z-40 flex justify-end md:justify-center">
        <div className=" p-2 rounded-lg">
          <div className="flex flex-col md:flex-row justify-center items-start md:items-center gap-2">
            <div className="flex justify-center items-center gap-[2px] text-sm md:text-lg">
              <span className="w-5 h-[3px] bg-black inline-block"></span>{" "}
              {t("legend.line1")}
            </div>

            <div className="flex justify-center items-center gap-[2px] text-sm md:text-lg">
              <span className="w-5 border-t border-t-black border-dashed	inline-block"></span>
              {t("legend.line2")}
            </div>

            <div className="flex justify-center items-center gap-[2px] text-sm md:text-lg">
              <span className="w-5 h-[1px] bg-black inline-block"></span>
              {t("legend.line3")}
            </div>
          </div>
        </div>
      </div>

      <canvas ref={canvasEl} />
    </div>
  );
};

const ModelsExamples = ({ model }: { model: editor_canvas }) => {
  const [loadingSelectedModel, setLoadingSelectedModel] = useState(false);
  const t = useTranslations("pages.editor");

  const handleSelectModel = (model: editor_canvas) => {
    setLoadingSelectedModel(true);

    window.location.href = `?id=${model.id}`;
  };

  return (
    <div className="flex flex-col rounded-lg bg-white shadow-sm border justify-between">
      <div className="px-4 py-5 sm:px-6">
        <h5 className="text-primary text-center">{model.name}</h5>
      </div>
      <div className={styles.templateSample}>
        <ReactSVG
          className=" text-red-500"
          src={`data:image/svg+xml;base64,${btoa(generateSVG(createModel(model)))}`}
        />
      </div>

      <div className="">
        <Button
          loading={loadingSelectedModel}
          onClick={() => handleSelectModel(model)}
          full
        >
          {t("models.select")}
        </Button>
      </div>
    </div>
  );
};
