"use client";

import { useInifiteScroll } from "@/hooks/useInifiteScroll";
import { ReactSVG } from "react-svg";
import { LoadingIcon } from "@/components/loading";
import { useState } from "react";
import { SearchInput } from "@/components/searchInput";
import { useEditorContext } from "@/context/editor";
import * as fabric from "fabric";

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
  triangulo: { label: "triangulo", func: createTriangle },
  circulo: { label: "circulo", func: createCircle },
  quadrado: { label: "quadrado", func: createSquare },
  retangulo: { label: "retangulo", func: createRectangle },
  pentagono: { label: "pentagono", func: () => createPolygon(5) },
  hexagono: { label: "hexagono", func: () => createPolygon(6) },
  heptagono: { label: "heptagono", func: () => createPolygon(7) },
  octogono: { label: "octogono", func: () => createPolygon(8) },
  eneagono: { label: "eneagono", func: () => createPolygon(9) },
  decagono: { label: "decagono", func: () => createPolygon(10) },
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
          <div className="flex flex-wrap">
            {Object.values(items).map((item) => {
              return (
                <div
                  onClick={() => handleAddShape(item.label)}
                  className="h-[75px] w-[75px] text-white"
                  key={item.label}
                >
                  {item.label}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </>
  );
};
