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
    backgroundColor: 'transparent',
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

  // Step 6: Add only the `cardenas_print` children of cardenas_canvas
  const cardenasPrintObjects: fabric.Object[] = [];

  for (const child of cardenasCanvasObject.getObjects()) {
    if (child.cardenas_print) {
      if (child.type === 'image') {
        await convertImageToBase64(child as fabric.Image);
      }

      // child.set({
      //   fill: 'transparent',
      //   backgroundColor: 'transparent',
      // });

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
  ctx.drawImage(imageElement, 0, 0);

  const base64 = canvas.toDataURL(isJpeg ? 'image/jpeg' : 'image/png', 1);
  imageElement.src = base64;

  console.log('base64',base64)

  image.set({ element: imageElement });
}
