import { editor_canvas } from "@prisma/client";
import * as fabric from "fabric";

export type ModelType = {
    [key: string]: () => fabric.Object;  // The key is a string and the value is a function returning an object
  };
export const getModels = (canvas: fabric.Canvas,model: editor_canvas):ModelType => {
    const maxSize = 800 // limite máximo do editor
    const canvasWidth = canvas.width || 0;
    const canvasHeight = canvas.height || 0;
    const maxRadius = Math.min(canvasWidth, canvasHeight, maxSize) * 0.5; //determina o max radius entre o limite máximo do editor e o tamanho da tela


    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;


    return {
        'circle': () => {

            const createCircle = (radius:number,options: Partial<fabric.Circle> = {}) => {
                const scaleFactor = maxRadius / Number(model.object_1);
                return new fabric.Circle({
                    radius:radius * scaleFactor,
                    fill:'white',
                    stroke:'#000',
                    strokeWidth:4,
                    selectable:false,
                    moveCursor:'default',
                    top: centerY,
                    left: centerX,
                    originX: 'center',
                    originY: 'center',
                    hoverCursor: 'default',
                    ...options
                })
            }
          
            const elements = [createCircle(Number(model.object_1))];
            elements.push(createCircle(Number(model.object_2),{strokeDashArray:[5,5]}))
            elements.push(createCircle(Number(model.object_3),{strokeWidth:1}))

            return new fabric.Group(elements,{
                selectable:false,
                moveCursor:'default',
                hoverCursor: 'default',
            })

        }
    }
}