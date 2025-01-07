import { useEditorContext } from "@/context/editor";
import * as fabric from "fabric";

export function AddText() {
  const { canvas } = useEditorContext();

  const handleAddText = () => {
    if (!canvas) return;

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

    canvas.add(textBox);
    canvas.centerObject(textBox);
  };

  //TODO arrumar o angulo (variable radians)
  //TODO inverter para cima e para baixo
  const handleAddCurvedText = () => {
    if (!canvas) return;

    class CurvedText extends fabric.Group {
      text: string = "";
      radius: number = 100;
      startAngle: number = 180;
      endAngle: number = 1;

      constructor(text: string, options: fabric.TOptions<fabric.TextboxProps>) {
        super([], options); // Initialize as a Fabric group
        this.text = text;
        this.radius = options?.radius; // Radius of the arc
        this.startAngle = options?.startAngle || this.startAngle; // Starting angle in degrees
        this.endAngle = options?.endAngle || this.endAngle; // Ending angle in degrees
        this.updateCurvedText(); // Create the curved text
      }

      updateCurvedText() {
        // Clear existing objects
        this._objects = [];

        const chars = this.text.split("");
        const totalAngle = this.endAngle - this.startAngle;
        const angleStep = totalAngle / (chars.length - 1);

        chars.forEach((char: string, i: number) => {
          const angle = this.startAngle + i * angleStep;
          const radians = (angle * Math.PI) / 180; // Convert to radians

          const x = this.radius * Math.cos(radians);
          const y = this.radius * Math.sin(radians);

          const charObj = new fabric.Textbox(char, {
            left: x,
            top: y,
            originX: "center",
            originY: "center",
            angle: totalAngle > 0 ? angle + 90 : angle - 90,
          });

          this.add(charObj);
        });
        this.setCoords(); // Update group coordinates
      }

      setStartAngle(newStartAngle: number) {
        this.startAngle = newStartAngle;
        this.updateCurvedText();
      }

      setRadius(newRadius: number) {
        this.radius = newRadius;
        this.updateCurvedText();
      }

      toObject<
        T extends Omit<
          fabric.GroupProps & fabric.TClassProperties<this>,
          keyof fabric.SerializedGroupProps
        >,
        K extends keyof T = never,
      >(
        propertiesToInclude: K[] = []
      ): Pick<T, K> & fabric.SerializedGroupProps {
        return {
          ...super.toObject(propertiesToInclude),
          text: this.text,
          radius: this.radius,
          startAngle: this.startAngle,
          endAngle: this.endAngle,
        };
      }
    }

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
    </div>
  );
}
