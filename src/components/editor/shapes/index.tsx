"use client";

import { ReactSVG } from "react-svg";
import { useEditorContext } from "@/context/editor";
import * as fabric from "fabric";
import {
  circuloSVG,
  trianguloSVG,
  quadradoSVG,
  pentagonoSVG,
  hexagonoSVG,
  heptagonoSVG,
  octognoSVG,
  eneagonoSVG,
  decagonoSVG,
  retanguloSVG,
} from "./svg";

const createRectangle = () => {
  return new fabric.Rect({ width: 150, height: 100 });
};

const createSquare = () => {
  const square = new fabric.Rect({ width: 100, height: 100 });

  square.setControlsVisibility({
    mt: false,
    mb: false,
    ml: false,
    mr: false,
    mtr: true,
    tl: true,
    tr: true,
    bl: true,
    br: true,
  });

  return square;
};

const createTriangle = () => {
  return new fabric.Triangle();
};

const createCircle = () => {
  return new fabric.Circle({ radius: 30 });
};

function createPentagon(sides: number) {
  const points = [];
  for (let i = 0; i < sides; i++) {
    const angle = (i * 2 * Math.PI) / sides - Math.PI / 2;
    points.push({
      x: 50 * Math.cos(angle),
      y: 50 * Math.sin(angle),
    });
  }
  return points;
}

const createPolygon = (sides: number) => {
  return new fabric.Polygon(createPentagon(sides));
};

const items = {
  triangulo: { label: "triangulo", func: createTriangle, svg: trianguloSVG },
  circulo: { label: "circulo", func: createCircle, svg: circuloSVG },
  quadrado: { label: "quadrado", func: createSquare, svg: quadradoSVG },
  retangulo: { label: "retangulo", func: createRectangle, svg: retanguloSVG },
  pentagono: {
    label: "pentagono",
    func: () => createPolygon(5),
    svg: pentagonoSVG,
  },
  hexagono: {
    label: "hexagono",
    func: () => createPolygon(6),
    svg: hexagonoSVG,
  },
  heptagono: {
    label: "heptagono",
    func: () => createPolygon(7),
    svg: heptagonoSVG,
  },
  octogono: {
    label: "octogono",
    func: () => createPolygon(8),
    svg: octognoSVG,
  },
  eneagono: {
    label: "eneagono",
    func: () => createPolygon(9),
    svg: eneagonoSVG,
  },
  decagono: {
    label: "decagono",
    func: () => createPolygon(10),
    svg: decagonoSVG,
  },
};

export const TabShapes = ({ content }: { content: string }) => {
  const { canvas } = useEditorContext();

  const handleAddShape = async (shapeLabel: string) => {
    const shape = items[shapeLabel].func();

    canvas.add(shape);
    canvas.centerObject(shape);
    canvas.renderAll();
  };

  return (
    <>
      <div className="flex flex-col px-4 divide-y-2 divide-red-600">
        <div className="pt-4">
          <div className="flex flex-wrap gap-8 items-center">
            {Object.values(items).map((item) => {
              const base64Svg = `data:image/svg+xml;base64,${btoa(item.svg)}`;

              return (
                <div
                  onClick={() => handleAddShape(item.label)}
                  className="h-[50px] w-[50px] text-white"
                  key={item.label}
                >
                  <ReactSVG src={base64Svg} />
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
