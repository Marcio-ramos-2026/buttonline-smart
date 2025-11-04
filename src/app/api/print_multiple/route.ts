import { pageSizes } from "@/components/editor/model";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument } from "pdf-lib";

interface printRequest {
  qty: number;
  svg: string;
  name: number;
  size: [string, string];
  button: string;
}

const mmToPt = (mm: number) => parseFloat((mm * 2.83465).toFixed(5));

export async function POST(request: NextRequest) {
  const data: printRequest[] = await request.json(); // Expect an array

  const pageSize = pageSizes["A4"] as [number, number];
  const margin = 5; // Space between images in pt

  try {
    const pdfDoc = await PDFDocument.create();

    let page = pdfDoc.addPage(pageSize);
    let { width, height } = page.getSize();

    let currentX = margin;
    let currentY = height - margin;

    for (let i = 0; i < data.length; i++) {
      const obj = data[i];

      const base64Data = obj.button.split(",")[1];
      const pngBuffer = Buffer.from(base64Data, "base64");
      const pngImage = await pdfDoc.embedPng(pngBuffer);

      const imgWidth = mmToPt(parseInt(obj.size[0]));
      const imgHeight = mmToPt(parseInt(obj.size[1]));

      for (let j = 0; j < obj.qty; j++) {
        // Check horizontal overflow
        if (currentX + imgWidth + margin > width) {
          currentX = margin;
          currentY -= imgHeight + margin;
        }

        // Check vertical overflow — if next image goes below page bottom
        if (currentY - imgHeight - margin < 0) {
          // Create a new page
          page = pdfDoc.addPage(pageSize);
          ({ width, height } = page.getSize());
          currentX = margin;
          currentY = height - margin;
        }

        // Draw the image
        page.drawImage(pngImage, {
          x: currentX,
          y: currentY - imgHeight,
          width: imgWidth,
          height: imgHeight,
        });

        // Move to next position
        currentX += imgWidth + margin;
      }
    }

    pdfDoc.setAuthor("Cardenas - Buttonline");
    pdfDoc.setCreationDate(new Date());

    const pdfBytes = await pdfDoc.save();

    return new NextResponse(pdfBytes, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="multiple.pdf"`,
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
