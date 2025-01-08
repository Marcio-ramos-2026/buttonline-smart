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

const mmToPt = (mm: number) => mm * 2.83465
const mmToPx = (mm: number, dpi: number) => Math.round(mm * (dpi / 25.4))
const pxToMm = (px: number, dpi: number) => px * 25.4 / dpi
const pxToPt = (px: number, dpi: number) => px * (72/dpi)


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

    const element = createModel(model)

    const viewBox = `${-element.width / 2} ${-element.height / 2} ${element.width} ${element.height}`;
    const modelSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="${viewBox}">${element.toSVG()}</svg>`;

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(pageSizes[gabarito.pdf] as [number,number]); // Define canvas size (width x height)
    const { width, height } = page.getSize();

    const pngBuffer = await sharp(Buffer.from(svg ? svg : modelSVG),{density:1000})
      // .resize(pxToMm(element.width,dpi),pxToMm(element.height,dpi))
      .png({quality:100})
      .toBuffer();
    const pngImage = await pdfDoc.embedPng(pngBuffer);    

    Object.values(gabarito.positions).forEach((p,k) => {
      
      page.drawImage(pngImage, {
        x: mmToPt(p.x),
        y: height - pxToPt(element.height/2,dpi) - mmToPt(p.y),
        // width: pxToPt(element.width/2,dpi,),
        // height: pxToPt(element.height/2,dpi)
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