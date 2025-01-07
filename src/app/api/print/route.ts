import { createModel, pageSizes } from "@/components/editor/model";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";
import sharp from 'sharp'
import { ModelConfig } from "@/components/editor/model";

interface printRequest  {
  model_id: number;
  svg: string;
  dpi: number;
}

const mmToPt = (mm: number) => mm * 2.83465;

export async function POST(request: NextRequest) {
  const data: printRequest = await request.json()
  const {model_id, svg, dpi} = data

    const model = await prisma.editor_canvas.findFirst(({
        where: {
            id:model_id
        }
    }))

    if(!model){
      return NextResponse.json(
        { success: false, message: "Modelo não encontrando" },
        { status: 400 }
      );
    }
    

    
    const gabarito = model?.gabarito as ModelConfig["gabarito"]
    const config = model?.config as ModelConfig

    // Object.keys(config.objects).forEach((name)=>{
    //   const obj = config.objects[name]

    //   if ('radius' in obj && obj.radius) obj.radius = mmToPt(obj.radius)

    //   if('width' in obj && obj.width) obj.width = mmToPt(obj.width)

    //   if('height' in obj && obj.height) obj.width = mmToPt(obj.height)

    //   config.objects[name] = obj
    // })


    const element = createModel(model)

    console.log('before',element.width)

    // element.width = pixelsToPoints(dpi,element.width/2)
    // element.height = pixelsToPoints(dpi,element.height/2)

    const viewBox = `${-element.width / 2} ${-element.height / 2} ${element.width} ${element.height}`;
    const modelSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="${viewBox}">${element.toSVG()}</svg>`;
    const printSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="${viewBox}">${svg}</svg>`;

    console.log("a",printSVG)
  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(pageSizes[gabarito.pdf] as [number,number]); // Define canvas size (width x height)
    const { width, height } = page.getSize();

    const pngBuffer = await sharp(Buffer.from(svg ? svg : modelSVG),{density:1000})
      // .resize(element.width,element.height)
      .png({quality:100})
      .toBuffer();
    const pngImage = await pdfDoc.embedPng(pngBuffer);

    const pngA = await sharp(Buffer.from(modelSVG),{density:1000})
      // .resize(element.width,element.height)
      .png({quality:100})
      .toBuffer();
    const pngImage2 = await pdfDoc.embedPng(pngA);
    
    

    Object.values(gabarito.positions).forEach((p,k) => {
      
      page.drawImage( k == 1 ? pngImage2 : pngImage, {
        x: mmToPt(p.x),
        y: height - pixelsToPoints(dpi,element.height) - mmToPt(p.y),
        width: pixelsToPoints(dpi,element.width/2),
        height: pixelsToPoints(dpi,element.height/2)
      });
    })


    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a response
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": "inline; filename='document.pdf'", // Open the PDF in the browser
      },
    });
  } catch (error) {
    console.error("Error generating PDF:", error);

    return NextResponse.json(
      { success: false, message: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}


function pixelsToPoints(dpi: number,pixels: number) {
  const inches = pixels / dpi; // Convert pixels to inches
  const points = inches * 72; // Convert inches to points (1 inch = 72 points)
  return points;
}