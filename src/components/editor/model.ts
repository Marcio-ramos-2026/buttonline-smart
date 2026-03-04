import { editor_canvas } from "@prisma/client";
import * as fabric from "fabric";
import {
  CARDENAS_FILL_AREA_ID,
  extractClipPathD,
  injectFillPathFromD,
  prepareSvgForEditor,
} from "@/lib/svg-normalizer";

export type ModelType = {
  [key: string]: () => fabric.Object; // The key is a string and the value is a function returning an object
};

export const pageSizes = {
  A4: [595, 842], // A4 size in points
  A5: [595, 842], // A4 size in points
  Letter: [612, 792], // Letter size in points
};

type Shape = {
  background: string;
  color?: string;
  cardenas_print: boolean;
  cardenas_overlay: boolean;
  tags?: Record<string, string | Record<string, string>>;
  tagGroup?: string;
};

type shapeCustom =  {
  type: string;
  width: number;
  height: number;
  svg: string;
  top: number;
  left: number;
  rotate: number;
} & Shape

type shapeRectangle = {
  type: string;
  width: number;
  height: number;
  top?: number | string;
  left?: number | string;
  rotate?: number | string;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
  radius?: number;
} & Shape;

type shapeEllipse = {
  type: string;
  width: number;
  height: number;
  top?: number | string;
  left?: number | string;
  rotate?: number | string;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
} & Shape;

type shapeCircle = {
  type: string;
  radius: number;
  top?: number | string;
  left?: number | string;
  rotate?: number | string;
  strokeWidth?: number;
  strokeDashArray?: [number, number];
} & Shape;

/** Folha: shape com type (circle, ellipse, rectangle, custom). */
type LeafShape = shapeCircle | shapeEllipse | shapeRectangle | shapeCustom;

/** Nó recursivo: tem `objects` → vira grupo; senão é folha por `type`. Nested = clipado ao pai. */
export type RecursiveShape =
  | LeafShape
  | ({ objects: Record<string, RecursiveShape> } & Partial<Shape>);

type ShapeCollection = Record<string, RecursiveShape>;
type GabaritoLinePosition = number | 'lower' | 'higher'
type gabarito = {
  line?: 'vertical' | 'horizontal'
  lines?: {x:GabaritoLinePosition,y:GabaritoLinePosition}[]
  orientation?: 'vertical' | 'horizontal'
  pdf: keyof typeof pageSizes;
  positions: Record<string, { x: number; y: number, rotate?:number }>;
};

type mark = {
  position?: string;
  height?: number;
  width?: number;
};

export type ModelConfig = {
  mark?: mark;
  objects: ShapeCollection;
  gabarito: gabarito;
};


