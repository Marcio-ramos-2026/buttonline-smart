import * as fabric from "fabric";

const object = new fabric.Object();

export class VerticalText extends fabric.Textbox {
  constructor(text: string, options: fabric.TOptions<fabric.TextboxProps>) {
    super(text, options);
  }

  _render(ctx: CanvasRenderingContext2D) {
    // this.text = this.text.split('').join('/n')
    console.log("SVGGGGGGGG", this.text);
    // this._renderChar('fillText', ctx, 1);
  }
}

export const Text = () => {
  return <></>;
};
