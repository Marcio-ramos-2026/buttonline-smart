import { useEditorContext } from "@/context/editor";
import * as fabric from "fabric";
import { VerticalTextBox } from "./verticalText";
import { CurvedText } from "./curvedText";

const originalToSVG = fabric.FabricText.prototype.toSVG;

fabric.FabricText.prototype.toSVG = function (reviver) {
  //@ts-ignore
  if (!this.path) {
    // No path, fallback to original toSVG or default
    if (typeof originalToSVG === 'function') {
      return originalToSVG.call(this, reviver);
    }
    return this._createBaseSVGMarkup(this._toSVG(), {
      reviver,
      noStyle: true,
      withShadow: true,
    });
  }

  // Custom curved text SVG
  //@ts-ignore
  var fontFamily = this.fontFamily.replace(/"/g, "'");
  //@ts-ignore
  var fontSize = this.fontSize;
  //@ts-ignore
  var fontStyle = this.fontStyle;
  //@ts-ignore
  var fontWeight = this.fontWeight;
  var fill = this.fill;

  //@ts-ignore
  var pathData = this.path.path;
  var d = pathData.flat().join(' ');
  var id = Math.random().toString(36).substr(2, 9);

  var dominantbaseline = 'auto';
  var dy = 0;
  //@ts-ignore
  if (this.pathAlign === 'center') {
    dominantbaseline = 'middle';
    //@ts-ignore
  } else if (this.pathAlign === 'baseline') {
    dominantbaseline = 'auto';
    //@ts-ignore
  } else if (this.pathAlign === 'ascender') {
    dominantbaseline = 'hanging';
    //@ts-ignore
  } else if (this.pathAlign === 'descender') {
    dominantbaseline = 'auto';
    dy = (fontSize / 100) * -22;
  }

  var textAnchor = 'start';
  //@ts-ignore
  var pathStartOffset = this.pathStartOffset || 0;
//@ts-ignore
  if (this.textAlign === 'center') {
    textAnchor = 'middle';
    //@ts-ignore
  } else if (this.textAlign === 'right') {
    textAnchor = 'end';
  }

  var textPathEl = '<defs>\n' +
    '  <path id="textOnPath' + id + '" d="' + d + '" />\n' +
    '</defs>';

    //@ts-ignore
  var letterSpacingEm = (this.charSpacing || 0) / 1000;

var textEl = '<text ' +
  'font-family="' + fontFamily + '" ' +
  'fill="' + fill + '" ' +
  'font-size="' + fontSize + '" ' +
  'font-style="' + fontStyle + '" ' +
  'font-weight="' + fontWeight + '" ' +
  'letter-spacing="' + letterSpacingEm + 'em"' +
  '>' +
  '<textPath ' +
  'xlink:href="#textOnPath' + id + '" ' +
  'text-anchor="' + textAnchor + '" ' +
  'dominant-baseline="' + dominantbaseline + '" ' +
  'startOffset="' + pathStartOffset + '">' +
  //@ts-ignore
  '<tspan dy="' + dy + '">' + this.text + '</tspan>' +
  '</textPath>' +
  '</text>';

  var svgString = this._createBaseSVGMarkup([textPathEl, textEl], {
    reviver: reviver,
    noStyle: true,
    withShadow: true,
  });

  svgString = svgString.replace(
    /<svg([^>]*)>/,
    '<svg$1 ' +
    'xmlns="http://www.w3.org/2000/svg" ' +
    'xmlns:xlink="http://www.w3.org/1999/xlink" ' +
    'width="' + this.width + '" ' +
    'height="' + this.height + '" ' +
    'viewBox="0 0 ' + this.width + ' ' + this.height + '">'
  );

  return svgString;
};

export function AddText() {
  const { canvas, currentModel } = useEditorContext();

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

  const testeCurved = async () => {
    if (!canvas) return;
    
    let path;
    if(currentModel?.shape === 'rectangle') {
      path = createPathFromRectInGroup(canvas,0)
    }else if(currentModel?.shape === 'ellipse') {
      path = createPathFromEllipseInGroup(canvas,0)
    }else{
      path = createPathFromCircleInGroup(canvas,0)
    }

    path.set({ id: 'curved-text-path' });

    const curvedText = new fabric.FabricText('Um texto curvado aparece aqui na sua impressão', {
      fontSize: 14,
      path: path as fabric.Path,
      pathSide: 'left',
      pathAlign:'ascender',
      pathStartOffset:0,
      editable: false,
      selectable: true,
      angle: 0,
      charSpacing: 100,
      top:50,
      pathType: 'circle',
      hasControls: false,
      cardenas_type: currentModel?.shape
    });

    // curvedText.set({
    //   hasControls: true,
    //   hasBorders: false,
    //   lockMovementX: true,
    //   lockMovementY: true,
    //   lockScalingX: true,
    //   lockScalingY: true,
    //   lockSkewingX: true,
    //   lockSkewingY: true,
    //   selectable: true,
    //   evented: true,
    // });

    // curvedText.controls.mtr = new fabric.Control({
    //   x: 0,
    //   y: -0.47,
    //   offsetY: -40,
    //   cursorStyle: 'crosshair',
    //   actionHandler: fabric.controlsUtils.rotationWithSnapping,
    //   actionName: 'rotate',
    //   render: (ctx, left, top, styleOverride, fabricObject) => {
    //     ctx.save();
    //     ctx.fillStyle = 'red';
    //     ctx.beginPath();
    //     ctx.arc(left, top, 8, 0, Math.PI * 2, false);
    //     ctx.fill();
    //     ctx.restore();
    //   }
    // });

    curvedText.set('isCurvedText', true);

    canvas.add(curvedText);
    canvas.centerObject(curvedText);

   
  // canvas.on('mouse:dblclick', (opt) => {
  //   const target = opt.target;
  //   if (!target) return;

  //   if (target.get('isCurvedText')) {
  //     const center = target.getCenterPoint();
  //     const path = target.path!; // Save the path from the curved text for re-creating

  //     // Create editable plain textbox
  //     const plainText = new fabric.Textbox(target.text || '', {
  //       left: center.x,
  //       top: center.y,
  //       originX: 'center',
  //       originY: 'center',
  //       fontSize: target.fontSize,
  //       hasControls: true,
  //       hasBorders: true,
  //       editable: true,
  //     });

  //     canvas.remove(target);
  //     canvas.add(plainText);
  //     canvas.setActiveObject(plainText);
  //     plainText.enterEditing();
  //     plainText.hiddenTextarea?.focus();

  //     plainText.on('editing:exited', () => {
  //       const newCurved = new fabric.FabricText(plainText.text || '', {
  //         fontSize: plainText.fontSize,
  //         path: path as fabric.Path,
  //         pathSide: 'left',
  //         pathAlign: 'ascender',
  //         pathStartOffset: 25,
  //         left: center.x,
  //         top: center.y,
  //         originX: 'center',
  //         originY: 'center',
  //       });

  //       newCurved.set('isCurvedText', true);

  //       newCurved.set({
  //         hasControls: true,
  //         hasBorders: false,
  //         lockMovementX: true,
  //         lockMovementY: true,
  //         lockScalingX: true,
  //         lockScalingY: true,
  //         lockSkewingX: true,
  //         lockSkewingY: true,
  //         selectable: true,
  //         evented: true,
  //       });

  //       newCurved.controls.mtr = target.controls.mtr;

  //       canvas.remove(plainText);
  //       canvas.add(newCurved);
  //       canvas.setActiveObject(newCurved);
  //       canvas.renderAll();
  //     });
  //   }
  // });

  }

// useEffect(() => {
//   if (!canvas) return;

//   const onDoubleClick = (opt: fabric.TEvent) => {
//     const target = opt?.e.target as unknown as fabric.IText | fabric.Textbox;
//     if (target && typeof target.enterEditing === 'function') {
//       target.enterEditing();
//       target.selectAll?.();
//       canvas.requestRenderAll();
//     }
//   };

//   canvas.on('mouse:dblclick', onDoubleClick);

//   return () => {
//     canvas.off('mouse:dblclick', onDoubleClick);
//   };
// }, [canvas]);

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
        // onClick={handleAddCurvedText}
        onClick={testeCurved}
        className="border border-gray-300 rounded-lg px-2 py-1"
      >
        Inisira um Texto curvo
      </button>
      {/* <button
        type="button"
        onClick={handleAddCurvedText}
        className="border border-gray-300 rounded-lg px-2 py-1"
      >
        Inisira um Texto batata
      </button> */}
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

export function createPathFromCircleInGroup(
  canvas: fabric.Canvas,
  padding = 0
): fabric.Path {
  
    const group = canvas.getObjects().find(obj => obj.cardenas_canvas) as fabric.Group;

    const circle = group.item(0) as fabric.Circle as fabric.Circle

    const groupScaleX = group.scaleX ?? 1;
    const groupScaleY = group.scaleY ?? 1;

    const r = circle.radius;

    if(padding) padding = padding * -1

    // Apply padding and scale
    const scaledRadiusX = (r + padding) * groupScaleX;
    const scaledRadiusY = (r + padding) * groupScaleY;

    const pathData = `
      M 0 ${-scaledRadiusY}
      A ${scaledRadiusX} ${scaledRadiusY} 0 1 1 0 ${scaledRadiusY}
      A ${scaledRadiusX} ${scaledRadiusY} 0 1 1 0 ${-scaledRadiusY}
      Z
    `;

    const scaledLeft = (circle.left ?? 0) * groupScaleX + (group.left ?? 0);
    const scaledTop = (circle.top ?? 0) * groupScaleY + (group.top ?? 0);

    const path = new fabric.Path(pathData.trim(), {
      fill: 'transparent',
      originX: 'center',
      originY: 'center',
      left: scaledLeft,
      top: scaledTop,
      scaleX: 1,
      scaleY: 1,
    });

    return path;
}

export function createPathFromRectInGroup(
  canvas: fabric.Canvas,
  padding = 0
): fabric.Path {
  const group = canvas.getObjects().find(obj => obj.cardenas_canvas) as fabric.Group;
  if (!group) throw new Error("Group with cardenas_canvas not found");

  const rect = group.item(0) as fabric.Rect;
  if (!rect) throw new Error("No rect found in group");

  const groupScaleX = group.scaleX ?? 1;
  const groupScaleY = group.scaleY ?? 1;

  // Base dimensions scaled
  const baseWidth = (rect.width ?? 0) * (rect.scaleX ?? 1) * groupScaleX;
  const baseHeight = (rect.height ?? 0) * (rect.scaleY ?? 1) * groupScaleY;

  // Adjusted width/height by padding (padding shrinks if positive)
  const width = baseWidth - padding * 2;
  const height = baseHeight - padding * 2;

  // Radius from rect scaled
  const baseRx = ((rect.rx ?? 0) * (rect.scaleX ?? 1)) * groupScaleX;
  const baseRy = ((rect.ry ?? 0) * (rect.scaleY ?? 1)) * groupScaleY;

  // Radius clamped to half width/height so it never exceeds shape
  const rx = Math.min(baseRx, width / 2);
  const ry = Math.min(baseRy, height / 2);

  // Coordinates relative to center (originX and originY = 'center')
  const left = -width / 2;
  const top = -height / 2;
  const right = width / 2;
  const bottom = height / 2;

  const pathData = `
    M ${left + rx},${top}
    H ${right - rx}
    Q ${right},${top} ${right},${top + ry}
    V ${bottom - ry}
    Q ${right},${bottom} ${right - rx},${bottom}
    H ${left + rx}
    Q ${left},${bottom} ${left},${bottom - ry}
    V ${top + ry}
    Q ${left},${top} ${left + rx},${top}
    Z
  `;

  // Position path at rect's center plus group's position
  const pathLeft = (rect.left ?? 0) * groupScaleX + (group.left ?? 0);
  const pathTop = (rect.top ?? 0) * groupScaleY + (group.top ?? 0);

  return new fabric.Path(pathData.trim(), {
    fill: 'transparent',
    originX: 'center',
    originY: 'center',
    left: pathLeft,
    top: pathTop,
    scaleX: 1,
    scaleY: 1,
  });
}


export function createPathFromEllipseInGroup(
  canvas: fabric.Canvas,
  padding = 0
): fabric.Path {
  const group = canvas.getObjects().find(obj => obj.cardenas_canvas) as fabric.Group;
  if (!group) throw new Error("Group with cardenas_canvas not found");

  const ellipse = group.item(0) as fabric.Ellipse;
  if (!ellipse) throw new Error("No ellipse found in group");

  const groupScaleX = group.scaleX ?? 1;
  const groupScaleY = group.scaleY ?? 1;

  // Radii with scaling
  const baseRx = (ellipse.rx ?? 0) * (ellipse.scaleX ?? 1) * groupScaleX;
  const baseRy = (ellipse.ry ?? 0) * (ellipse.scaleY ?? 1) * groupScaleY;

  // Apply padding (shrink or expand)
  const rx = baseRx - padding;
  const ry = baseRy - padding;

  if (rx <= 0 || ry <= 0) {
    throw new Error("Padding is too large and collapses the ellipse");
  }

  // Ellipse path using Bezier approximation (4 curves)
  const kappa = 0.5522847498307936; // Approximation constant for a circle

  const ox = rx * kappa; // Horizontal control point offset
  const oy = ry * kappa; // Vertical control point offset

  const pathData = `
    M 0,${-ry}
    C ${ox},${-ry} ${rx},${-oy} ${rx},0
    C ${rx},${oy} ${ox},${ry} 0,${ry}
    C ${-ox},${ry} ${-rx},${oy} ${-rx},0
    C ${-rx},${-oy} ${-ox},${-ry} 0,${-ry}
    Z
  `;

  // Position at center of ellipse inside the group
  const left = (ellipse.left ?? 0) * groupScaleX + (group.left ?? 0);
  const top = (ellipse.top ?? 0) * groupScaleY + (group.top ?? 0);

  return new fabric.Path(pathData.trim(), {
    fill: 'transparent',
    originX: 'center',
    originY: 'center',
    left,
    top,
    scaleX: 1,
    scaleY: 1,
  });
}