export const createModel = async (model: editor_canvas): Promise<fabric.Object> => {
  const objConfig = model?.config as ModelConfig;

  const createMark = (element: fabric.FabricObject) => {
    const markWidth = objConfig?.mark?.width ?? 10;
    const markHeight = objConfig?.mark?.height ?? 10;

    const positions = {
      top: {
        top:
          element.top -
          element.height / 2 +
          markHeight / 2 +
          element.strokeWidth / 2,
      },
      left: {
        left:
          element.left -
          element.width / 2 +
          markWidth / 2 +
          element.strokeWidth / 2,
      },
      bottom: {
        top:
          element.top +
          element.height / 2 -
          markHeight / 2 -
          element.strokeWidth / 2,
      },
      right: {
        left:
          element.left +
          element.width / 2 -
          markWidth / 2 -
          element.strokeWidth / 2,
      },
    };

    const position = objConfig?.mark?.position ?? "left";

    const mark = new fabric.Rect({
      width: markWidth,
      height: markHeight,
      fill: "black",
      stroke: "black",
      strokeWidth: 0,
      selectable: false,
      originX: "center",
      originY: "center",
      hoverCursor: "default",
      cardenas_print: true,
      cardenas_mark: true,
      ...positions[position as keyof typeof positions],
    });

    return mark;
  };

  ////////////////////////////////////////////////////////
  /** Cria um objeto Fabric de forma recursiva. Se tem `objects` → grupo (nested = clip ao pai). Senão → folha por `type`. */
  const createElement = async (
    obj: RecursiveShape,
    isNested: boolean = false
  ): Promise<fabric.FabricObject | null> => {
    const hasObjects =
      obj &&
      typeof obj === "object" &&
      "objects" in obj &&
      obj.objects != null &&
      typeof obj.objects === "object" &&
      !Array.isArray(obj.objects);

    if (hasObjects) {
      const container = obj as {
        objects: Record<string, RecursiveShape>;
        type?: string;
      } & Partial<Shape>;
      const hasLeafType =
        container.type === "circle" ||
        container.type === "ellipse" ||
        container.type === "rectangle" ||
        container.type === "custom";

      let selfShape: fabric.FabricObject | null = null;
      if (hasLeafType) {
        const leaf = container as unknown as LeafShape;
        switch (leaf.type) {
          case "ellipse":
            selfShape = applyEditableBehavior(ellipse(leaf as shapeEllipse));
            break;
          case "circle":
            selfShape = applyEditableBehavior(circle(leaf as shapeCircle));
            break;
          case "rectangle":
            selfShape = applyEditableBehavior(rectangle(leaf as shapeRectangle));
            break;
          case "custom": {
            const customConfig = leaf as shapeCustom;
            // Com filhos: path para clip. Prioridade: clipPath do SVG → normalização.
            let svgToLoad = customConfig.svg;
            if (container.objects && typeof customConfig.svg === "string") {
              const clipD = extractClipPathD(customConfig.svg);
              if (clipD) {
                svgToLoad = injectFillPathFromD(customConfig.svg, clipD);
              } else {
                svgToLoad = prepareSvgForEditor(customConfig.svg);
              }
            }
            const x = await svgShape({ ...customConfig, svg: svgToLoad });
            x.set({ left: 0 });
            selfShape = applyEditableBehavior(x);
            break;
          }
        }
      }

      const childElements = await Promise.all(
        Object.values(container.objects).map((child) => createElement(child, true))
      ).then((results) =>
        results.filter((el): el is fabric.FabricObject => el !== null)
      );

      // Clip path aplicado ao wrapper dos filhos (não em cada filho individualmente).
      // Isso garante que o clip fique fixo no espaço do wrapper enquanto os filhos se movem livremente.
      let groupObjects: fabric.FabricObject[];
      if (selfShape && childElements.length > 0 && selfShape.type === "group") {
        const fillPath = getFillAreaObject(selfShape as fabric.Group);
        if (fillPath && (fillPath.type === "path" || "path" in fillPath)) {
          const pathClone = await fillPath.clone();
          // fillPath no espaço do group externo (= espaço local do childrenWrapper, pois ambos estão em 0,0)
          const pathInGroupMatrix = fabric.util.multiplyTransformMatrices(
            selfShape.calcOwnMatrix(),
            fillPath.calcOwnMatrix()
          );
          const decomposed = fabric.util.qrDecompose(pathInGroupMatrix);
          // Guard: se a decomposição produziu NaN ou escala 0 (SVG com dimensões inválidas), sem clip
          const validDecomposition =
            isFinite(decomposed.scaleX) &&
            isFinite(decomposed.scaleY) &&
            decomposed.scaleX !== 0 &&
            decomposed.scaleY !== 0;

          if (validDecomposition) {
            // Cria o wrapper primeiro para saber o offset real do seu centro
            // (filhos com top/left deslocam o centro do wrapper em relação à origem)
            const childrenWrapper = new fabric.Group(childElements, {
              subTargetCheck: true,
              interactive: true,
              originX: "center",
              originY: "center",
              selectable: false,
              evented: true,
              fill: 'transparent',
              objectCaching: false,
            });
            childrenWrapper.set("cardenas_children_wrapper", true);

            // O clip está no espaço LOCAL do wrapper (absolutePositioned: false).
            // Se os filhos têm posições não-nulas, o centro do wrapper desloca.
            // Compensamos subtraindo esse offset para que o clip cubra a fill-area corretamente.
            pathClone.set({
              left: decomposed.translateX - childrenWrapper.left,
              top: decomposed.translateY - childrenWrapper.top,
              scaleX: decomposed.scaleX,
              scaleY: decomposed.scaleY,
              angle: decomposed.angle,
              skewX: decomposed.skewX,
              originX: "center",
              originY: "center",
              absolutePositioned: false,
              fill: "black",
              inverted: false,
              objectCaching: false,
            });

            childrenWrapper.clipPath = pathClone;
            groupObjects = [selfShape, childrenWrapper];
          } else {
            groupObjects = [selfShape, ...childElements];
          }
        } else {
          groupObjects = [selfShape, ...childElements];
        }
      } else {
        groupObjects = selfShape ? [selfShape, ...childElements] : childElements;
      }

      const group = new fabric.Group(groupObjects, {
        subTargetCheck: true,
        interactive: true,
        originX: "center",
        originY: "center",
      });
      group.set({
        cardenas_print: container.cardenas_print === undefined ? true : container.cardenas_print,
        cardenas_overlay: container.cardenas_overlay,
      });
      const hasTags = !!container.tags && Object.keys(container.tags).length > 0;
      return (isNested && !hasTags) ? applySelectableOnly(group) : applyEditableBehavior(group, container.tags, container.tagGroup);
    }

    const leaf = obj as LeafShape;
    const hasTags = !!leaf.tags && Object.keys(leaf.tags).length > 0;
    const applyBehavior = <T extends fabric.Object>(o: T) =>
      (isNested && !hasTags) ? applySelectableOnly(o) : applyEditableBehavior(o, leaf.tags, leaf.tagGroup);

    switch (leaf.type) {
      case "ellipse":
        return applyBehavior(ellipse(leaf as shapeEllipse));
      case "circle":
        return applyBehavior(circle(leaf as shapeCircle));
      case "rectangle":
        return applyBehavior(rectangle(leaf as shapeRectangle));
      case "custom": {
        const x = await svgShape(leaf as shapeCustom);
        x.set({ left: 0 });
        return applyBehavior(x);
      }
      default:
        return null;
    }
  };

  const elements: fabric.FabricObject[] = await Promise.all(
    Object.values(objConfig?.objects).map((obj) => createElement(obj))
  ).then((results) =>
    results.filter((el): el is fabric.FabricObject => el !== null)
  );

  if (elements.length > 0) {
    elements.push(createMark(elements[0]));
  }

  const rootGroup = new fabric.Group(elements, {
    selectable: false,
    moveCursor: "default",
    hoverCursor: "default",
    cardenas_canvas: "true",
    cardenas_type: model.shape,
    subTargetCheck: true,
    interactive: true,
  });

  return rootGroup;
};

