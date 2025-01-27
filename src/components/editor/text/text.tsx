import * as fabric from "fabric";

export class VerticalTextBox extends fabric.Textbox {
  //@ts-ignore
  constructor(text, options) {
    super(text, options);
  }

  // Override the render method to draw vertical text
  //@ts-ignore
  _render(ctx) {
    const lines = this.text.split("\n"); // Split the text into lines
    const lineHeight = this.fontSize * this.lineHeight; // Calculate line height
    const maxLineLength = Math.max(...lines.map((line) => line.length)); // Longest line length

    // Dynamically adjust object height based on content
    this.height = maxLineLength * this.fontSize;

    ctx.save(); // Save the canvas state
    ctx.translate(-this.width / 2, -this.height / 2); // Align the text inside the object

    ctx.font = this._getFontDeclaration();
    ctx.fillStyle = this.fill || "#000";
    ctx.textBaseline = "alphabetic";
    ctx.textAlign = "center";

    // Add vertical offset to align text closer to the top of the object
    const verticalOffset = this.fontSize / 2;

    // Iterate over each character and draw it vertically
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        const char = line[j];
        const x = i * lineHeight; // Position for line
        const y = j * this.fontSize + verticalOffset; // Adjust character position
        ctx.fillText(char, x, y);
      }
    }

    ctx.restore(); // Restore canvas state
  }
}
