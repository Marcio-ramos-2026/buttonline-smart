import * as fabric from "fabric";

export type ModelType = {
    [key: string]: () => fabric.Object;  // The key is a string and the value is a function returning an object
  };
export const getModels = (canvas: fabric.Canvas):ModelType => {
    return {
        'circle': () => {
            let radius = (canvas.height*0.6) / 2
            if(radius >= 800) radius = 800

            const centerX = canvas.width / 2;
            const centerY = canvas.height / 2;

            const first = new fabric.Circle({
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

            return new fabric.Group([first],{
                selectable:false,
                moveCursor:'default',
                hoverCursor: 'default',
            })


        }
    }
}