const ellipse = (config: shapeEllipse): fabric.FabricObject => {
  return new fabric.Ellipse({
    rx: fabric.util.parseUnit(`${config.width}mm`),
    ry: fabric.util.parseUnit(`${config.height}mm`),
    fill: config.color ?? "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 1,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    top: Number(config?.top ?? 0),
    left: Number(config?.left ?? 0),
    angle: Number(config?.rotate ?? 0),
    cardenas_print:
      config.cardenas_print === undefined ? true : config.cardenas_print,
    cardenas_overlay: config?.cardenas_overlay
  });
};

const circle = (config: shapeCircle) => {
  return new fabric.Circle({
    radius: fabric.util.parseUnit(`${config.radius/2}mm`),
    fill: config.color ?? config.background ?? "#fff",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 1,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    top: Number(config?.top ?? 0),
    left: Number(config?.left ?? 0),
    angle: Number(config?.rotate ?? 0),
    cardenas_print: config.cardenas_print === undefined ? true: config.cardenas_print,
    cardenas_overlay: config?.cardenas_overlay
  });
}

const rectangle = (config: shapeRectangle) => {
  return new fabric.Rect({
    width: fabric.util.parseUnit(`${config.width}mm`),
    height: fabric.util.parseUnit(`${config.height}mm`),
    fill: config.color ?? "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 0.3,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
    rx: config?.radius ?? 0,
    ry: config?.radius ?? 0,
    top: Number(config?.top ?? 0),
    left: Number(config?.left ?? 0),
    angle: Number(config?.rotate ?? 0),
    cardenas_print:
      config.cardenas_print === undefined ? true : config.cardenas_print,
    cardenas_overlay: config?.cardenas_overlay
  });
};

/** Reviver para preservar atributos do SVG (ex.: id) nos objetos Fabric ao carregar. */
function svgReviver(
  _el: Element,
  obj: fabric.FabricObject & { id?: string }
): void {
  const el = _el as SVGElement;
  const id = el.getAttribute?.("id");
  if (id) obj.set("id", id);
}

