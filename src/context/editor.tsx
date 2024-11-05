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

    let radius = (canvas.height*0.6) / 2
    if(radius >= 800) radius = 800

  return new fabric.Circle({
    radius:radius,
    fill:'white',
    stroke:'#000',
    strokeWidth:4,
    
    selectable:false,
    moveCursor:'default',
    top: centerY,
    left: centerX,
    originX: 'center',
    originY: 'center',
    hoverCursor: 'default'

  })
}

export default function FabricContextProvider({ children }: IEditorProvider) {
  const [canvas, setcanvas] = useState<fabric.Canvas | null>(null);

  const canvasEl = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!canvasEl.current) return;
    
    // Create a new fabric.Canvas with proper width/height adjustments
    const canvasInstance = new fabric.Canvas(canvasEl.current, {backgroundColor:theme.colors.gray[100],})

    // Make the fabric.Canvas instance available to your app if needed
    setcanvas(canvasInstance);

    // canvasInstance.on('mouse:wheel', function(opt) {
    //   var delta = opt.e.deltaY;
    //   var zoom = canvasInstance.getZoom();
    //   zoom *= 0.999 ** delta;
    //   if (zoom > 20) zoom = 20;
    //   if (zoom < 0.01) zoom = 0.01;
    //   canvasInstance.setZoom(zoom);
    //   opt.e.preventDefault();
    //   opt.e.stopPropagation();
    // })

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

    const rectBound = containerRef.current?.getBoundingClientRect()
    const {width = rectBound?.width ?? 0, height = rectBound?.height ?? 0} = useResizeObserver({
      ref: containerRef
    })
    
    useEffect(()=>{
      if(!canvas) return
      if(!height || !width) return
      canvas.setDimensions({width:width,height:height})
    },[canvas,height,width])

    useEffect(()=>{
      if(!canvas) return
      const clip = getClip(canvas)

      canvas.add(clip)
      canvas.renderAll()
    },[canvas])

    return (
        <div ref={containerRef} className="bg-gray-100 h-full w-full">
            <canvas ref={canvasEl} />
        </div>
    )
}