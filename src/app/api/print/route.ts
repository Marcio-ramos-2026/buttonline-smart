import { createModel, pageSizes } from "@/components/editor/model";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, Degrees, degrees } from "pdf-lib";
import sharp from 'sharp'
import { ModelConfig } from "@/components/editor/model";

interface printRequest  {
  model_id: number;
  svg: string;
  dpi: number;
  canvasWidth: number;
  canvasHeight: number;
}

const mmToPt2 = (mm: number) => mm * 2.83465
const mmToPt = (mm: number) => parseFloat((mm * 2.83465).toFixed(5));
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
    const sizes = model.size?.split(",")
    const orientation = gabarito.orientation ?? 'vertical'

    let [modelWidth, modelHeight] = sizes as string[]
    if(!modelHeight) modelHeight = modelWidth

    const pageSize = pageSizes[gabarito.pdf] as [number,number]
    if(orientation === 'horizontal'){
      pageSize.reverse()
    }

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
        y: height - mmToPt(parseFloat(modelHeight)) - mmToPt(p.y),
        width: mmToPt(parseFloat(modelWidth)),
        height: mmToPt(parseFloat(modelHeight)),
        // rotate: degrees(p.rotate ?? 0)
      });
    })

    page.drawLine({
      thickness: 2,
      end:{x:0,y:20},
      start: {x: 20, y:20}
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