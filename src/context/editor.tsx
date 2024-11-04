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
    const canvasInstance = new fabric.Canvas(canvasEl.current, {backgroundColor:'blue'});

    // Set the canvas dimensions directly on the fabric canvas instance
    // canvasInstance.setDimensions({ width: 800, height: 600 });
    const centerX = canvasInstance.width / 2;
    const centerY = canvasInstance.height / 2;

    const circle = new fabric.Circle({
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
    const { canvasEl, canvas } = useEditorContext()

    useEffect(()=>{
        if(!window) return
        if(!canvas) return
        if(!canvasEl) return

        const resize = () => {
            
            // canvasEl.current?.setAttribute('display','none')
            const canvasParent = canvasEl.current?.parentElement?.parentElement
            const rect = canvasParent?.getBoundingClientRect()
            if(!rect) return
            
            console.log('canvasParent',canvasParent)
            // console.log('canvasParent',canvasParent,{width:rect.width,height:rect.height})
            // canvasEl.current?.removeAttribute('display')
            canvas.setDimensions({width:rect.width,height:rect.height})
            // canvas.renderAll()
        }

        resize()
        const onResize = () => {
            resize()
        }

        window.addEventListener('resize',onResize)

        return ()=>{
            window.removeEventListener('resize',onResize)
        }
    },[canvas])

    return (<canvas ref={canvasEl} />)
}