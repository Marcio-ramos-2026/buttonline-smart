"use client";

import { useEditorContext } from "@/context/editor";
import { SetStateAction} from "react";
import * as fabric from "fabric";
import { EditText } from "./editText";
import { EditImage } from "./editImage";
import { EditICon } from "./editableIcon";
import { EditShapes } from "./editableShapes";

const shapesType = ["triangle", "circle", "rect", "polygon"];

export const EditableBar = ({ object, setObject }: { object: fabric.Object, setObject: (object: SetStateAction<fabric.Object | null>) => void; }) => {
  const { canvas } = useEditorContext();

  if (!object?.type) return;

  return (
    <div className="flex items-center w-fit h-full">
      {(object.type === "textbox" || object.type === "curvedText" || object.type === "verticalText" || object.type === 'text') && (
        <>
          <EditText
            object={object as fabric.Textbox}
            canvas={canvas}
            setObject={setObject}
          />
        </>
      )}
      {object.type === "image" && (
        <>
          <EditImage
            object={object as fabric.FabricImage}
            canvas={canvas}
            setObject={setObject}
          />
        </>
      )}

      {object.type === "path" && (
        //svg
        <>
          <EditICon
            object={object as fabric.FabricImage}
            canvas={canvas}
            setObject={setObject}
          />
        </>
      )}

      {shapesType.includes(object.type) && (
        //shapes
        <>
          <EditShapes
            object={object as fabric.FabricImage}
            canvas={canvas}
            setObject={setObject}
          />
        </>
      )}
    </div>
  );
};