export const svgShape = async (config: shapeCustom): Promise<fabric.FabricObject> => {
  const svgText = config.svg.replace(/\\+/g, '');
  const loaded = await fabric.loadSVGFromString(svgText, svgReviver);

  if (!loaded || !loaded.objects?.length) {
    return new fabric.Group([], { objectCaching: false });
  }

  const objects = loaded.objects.filter(Boolean) as fabric.Object[];
  const group = new fabric.Group(objects);

  // Path de fill (cardenas-fill-area): sem cache para o color picker atualizar na tela
  const fillPath = getFillAreaObject(group);
  if (fillPath) {
    fillPath.set("objectCaching", false);
    if (config.color) fillPath.set("fill", config.color);
  }
  group.set("objectCaching", false);

  // Convert mm to px for accurate scaling
  const targetWidthPx = fabric.util.parseUnit(`${config.width}mm`);
  const targetHeightPx = fabric.util.parseUnit(`${config.height}mm`);

  const scaleX = targetWidthPx / group.width!;
  const scaleY = targetHeightPx / group.height!;
  const scale = Math.min(scaleX, scaleY); // use both if you want to stretch

  group.set({
    scaleX: scale,
    scaleY: scale,

    originX: 'center',
    originY: 'center',
    top: config?.top ?? 0,
    left: config?.left ?? 0,
    angle: config?.rotate ?? 0,
    cardenas_print:
      config.cardenas_print === undefined ? true : config.cardenas_print,
    cardenas_overlay: config?.cardenas_overlay,
  });


  return group as fabric.FabricObject;
};

/**
 * Retorna o path de área pintável de um Group (SVG normalizado).
 * Ordem: id=CARDENAS_FILL_AREA_ID → path com fill e stroke none → primeiro path do grupo.
 */
export function getFillAreaObject(group: fabric.Group): fabric.Object | null {
  const objects = group.getObjects();
  const byId = objects.find((o) => (o as fabric.Object & { id?: string }).id === CARDENAS_FILL_AREA_ID);
  if (byId) return byId;
  const fillStrokeNone = objects.find((o) => {
    const cast = o as fabric.Object & { fill?: unknown; stroke?: string };
    return (o.type === "path" || "path" in o) && cast.fill != null && String(cast.stroke ?? "").toLowerCase() === "none";
  });
  if (fillStrokeNone) return fillStrokeNone;
  return objects.find((o) => o.type === "path" || "path" in o) ?? null;
}

/**
 * Remove o path de preenchimento (elemento de cor) de um Group.
 * Usado na cópia do overlay para que a cópia mostre só o contorno, sem a área pintada.
 */
export function removeFillElementFromGroup(obj: fabric.Object): void {
  if (obj.type !== "group") return;
  const group = obj as fabric.Group;
  const fillPath = getFillAreaObject(group);
  if (fillPath) group.remove(fillPath);
}

export const generateSVG = (element: fabric.FabricObject) => {
  const viewBox = `${-element.width / 2} ${-element.height / 2} ${element.width} ${element.height}`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="${viewBox}">${element.toSVG()}</svg>`;
};

const applyEditableBehavior = <T extends fabric.Object>(
  obj: T,
  tags?: Record<string, string | Record<string, string>>,
  tagGroup?: string
): T => {
  const editable = !!tags && Object.keys(tags).length > 0;

  if (!editable) {
    obj.set({
      selectable: false,
      evented: false,
      hoverCursor: 'default',
      moveCursor: 'default',
    });
    return obj;
  }

  obj.set({
    selectable: true,
    evented: true,

    hoverCursor: 'pointer',
    moveCursor: 'pointer',

    lockMovementX: true,
    lockMovementY: true,
    lockScalingX: true,
    lockScalingY: true,
    lockRotation: true,
    lockSkewingX: true,
    lockSkewingY: true,

    hasControls: false,
    hasBorders: false,

    cardenas_tags: tags,
    cardenas_tag_group: tagGroup,
  });

  return obj;
};

const applySelectableOnly = <T extends fabric.Object>(obj: T): T => {
  obj.set({
    selectable: true,
    evented: true,
    hoverCursor: 'move',
    moveCursor: 'move',
  });
  return obj;
};
