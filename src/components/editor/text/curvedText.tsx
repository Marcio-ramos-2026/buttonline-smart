import * as fabric from "fabric";

export class CurvedText extends fabric.Group {
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

    setText(newText: string) {
      this.text = newText;
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