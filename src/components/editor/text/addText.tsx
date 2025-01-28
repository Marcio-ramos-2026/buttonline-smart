import { useEditorContext } from "@/context/editor";
import * as fabric from "fabric";
import { VerticalTextBox } from "./verticalText";
import { CurvedText } from "./curvedText";

export function AddText() {
  const { canvas } = useEditorContext();

  const handleAddText = () => {
    if (!canvas) return;

    const textBox = new fabric.Textbox("Texto", {
      fontSize: 60,
      fill: "#a3c9a1",
    });

    textBox.controls.mt.visible = false;
    textBox.controls.mb.visible = false;

    canvas.add(textBox);
    canvas.centerObject(textBox);
  };

  const handleAddVerticalText = () => {
    if (!canvas) return;
    
    const verticalText = new VerticalTextBox("Texto", {
      fontSize: 40,
      fill: "black"
    });

    verticalText.controls.ml.visible = false;
    verticalText.controls.mr.visible = false;

    canvas.add(verticalText);
    canvas.centerObject(verticalText);
  };

  //TODO arrumar o angulo (variable radians)
  //TODO inverter para cima e para baixo
  const handleAddCurvedText = () => {
    if (!canvas) return;

    // Usage Example
    const curvedText = new CurvedText("Texto curvo", {
      left: 200,
      top: 200,
      radius: 100,
      startAngle: -180,
      endAngle: 1,
    });
    canvas.add(curvedText);
    canvas.centerObject(curvedText);
  };

  return (
    <div className="flex gap-3 flex-col text-textForefround">
      <button
        type="button"
        onClick={handleAddText}
        className="border border-gray-300 rounded-lg px-2 py-1"
      >
        Inisira um texto
      </button>
      <button
        type="button"
        onClick={handleAddCurvedText}
        className="border border-gray-300 rounded-lg px-2 py-1"
      >
        Inisira um Texto curvo
      </button>
      <button
        type="button"
        onClick={handleAddVerticalText}
        className="border border-gray-300 rounded-lg px-2 py-1"
      >
        Inisira um Texto vertical
      </button>
    </div>
  );
}
