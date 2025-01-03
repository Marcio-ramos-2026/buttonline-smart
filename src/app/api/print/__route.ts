import { createModel, pageSizes } from "@/components/editor/model";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import { ModelConfig } from "@/components/editor/model";
import svgToPdf from 'svg-to-pdfkit';

interface printRequest  {
  model_id: number;
  svg: string;
}

const mmToPt = (mm: number) => mm * 2.83465;


export async function POST(request: NextRequest) {
  const data: printRequest = await request.json();
  const { model_id, svg } = data;

  const model = await prisma.editor_canvas.findFirst({
    where: {
      id: model_id,
    },
  });

  if (!model) {
    return NextResponse.json(
      { success: false, message: "Modelo não encontrado" },
      { status: 400 }
    );
  }

  const gabarito = model?.gabarito as ModelConfig["gabarito"];
  const element = createModel(model);
  element.scale(2)

  element.width = mmToPt(element.width)
  element.height = mmToPt(element.height)

  const viewBox = `0 0 ${element.width} ${element.height}`;
  const modelSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="${viewBox}">${element.toSVG()}</svg>`;
  const printSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="${viewBox}">${svg}</svg>`;
  try {
    // Create a new PDF document
    const doc = new PDFDocument({ size: pageSizes[gabarito.pdf],margin:0 });
    const buffers: Uint8Array[] = [];

    // Collect chunks emitted by the PDFKit stream
    doc.on("data", (chunk) => buffers.push(chunk));
    doc.on("end", () => console.log("PDF generation complete."));

    // Add the SVG to the PDF
    Object.values(gabarito.positions).forEach(p => {
      svgToPdf(doc, svg ? modelSVG : modelSVG, 0, 0, {
        width: element.width,
        height: element.height,
      })
    })

    doc.end();

    // Wait for the PDF to finish and concatenate the buffers
    const pdfBuffer = await new Promise<Buffer>((resolve, reject) => {
      doc.on("end", () => resolve(Buffer.concat(buffers)));
      doc.on("error", reject);
    });

    // Return the PDF as a response
    return new NextResponse(pdfBuffer, {
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
