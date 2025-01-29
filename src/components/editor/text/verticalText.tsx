import * as fabric from "fabric";

export class VerticalTextBox extends fabric.Textbox {
  //@ts-ignore
  constructor(text, options) {
    super(text, options);
    const lines = this.text.split("\n"); // Split the text into lines
    const lineHeight = this.fontSize * this.lineHeight; // Calculate line height
    const maxLineLength = Math.max(...lines.map((line) => line.length)); // Longest line length
    this.height = maxLineLength * this.fontSize;
    this.width = lines.length * lineHeight;
    //@ts-ignore
    this.isEditingMode = false; // Track editing mode
  }

  get type(): string {
    return "verticalText";
  }

  enterEditing() {
    super.enterEditing(); // Call parent method
    //@ts-ignore
    this.isEditingMode = true;

    // Switch to horizontal text for editing
    this._switchToHorizontal();
  }

  //@ts-ignore
  exitEditing() {
    super.exitEditing(); // Call parent method
    //@ts-ignore
    this.isEditingMode = false;

    // Switch back to vertical text
    this._switchToVertical(this.text);
  }

  _switchToHorizontal() {
    //@ts-ignore
    this._originalText = this.text; // Save current text
    this.text = this.text.replace(/\n/g, ""); // Remove newlines for horizontal layout
    //@ts-ignore
    this.width = this._originalWidth || this.width; // Optionally adjust width
    this.height = this.fontSize; // Set height to match single-line text
    this.dirty = true; // Mark object for re-render
  }

  _switchToVertical(text: string) {
    this.text = text; // Restore original text with newlines
    //@ts-ignore
    this._originalWidth = this.width; // Save current width for later
    const lines = this.text.split("\n"); // Calculate height for vertical layout
    const lineHeight = this.fontSize * this.lineHeight; // Calculate line height
    const maxLineLength = Math.max(...lines.map((line) => line.length));
    this.height = maxLineLength * this.fontSize;
    this.width = lines.length * lineHeight;
    this.dirty = true; // Mark object for re-render
  }

  //@ts-ignore
  _render(ctx) {
    //@ts-ignore
    if (this.isEditingMode) {
      // Use default horizontal rendering in editing mode
      super._render(ctx);
    } else {
      const lines = this.text.split("\n"); // Split the text into lines
      const lineHeight = this.fontSize * this.lineHeight; // Calculate line height
      const maxLineLength = Math.max(...lines.map((line) => line.length)); // Longest line length

      // Dynamically adjust object dimensions
      this.height = maxLineLength * this.fontSize;
      this.width = lines.length * lineHeight;

      ctx.save(); // Save the canvas state
      ctx.translate(-this.width / 2, -this.height / 2); // Align the text inside the object

      ctx.font = this._getFontDeclaration();
      ctx.fillStyle = this.fill || "#000";
      ctx.textBaseline = "alphabetic";
      ctx.textAlign = "center";

      const verticalOffset = this.fontSize / 1;

      // Iterate over each character and draw it vertically
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        const x = i * lineHeight + lineHeight / 2; // Center each column
        for (let j = 0; j < line.length; j++) {
          const char = line[j];
          const y = j * this.fontSize + verticalOffset; // Adjust character position
          ctx.fillText(char, x, y);
        }
      }

      ctx.restore(); // Restore canvas state
    }
  }

  setFontStyle(style: string) {
    this.set({ fontStyle: style }); // Update font style
    this._switchToVertical(this.text); // Reapply vertical layout
    this.canvas?.requestRenderAll(); // Force re-render
  }

  setTextBold(fontWeight: number) {
    this.set({ fontWeight: fontWeight }); // Update font style
    this._switchToVertical(this.text); // Reapply vertical layout
    this.canvas?.requestRenderAll(); // Force re-render
  }
}
