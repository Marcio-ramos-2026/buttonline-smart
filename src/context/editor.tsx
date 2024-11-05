"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  RefObject,
} from "react";
import * as fabric from "fabric";

import {useResizeObserver} from "@/hooks/useResizeObserver";

import resolveConfig from 'tailwindcss/resolveConfig'
import tailwindConfig from '../../tailwind.config'
import { useDebounceCallback } from "@/hooks/useDebounceCallback";

const {theme} = resolveConfig(tailwindConfig)


type IEditorProvider = {
  children: React.ReactNode;
};

type IEditorContext = {
  canvas: fabric.Canvas | null;
  canvasEl: RefObject<HTMLCanvasElement>;
  clip: () =>  void
};

const FabricContext = createContext<IEditorContext | null>(null);

const getClip = (canvas: fabric.Canvas) => {
  const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

  return new fabric.Circle({
    radius: fabric.util.parseUnit('65mm'),
    // width: fabric.util.parseUnit('65mm'),
    // height: fabric.util.parseUnit('65mm'),
    fill:'transparent',
    stroke:'#000',
    strokeWidth:4,
    
    selectable:false,
    moveCursor:'default',
    top: centerY,
    left: centerX,
    originX: 'center',
    originY: 'center',

  })
}

export default function FabricContextProvider({ children }: IEditorProvider) {
  const [canvas, setcanvas] = useState<fabric.Canvas | null>(null);

  const canvasEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasEl.current) return;

    // Create a new fabric.Canvas with proper width/height adjustments
    const canvasInstance = new fabric.Canvas(canvasEl.current, {backgroundColor:theme.colors.gray[100]});

    // Set the canvas dimensions directly on the fabric canvas instance
    // canvasInstance.setDimensions({ width: '100%', height: '100%' },{cssOnly: true});
    canvasInstance.renderAll()
    const centerX = canvasInstance.width / 2;
    const centerY = canvasInstance.height / 2;

    const circle = new fabric.Circle({
        radius: 50,
        // width: fabric.util.parseUnit('65mm'),
        // height: fabric.util.parseUnit('65mm'),
        fill:'transparent',
        stroke:'#000',
        strokeWidth:4,
        
        
        selectable:false,
        moveCursor:'default',
        top: centerY,
        left: centerX,
        originX: 'center',
        originY: 'center',
  
      })

    // canvasInstance.clipPath = getClip(canvasInstance);

    canvasInstance.add(circle)

    // Make the fabric.Canvas instance available to your app if needed
    setcanvas(canvasInstance);

    // Clean up on component unmount
    return () => {
      // setcanvas(null);
      canvasInstance.dispose();
    };
  }, []);

  const clip = () => {
    if (canvas?.clipPath){
      canvas.clipPath = undefined
      canvas.renderAll()
      return
    }

    if(canvas){
      canvas.clipPath = getClip(canvas)
      canvas.renderAll()
    }
  }

  return (
    <FabricContext.Provider value={{ canvas: canvas, clip: clip, canvasEl:canvasEl }}>
      {children}
    </FabricContext.Provider>
  );
}

export const useEditorContext = () => {
  const values = useContext(FabricContext);

  if (!values) throw new Error('batatatatatat');

  return values;
};

export const RenderCanvas = () => {
    const { canvasEl,canvas } = useEditorContext()
    const containerRef = useRef<HTMLDivElement>(null)

    const [{ width, height }, setSize] = useState<{width?: number; height?: number}>({
      width: undefined,
      height: undefined,
    })
  
    const onResize = useDebounceCallback(setSize, 200)

    useEffect(()=>{
      if(!canvas) return
      if(!height || !width) return
      canvas.setDimensions({width:width,height:height})
    },[width,height,canvas])
  
    useResizeObserver({
      ref: containerRef,
      onResize,
    })

    return (
        <div ref={containerRef} className="bg-black h-full w-full">
            <canvas ref={canvasEl} />
        </div>
    )
}