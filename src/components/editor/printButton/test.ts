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

  // Step 3: Add all intersecting non-canvas objects
  const relevantObjects = originalCanvas.getObjects().filter((obj) => {
    return obj !== cardenasCanvasObject &&
      rectsIntersect(bounds, obj.getBoundingRect());
  });

  for (const obj of relevantObjects) {
    const clone = await obj.clone();
    clone.set({
      left: (clone.left ?? 0) - bounds.left,
      top: (clone.top ?? 0) - bounds.top,
    });

    // Convert images to base64
    if (clone.type === 'image') {
      await convertImageToBase64(clone as fabric.Image);
    }

    const clipPath = await cardenasCanvasObject.clone();

    clipPath.left = 0;
    clipPath.top = 0;
    clipPath.originX = 'left';
    clipPath.originY = 'top';
    clipPath.absolutePositioned = true;

    clone.clipPath = clipPath;
    croppedCanvas.add(clone);
  }

  // Step 4: Add only `cardenas_print` children of cardenas_canvas
  const cardenasPrintObjects: fabric.Object[] = [];

  for (const groupObj of cardenasCanvasObject.getObjects()) {
    if (groupObj.cardenas_print) {
      if (groupObj.type === 'image') {
        await convertImageToBase64(groupObj as fabric.Image);
      }

      groupObj.set({
        fill: 'transparent',
        backgroundColor: 'transparent',
      });

      cardenasPrintObjects.push(groupObj);
    }
  }

  const cleanedGroup = new fabric.Group(cardenasPrintObjects, {
    left: 0,
    top: 0,
  });

  croppedCanvas.add(cleanedGroup); // Add on top

  // Step 5: Scale everything
  const targetWidth = fabric.util.parseUnit(`${width}mm`);
  const targetHeight = fabric.util.parseUnit(`${height}mm`);
  const scaleX = targetWidth / bounds.width;
  const scaleY = targetHeight / bounds.height;

  croppedCanvas.setDimensions({ width: targetWidth, height: targetHeight });

  croppedCanvas.getObjects().forEach((obj) => {
    obj.scaleX = (obj.scaleX ?? 1) * scaleX;
    obj.scaleY = (obj.scaleY ?? 1) * scaleY;
    obj.left = (obj.left ?? 0) * scaleX;
    obj.top = (obj.top ?? 0) * scaleY;
    obj.setCoords();
  });

  console.log('aaa',croppedCanvas.toSVG())
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

  // If already base64, skip
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

  image.set({ element: imageElement });
}
