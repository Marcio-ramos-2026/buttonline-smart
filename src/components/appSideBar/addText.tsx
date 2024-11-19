import { useEditorContext } from "@/context/editor";
import * as fabric from "fabric";

export function AddText() {
    const { canvas } = useEditorContext();
  
    const textBox = new fabric.Textbox("Texto", {
      width: 140,
      fontSize: 60,
      fill: "#a3c9a1",
      lockSkewingX: true,
      lockScalingFlip: true,
      splitByGrapheme: true,
    });
  
    textBox.controls.mt.visible = false;
    textBox.controls.mb.visible = false;
  
    canvas?.centerObject(textBox);
    return (
      <div className="flex gap-3 flex-col text-textForefround">
        <button
          type="button"
          onClick={() => {
            canvas?.add(textBox);
          }}
          className="border border-gray-300 rounded-lg px-2 py-1"
        >
          Texto teste
        </button>
      </div>
    );
  }