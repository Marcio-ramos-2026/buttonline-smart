import * as fabric from 'fabric';
import type { TBBox } from 'fabric';

export async function extractCardenasCanvas(
  originalCanvas: fabric.Canvas,
  width: number,
  height: number
): Promise<string> {
  // Step 1: Find the cardenas_canvas group
  const cardenasCanvasObject = originalCanvas.getObjects().find(obj => obj.cardenas_canvas);

  if (!cardenasCanvasObject || !(cardenasCanvasObject instanceof fabric.Group)) {
    throw new Error("No valid group with `cardenas_canvas: true` found.");
  }

  const bounds = cardenasCanvasObject.getBoundingRect();


  // Step 2: Create a cropped canvas
  const croppedCanvas = new fabric.StaticCanvas('', {
    width: bounds.width,
    height: bounds.height,
    backgroundColor: cardenasCanvasObject.getObjects()[0].fill as string,
  });

  // ✅ Step 3: Clone the entire `cardenasCanvasObject` to use as a clipPath
  const clipPath = await cardenasCanvasObject.clone();
  clipPath.set({
    left: 0,
    top: 0,
    originX: 'left',
    originY: 'top',
    absolutePositioned: true,
  });

  // ✅ Step 4: Set the clipPath on the canvas itself
  croppedCanvas.clipPath = clipPath;

  // Step 5: Add relevant intersecting objects (excluding the canvas group)
  const relevantObjects = originalCanvas.getObjects().filter(obj =>
    obj !== cardenasCanvasObject && rectsIntersect(bounds, obj.getBoundingRect())
  );

  for (const obj of relevantObjects) {
    const clone = await obj.clone();

    clone.set({
      left: (clone.left ?? 0) - bounds.left,
      top: (clone.top ?? 0) - bounds.top,
    });

    if (clone.type === 'image') {
      await convertImageToBase64(clone as fabric.Image);
    }

    croppedCanvas.add(clone);
  }

  // Step 6: Add only the `cardenas_print` or `cardenas_editable` children of cardenas_canvas
  // (cardenas_editable overrides cardenas_print: if editable, always show in PDF)
  const cardenasPrintObjects: fabric.Object[] = [];

  const cardenasChildren = cardenasCanvasObject.getObjects();
  for (let i = 0; i < cardenasChildren.length; i++) {
    const child = cardenasChildren[i];
    const includeInPdf = child.cardenas_print || child.cardenas_editable;
    if (includeInPdf) {
      if (child.type === 'image') {
        await convertImageToBase64(child as fabric.Image);
      }

      // First child (index 0) is the button area — keep its fill so background color appears in PDF
      const isButtonArea = i === 0;
      if (!['group', 'image'].includes(child.type ?? '') && !child.cardenas_mark && !isButtonArea) {
        child.set({
          fill: 'transparent',
          backgroundColor: 'transparent',
        });
      }

      // cardenas_editable: show only the painted area in PDF — remove stroke/outline
      if (child.cardenas_editable) {
        stripStrokeForPdf(child);
      }

      cardenasPrintObjects.push(child);
    }
  }
  
  
  const printGroup = new fabric.Group(cardenasPrintObjects, {
    left: 0,
    top: 0,
  });

  croppedCanvas.add(printGroup);

  // Step 7: Scale everything to target dimensions
  const targetWidth = fabric.util.parseUnit(`${width}mm`);
  const targetHeight = fabric.util.parseUnit(`${height}mm`);
  const scaleX = targetWidth / bounds.width;
  const scaleY = targetHeight / bounds.height;

  croppedCanvas.setDimensions({ width: targetWidth, height: targetHeight });

  croppedCanvas.getObjects().forEach(obj => {
    obj.scaleX = (obj.scaleX ?? 1) * scaleX;
    obj.scaleY = (obj.scaleY ?? 1) * scaleY;
    obj.left = (obj.left ?? 0) * scaleX;
    obj.top = (obj.top ?? 0) * scaleY;
    obj.setCoords();
  });

  if (croppedCanvas.clipPath) {
    croppedCanvas.clipPath.scaleX = (croppedCanvas.clipPath.scaleX ?? 1) * scaleX;
    croppedCanvas.clipPath.scaleY = (croppedCanvas.clipPath.scaleY ?? 1) * scaleY;
    croppedCanvas.clipPath.setCoords();

  
  }

  return croppedCanvas.toSVG();
}

