"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
} from "react";
import * as fabric from "fabric";

type IFabricProvider = {
  children: React.ReactNode;
};

type IFabricContext = {
  canvas: fabric.Canvas | null;
};

const FabricContext = createContext<IFabricContext | null>(null);

export default function FabricContextProvider({ children }: IFabricProvider) {
  const [canvas, setcanvas] = useState<fabric.Canvas | null>(null);

  const canvasEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasEl.current) return;

    // Create a new fabric.Canvas with proper width/height adjustments
    const canvasInstance = new fabric.Canvas(canvasEl.current, {
      backgroundColor: "#000",
    });

    // Set the canvas dimensions directly on the fabric canvas instance
    canvasInstance.setDimensions({ width: 800, height: 400 });

    // Make the fabric.Canvas instance available to your app if needed
    setcanvas(canvasInstance);

    // Clean up on component unmount
    return () => {
      // setcanvas(null);
      canvasInstance.dispose();
    };
  }, []);

  return (
    <FabricContext.Provider value={{ canvas: canvas }}>
      {children}
      <canvas ref={canvasEl} />
    </FabricContext.Provider>
  );
}

export const useFabricContext = () => {
  const values = useContext(FabricContext);

  if (!values) throw new Error('batatatatatat');

  return values;
};
