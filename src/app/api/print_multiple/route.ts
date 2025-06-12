import { pageSizes } from "@/components/editor/model";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

interface printRequest {
  qty: number;
  svg: string;
  name: number;
  size: [string,string]
  button: string;
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
  const data: printRequest[] = await request.json(); // Expect an array

  const pageSize = pageSizes["A4"] as [number, number]
  const margin = 5; // Space between images in pt

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(pageSize);
    const { width, height } = page.getSize();

    let currentX = margin; // Starting x position
    let currentY = height - margin; // Starting y position with a top margin


    for (let i = 0; i < data.length; i++) {
      const obj = data[i];

      // Convert the SVG to PNG buffer
      // const pngBuffer = await sharp(Buffer.from(obj.svg), { density: 1000 })
      //   .png({ quality: 100 })
      //   .toBuffer();

       const base64Data = obj.button.split(',')[1];
      const pngBuffer = Buffer.from(base64Data, 'base64');
      let pngImage = await pdfDoc.embedPng(pngBuffer);

      // Image dimensions in points
      const imgWidth = mmToPt(parseInt(obj.size[0]));
      const imgHeight = mmToPt(parseInt(obj.size[1]));
     

      // Draw the image for the specified quantity (qty)
      for (let j = 0; j < obj.qty; j++) {

         
      if (currentX + imgWidth + margin > width) {
        currentX = 5; // Reset to left margin
        currentY -= imgHeight + margin; // Move down by the height of the image + margin (top-down direction)
      }

        page.drawImage(pngImage, {
          x: currentX,
          y: currentY - imgHeight,
          width: imgWidth,
          height: imgHeight
        });

        currentX += imgWidth + margin; // Move x to the right by the image width + margin
      }
    }
    
    

    // Set PDF metadata
    // pdfDoc.setTitle(model.name)
    pdfDoc.setAuthor("Cardenas - Buttonline")
    pdfDoc.setCreationDate(new Date())

    // Serialize the PDF to bytes
    const pdfBytes = await pdfDoc.save();

    // Return the PDF as a response
    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename='multiple.pdf'`,
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