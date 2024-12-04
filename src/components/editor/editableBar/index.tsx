"use client";

import { useEditorContext } from "@/context/editor";
import { useEffect, useState } from "react";
import * as fabric from "fabric";
import { EditText } from "./editText";
import { EditImage } from "./editImage";
import { RemoveActiveObject } from "./removeActiveObject";
import { EditICon } from "./editableIcon";
import { EditShapes } from "./editableShapes";

const shapesType = ["triangle", "circle", "rect", "polygon"];

export const EditableBar = () => {
  const { canvas } = useEditorContext();
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

  if (!object?.type) return;

  return (
    <div className="flex items-center justify-between w-full">
      {object?.type === "textbox" || object?.type === "group" && (
        <>
          <EditText object={object as fabric.Textbox} canvas={canvas} />
          <RemoveActiveObject canvas={canvas} setObject={setObject} />
        </>
      )}
      {object?.type === "image" && (
        <>
          <EditImage object={object as fabric.FabricImage} canvas={canvas} />
          <RemoveActiveObject canvas={canvas} setObject={setObject} />
        </>
      )}

      {object?.type === "path" && (
        //svg
        <>
          <EditICon object={object as fabric.FabricImage} canvas={canvas} />
          <RemoveActiveObject canvas={canvas} setObject={setObject} />
        </>
      )}

      {shapesType.includes(object?.type) && (
        //shapes
        <>
          <EditShapes object={object as fabric.FabricImage} canvas={canvas} />
          <RemoveActiveObject canvas={canvas} setObject={setObject} />
        </>
      )}
    </div>
  );
};
