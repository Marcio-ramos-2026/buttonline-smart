import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import sharp from 'sharp'

import * as fabric from "fabric";
    type ModelConfig = {
    objects: ShapeCollection;
    gabarito: gabarito
  };

  type gabarito = {
    pdf: keyof typeof pageSizes,
    positions: Record<string,{x:number,y:number}>
  }
  type shapeRectangle = {
    type: string;
    width: number;
    height: number;
    strokeWidth?: number;
    strokeDashArray?: [number, number];
    radius?: number;
  };
  
  type shapeEllipse = {
    type: string;
    width: number;
    height: number;
    strokeWidth?: number;
    strokeDashArray?: [number, number];
  };
  
  type Shapes = shapeCircle | shapeEllipse;
  
  type ShapeCollection = Record<string, Shapes>;

  const pageSizes = {
    'A4': [595.44, 841.68], // A4 size in points
    'Letter': [612, 792],    // Letter size in points
  };

export async function GET(request: NextRequest) {
    const model = await prisma.editor_canvas.findFirst(({
        where: {
            id:1
        }
    }))

    const config = model?.config as ModelConfig
    const gabarito = model?.gabarito as gabarito

    const element = Object.values(config.objects).map(obj => {
        return circle(obj as shapeCircle)
    }).reduce((acc,shape) => {
        acc.add(shape)
        return acc
    }, new fabric.Group)

    const viewBox = `${-element.width / 2} ${-element.height / 2} ${element.width} ${element.height}`;
    const completeSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="${viewBox}">${element.toSVG()}</svg>`;

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(pageSizes[gabarito.pdf] as [number,number]); // Define canvas size (width x height)
    const { width, height } = page.getSize();

    const pngBuffer = await sharp(Buffer.from(completeSvg))
      .resize(element.width,element.height,{fit:'contain',kernel: "lanczos3"})
      .png({quality:100,compressionLevel:0})
      .toBuffer();
    const pngImage = await pdfDoc.embedPng(pngBuffer);
    

    Object.values(gabarito.positions).forEach(p => {
      page.drawImage(pngImage, {
        x: p.x,
        y: height - element.height - p.y,
        width: element.width,
        height: element.height
      });
    })


    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a response
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate PDF" },
      { status: 500 }
    );
  }

    // return NextResponse.json(
    //   { success: true, message: "Failed to generate PDF" },
    //   { status: 200 }
    // );
}

type shapeCircle = {
    type: string;
    radius: number;
    strokeWidth?: number;
    strokeDashArray?: [number, number];
  };
  

//   // Function to export the object to PNG without DOM
// const exportObjectToPNG = async (fabricObject: fabric.FabricObject) => {
//   // Set up a virtual canvas
//   const objectWidth = fabricObject.width * fabricObject.scaleX;
//   const objectHeight = fabricObject.height * fabricObject.scaleY;
//   const canvas = fabric.createCanvasForNode(objectWidth, objectHeight);

//   // Adjust the object and add it to the virtual canvas
//   fabricObject.clone((clonedObject) => {
//     clonedObject.left = 0;
//     clonedObject.top = 0;
//     canvas.add(clonedObject);
//     canvas.renderAll();

//     // Export to PNG as a Buffer
//     const out = canvas.toDataURL('image/png');

//     // Save the PNG buffer or return it
//     console.log(out); // Logs the Base64 data URL of the image
//   });
// };

const circle = (config: shapeCircle) => {
  return new fabric.Circle({
    radius: config.radius,
    fill: "white",
    stroke: "#000",
    strokeWidth: config?.strokeWidth ?? 4,
    strokeDashArray: config?.strokeDashArray ?? [0, 0],
    selectable: false,
    moveCursor: "default",
    originX: "center",
    originY: "center",
    hoverCursor: "default",
  });
};

