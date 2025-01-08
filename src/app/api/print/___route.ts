import { createModel, pageSizes } from "@/components/editor/model";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import PDFDocument from "pdfkit";
import sharp from "sharp";
import { ModelConfig } from "@/components/editor/model";

interface printRequest {
  model_id: number;
  svg: string;
  dpi: number;
}

export async function POST(request: NextRequest) {
  const data: printRequest = await request.json();
  const { model_id, svg, dpi } = data;

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
  const config = model?.config as ModelConfig;

  const element = createModel(model);

  console.log("before", element.width);

  const viewBox = `${-element.width / 2} ${-element.height / 2} ${element.width} ${element.height}`;
  const modelSVG = `<svg xmlns="http://www.w3.org/2000/svg" width="${element.width}" height="${element.height}" viewBox="${viewBox}">${element.toSVG()}</svg>`;

  try {
    // Create a new PDF document using pdfkit
    const doc = new PDFDocument({
      size: [210, 297], // A4 size in mm (width x height)
      margin: 15,       // Margin in mm
      
    });

    // Set up a writable stream to handle the PDF output
    const pdfChunks: Buffer[] = [];
    doc.on("data", (chunk) => pdfChunks.push(chunk));

    
    // Generate PNG buffer from SVG (using sharp)
    const pngBuffer = await sharp(Buffer.from(svg ? modelSVG : modelSVG), { density: 1000 })
      .png({ quality: 100 })
      .toBuffer();

    // Draw the image on the PDF page
    // Object.values(gabarito.positions).forEach((p, k) => {
    //   // Draw the first image at specified position
    //   doc.image(pngBuffer, p.x, p.y, {
    //     width: element.width,
    //     height: element.height,
    //   });
    // });

    // Finalize the PDF document
    doc.end();

    const pdfBuffer = Buffer.concat(pdfChunks);
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
