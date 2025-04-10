import { pageSizes } from "@/components/editor/model";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, degrees, rgb } from "pdf-lib";
import sharp from 'sharp'
import { ModelConfig } from "@/components/editor/model";

interface printRequest {
  model_id: number;
  svg: string;
  dpi: number;
  canvasWidth: number;
  canvasHeight: number;
}

const mmToPt = (mm: number) => parseFloat((mm * 2.83465).toFixed(5));

export async function POST(request: NextRequest) {
  const data: printRequest = await request.json()
  const { model_id, svg } = data

  const model = await prisma.editor_canvas.findFirst({
    where: {
      id: model_id
    }
  })

  if (!model) {
    return NextResponse.json(
      { success: false, message: "Modelo não encontrando" },
      { status: 400 }
    );
  }

  const gabarito = model?.gabarito as ModelConfig["gabarito"]
  const sizes = model.size?.split(",")
  const orientation = gabarito.orientation ?? 'vertical'

  let [modelWidth, modelHeight] = sizes as string[]
  if (!modelHeight) modelHeight = modelWidth

  const pageSize = pageSizes[gabarito.pdf] as [number, number]
  if (orientation === 'horizontal' && pageSize[1] > pageSize[0] ) {
    pageSize.reverse()
  }

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(pageSize); // Define canvas size (width x height)
    const { width, height } = page.getSize();

    const pngBuffer = await sharp(Buffer.from(svg), { density: 1000 })
      .png({ quality: 100 })
      .toBuffer();
    let pngImage = await pdfDoc.embedPng(pngBuffer);

    
    Object.values(gabarito.positions).forEach(async (p) => {
      let imgWidth = mmToPt(parseFloat(modelWidth))
      let imgHeight = mmToPt(parseFloat(modelHeight))

      let x = mmToPt(p.x)
      let y = height - mmToPt(parseFloat(modelHeight)) - mmToPt(p.y)

      const rotate = p.rotate ?? 0

      if (rotate == -90) {
        y += imgHeight
      }
    
      page.drawImage(pngImage, {
        x: x,
        y: y,
        width: imgWidth,
        height: imgHeight,
        rotate: degrees(rotate)
      });
    });
    

    if (true) {
      const centerX = width / 2;
      const centerY = height / 2;
    
      const lineLength = (orientation === 'horizontal' ? height : width) * 0.9;
      const halfLine = lineLength / 2;
    
      if (orientation === 'vertical') {
        // Horizontal line centered on page
        page.drawLine({
          start: { x: centerX - halfLine, y: centerY },
          end: { x: centerX + halfLine, y: centerY },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      } else {
        // Vertical line centered on page
        page.drawLine({
          start: { x: centerX, y: centerY - halfLine },
          end: { x: centerX, y: centerY + halfLine },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      }
    }
    
    
    

    // Set PDF metadata
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