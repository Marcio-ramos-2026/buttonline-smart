import * as fabric from "fabric";

export class ArchedTextBox extends fabric.Textbox {
  radius: number;
  startAngle: number;
  endAngle: number;
  characterObjects: { char: string; x: number; y: number; angle: number }[] =
    [];

  constructor(text: string, options: fabric.TOptions<fabric.TextboxProps>) {
    super(text, options);
    this.radius = options.radius || 100;
    this.startAngle = options.startAngle || 180;
    this.endAngle = options.endAngle || 1;

    this._updateCurvedText();

    // Ensure live updates while typing
    this.on("changed", () => this._updateCurvedText());

    // Show normal text while editing
    this.on("editing:entered", () => {
      this._clearManualRendering();
    });

    // Apply curved text again after editing
    this.on("editing:exited", () => {
      this._updateCurvedText(); // Use the latest text after editing
    });
  }

  get type(): string {
    return "curvedText";
  }

  _updateCurvedText() {
    if (this.isEditing) return; // Don't update curved text while editing

    const chars = this.text.split("");
    const totalAngle = this.endAngle - this.startAngle;
    const angleStep = totalAngle / Math.max(chars.length - 1, 1);

    this.characterObjects = chars.map((char, i) => {
      const angle = this.startAngle + i * angleStep;
      const radians = (angle * Math.PI) / 180; // Convert degrees to radians

      // const x = this.radius * Math.cos(radians) + this.left - this.width / 2 - 10;
      // const y = this.radius * Math.sin(radians) + this.top - this.height / 2.5;

      const x = this.radius * Math.cos(radians) + this.width / 2;
      const y = this.radius * Math.sin(radians) + this.height / 2.5;

      return {
        char,
        x: x,
        y: y,
        originX: "center",
        originY: "center",
        angle: totalAngle > 0 ? angle + 90 : angle - 90,
      };
    });

    this._updateBoundingBox();
    this.setCoords();
    this.canvas?.requestRenderAll();
  }

  _updateBoundingBox() {
    const minX = Math.min(...this.characterObjects.map((char) => char.x));
    const maxX = Math.max(...this.characterObjects.map((char) => char.x));
    const minY = Math.min(...this.characterObjects.map((char) => char.y));
    const maxY = Math.max(...this.characterObjects.map((char) => char.y));

    this.width = (maxX - minX) * 1.5;
    this.height = (maxY - minY) * 1.5;
  }

  _clearManualRendering() {
    this.characterObjects = [];
    this.dirty = true;
    this.canvas?.requestRenderAll();
  }

  _render(ctx: CanvasRenderingContext2D) {
    if (this.isEditing) {
      super._render(ctx); // Use normal textbox rendering while editing
      return;
    }

    ctx.save();
    ctx.translate(-this.width / 2, -this.height / 2);

    ctx.font = this._getFontDeclaration();
    ctx.fillStyle = this.fill?.toString() || "#000";
    ctx.textBaseline = "middle";
    ctx.textAlign = "center";

    this.characterObjects.forEach(({ char, x, y, angle }) => {
      ctx.save();
      ctx.translate(x + this.width / 2.5, y + this.height / 1.5);
      ctx.rotate((angle * Math.PI) / 180);
      ctx.fillText(char, 0, 0);
      ctx.restore();
    });

    ctx.restore();
  }

  setText(newText: string) {
    this.text = newText;
    this._updateCurvedText();
  }

  setRadius(newRadius: number) {
    this.radius = newRadius;
    this._updateCurvedText();
  }

  setStartAngle(newStartAngle: number) {
    this.startAngle = newStartAngle;
    this._updateCurvedText();
  }
}
