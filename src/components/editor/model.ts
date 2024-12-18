import { editor_canvas } from "@prisma/client";
import * as fabric from "fabric";

export type ModelType = {
    [key: string]: () => fabric.Object;  // The key is a string and the value is a function returning an object
  };
export const getModels = (canvas: fabric.Canvas,model: editor_canvas):ModelType => {
    const maxSize = 800
    const canvasWidth = canvas.width || 0;
    const canvasHeight = canvas.height || 0;
    const maxRadius = Math.min(canvasWidth, canvasHeight, maxSize) * 0.5; 

    const shapes = Object.keys(model)
    .filter(key => /^object_\d+$/.test(key)) // Match keys starting with "object_" followed by digits
    .sort((a, b) => {
        // Extract numeric parts for comparison
        const numA = parseInt(a.split('_')[1], 10);
        const numB = parseInt(b.split('_')[1], 10);
        return numA - numB;
    })
    .map(key => model[key as keyof typeof model])


    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;


    return {
        'circle': () => {

            const createCircle = (radius:number,options: Partial<fabric.Circle> = {}) => {

                const scaleFactor = maxRadius / Number(shapes[0]);
                console.log('radius * scaleFactor',radius * scaleFactor)
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
          
            const elements = [createCircle(Number(shapes[0]))];
            elements.push(createCircle(Number(shapes[1]),{strokeDashArray:[5,5]}))
            elements.push(createCircle(Number(shapes[2]),{strokeWidth:1}))

            return new fabric.Group(elements,{
                selectable:false,
                moveCursor:'default',
                hoverCursor: 'default',
            })

        }
    }
}