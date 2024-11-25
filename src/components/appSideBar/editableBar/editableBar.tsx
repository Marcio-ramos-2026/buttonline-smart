'use client'

import { useEditorContext } from "@/context/editor";
import { useEffect, useState } from "react";
import * as fabric from "fabric";
import { EditText } from "./editText";
import { EditImage } from "./editImage";
import { EditICon } from "./editableIcon";

export const EditableBar = () => {
  const { canvas } = useEditorContext();
  //TODO arrumar para o tipo do objeto
  const [object, setObject] = useState<fabric.Textbox>(); 

  useEffect(() => {
    if (!canvas) return;
    canvas.on("selection:created", (canva) => {
      // console.log("new canvas", canva.selected);
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
    <div className="flex gap-2 flex-1 [&_label]:w-fit">
      {object?.type === "textbox" && (
        <EditText object={object} canvas={canvas} />
      )}
      {object?.type === "image" && (
        //@ts-ignore
        <EditImage object={object} canvas={canvas} />
      )}
      
      {object?.type === "path" && (
        //svg
        //@ts-ignore
        <EditICon object={object} canvas={canvas} />
      )}
    </div>
  );
};