// Helper: Check bounding box intersection
function rectsIntersect(a: TBBox, b: TBBox): boolean {
  return !(
    a.left + a.width <= b.left ||
    a.left >= b.left + b.width ||
    a.top + a.height <= b.top ||
    a.top >= b.top + b.height
  );
}

// Helper: Remove stroke/outline so only filled area shows in PDF (for cardenas_editable)
function stripStrokeForPdf(obj: fabric.Object): void {
  obj.set({
    stroke: 'transparent',
    strokeWidth: 0,
  });
  if (obj instanceof fabric.Group) {
    obj.getObjects().forEach(stripStrokeForPdf);
  }
}

// Helper: Convert image to embedded base64
async function convertImageToBase64(image: fabric.Image): Promise<void> {
  const imageElement = image.getElement() as HTMLImageElement;

  if (imageElement.src.startsWith('data:')) return;

  const url = new URL(imageElement.src);
  const extension = url.pathname.split(".").pop()?.toLowerCase();
  const isJpeg = extension === 'jpg' || extension === 'jpeg';

  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = imageElement.naturalWidth;
  canvas.height = imageElement.naturalHeight;
  ctx.fillStyle = "#fff";
ctx.fillRect(0, 0, canvas.width, canvas.height); // BEFORE drawing image

  ctx.drawImage(imageElement, 0, 0);

  const base64 = canvas.toDataURL(isJpeg ? 'image/jpeg' : 'image/png', 1);
  imageElement.src = base64;

  image.set({ element: imageElement });
}

function circleToPathD(cx: number, cy: number, r: number, matrix: number[]): string {
  // matrix is [a, b, c, d, e, f] from transform="matrix(a b c d e f)"
  // Transform the center point:
  const x = matrix[0] * cx + matrix[2] * cy + matrix[4];
  const y = matrix[1] * cx + matrix[3] * cy + matrix[5];
  
  // Approximate scaled radius as average scale from matrix:
  // Note: This is a simplification, true transform of circle can become ellipse
  const scaleX = Math.sqrt(matrix[0]*matrix[0] + matrix[1]*matrix[1]);
  const scaleY = Math.sqrt(matrix[2]*matrix[2] + matrix[3]*matrix[3]);
  const rX = r * scaleX;
  const rY = r * scaleY;

  // Create elliptical arc path (SVG elliptical arc)
  // Move to (x - rX, y)
  // Arc to (x + rX, y) and back

  return `
    M ${x - rX} ${y}
    A ${rX} ${rY} 0 1 0 ${x + rX} ${y}
    A ${rX} ${rY} 0 1 0 ${x - rX} ${y}
  `.trim().replace(/\s+/g, ' ');
}


function extractFirstCirclePathD(svg: string): string | null {
  const circleRegex = /<circle[^>]*cx="([^"]+)"[^>]*cy="([^"]+)"[^>]*r="([^"]+)"[^>]*\/?>/;
  const transformRegex = /transform="matrix\(([^)]+)\)"/;

  // Find first circle element
  const circleMatch = svg.match(circleRegex);
  if (!circleMatch) return null;
  const cx = parseFloat(circleMatch[1]);
  const cy = parseFloat(circleMatch[2]);
  const r = parseFloat(circleMatch[3]);

  // Find transform matrix closest before this circle (simplified: find first matrix in svg)
  const transformMatch = svg.match(transformRegex);
  let matrix = [1, 0, 0, 1, 0, 0]; // identity by default
  if (transformMatch) {
    matrix = transformMatch[1].split(/\s+/).map(parseFloat);
  }

  return circleToPathD(cx, cy, r, matrix);
}

export function patchSvgWithTextPath(svg: string, curvedTextObj: fabric.FabricText, pathId = 'curved-text-path'): string {
  // ... your text extraction and replacement logic ...

  // Extract path d from first circle + transform in SVG
  const pathD = extractFirstCirclePathD(svg);
  if (pathD) {
    const defsBlock = `<defs><path id="${pathId}" d="${pathD}" /></defs>`;
    svg = svg.replace(/<svg([^>]*)>/, `<svg$1>${defsBlock}`);
  }

  return svg;
}
