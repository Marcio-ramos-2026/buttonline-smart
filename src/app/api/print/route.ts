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
  canvasWidth: number;
  canvasHeight: number;
}

const mmToPt = (mm: number) => mm * 2.83465
const mmToPx = (mm: number, dpi: number) => Math.round(mm * (dpi / 25.4))
const pxToMm = (px: number, dpi: number) => px * 25.4 / dpi
const pxToPt = (px: number, dpi: number) => px * (72/dpi)
function pxToPt2(px:number) {
  const pt = px * 0.75;
  return pt;
}


export async function POST(request: NextRequest) {
  const data: printRequest = await request.json()
  const {model_id, svg, dpi, canvasHeight, canvasWidth} = data

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

    // const element = createModel(model)

    // const Elementwidth = model.shape == 'circle' ? element.width / 2 : element.width
    // const Elementheight = model.shape == 'circle' ? element.height / 2 : element.height

    // const b =  sharp(Buffer.from(svg),{density:1000})
    // console.log('xxx',svg)

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(pageSizes[gabarito.pdf] as [number,number]); // Define canvas size (width x height)
    const { width, height } = page.getSize();

    const pngBuffer = await sharp(Buffer.from(svg),{density:1000})
      .png({quality:100})
      .toBuffer();
    const pngImage = await pdfDoc.embedPng(pngBuffer);     

    Object.values(gabarito.positions).forEach((p) => {
      
      page.drawImage(pngImage, {
        x: mmToPt(p.x),
        y: height - pxToPt2(canvasHeight) - mmToPt(p.y),
        width: pxToPt2(canvasWidth),
        height: pxToPt2(canvasHeight)
      });
    })

    pdfDoc.setTitle(model.name)
    pdfDoc.setAuthor("Cardenas - Buttonline")
    pdfDoc.setCreationDate(new Date())
    

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();


    // Return the PDF as a response
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename='${model.name}.pdf'`,
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