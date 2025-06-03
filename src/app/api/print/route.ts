import { pageSizes } from "@/components/editor/model";
import { prisma } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";
import { PDFDocument, degrees, rgb, StandardFonts } from "pdf-lib";
// import sharp from 'sharp'
import { ModelConfig } from "@/components/editor/model";
import { getTranslations } from "next-intl/server";
import puppeteer from 'puppeteer' 
// import { writeFileSync } from "fs";

interface printRequest {
  model_id: number;
  svg: string;
  dpi: number;
  canvasWidth: number;
  canvasHeight: number;
}

const mmToPt = (mm: number) => parseFloat((mm * 2.83465).toFixed(5));

export async function svgToPngBuffer(svg: string): Promise<Buffer> {
  const browser = await puppeteer.launch({
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });
  const page = await browser.newPage();

  // Set initial viewport to something reasonable
  await page.setViewport({ width: 800, height: 600 });

  // Load the SVG inside HTML body without CSS scaling
  await page.setContent(`
    <!DOCTYPE html>
    <html>
      <body style="margin:0; padding:0;">
        ${svg}
      </body>
    </html>
  `);

  const svgHandle = await page.$('svg');
  if (!svgHandle) {
    await browser.close();
    throw new Error('SVG element not found');
  }

  // Get bounding box of SVG element (unscaled)
  const bbox = await svgHandle.boundingBox();
  if (!bbox) {
    await browser.close();
    throw new Error('Could not get bounding box of SVG');
  }

  const scale = 5;

  // Resize viewport to bbox scaled by scale factor
  await page.setViewport({
    width: Math.ceil(bbox.width * scale),
    height: Math.ceil(bbox.height * scale),
    deviceScaleFactor: 1,
  });

  // **IMPORTANT**: Set SVG element's width and height attributes scaled by 'scale' to match viewport
  await page.evaluate((width, height, scale) => {
    const svg = document.querySelector('svg');
    if (svg) {
      svg.setAttribute('width', `${width * scale}px`);
      svg.setAttribute('height', `${height * scale}px`);
      // Remove CSS scale transform if any
      svg.style.transform = '';
      svg.style.transformOrigin = '';
    }
  }, bbox.width, bbox.height, scale);

  // Take screenshot of entire viewport (which matches scaled SVG)
  const screenshotBuffer = await page.screenshot({
    omitBackground: true,
    clip: {
      x: 0,
      y: 0,
      width: Math.ceil(bbox.width * scale),
      height: Math.ceil(bbox.height * scale),
    }
  });

  await browser.close();

  return Buffer.from(screenshotBuffer);
}


export async function POST(request: NextRequest) {
  const data: printRequest = await request.json()
  const { model_id, svg } = data

  const tForm = await getTranslations("print");

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
  const orientation = gabarito.orientation ?? 'horizontal'

  let [modelWidth, modelHeight] = sizes as string[]
  if (!modelHeight) modelHeight = modelWidth

  const pageSize = pageSizes[gabarito.pdf] as [number, number]
  if (orientation === 'horizontal' && pageSize[1] > pageSize[0] ) {
    pageSize.reverse()
  }

  const line = gabarito.line ?? 'horizontal'

  let lines = gabarito.lines
  if(!lines) {
    if(line === 'horizontal'){
      lines = [
        {x:"lower",y:5},
        {x:"higher",y:5}
      ]
    }else{
      lines = [
        {x:5,y:"lower"},
        {x:5,y:"higher"}
      ]
    }
  }

  try {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage(pageSize); // Define canvas size (width x height)
    const { width, height } = page.getSize();

  
    const pngBuffer = await svgToPngBuffer(svg);

    const pngImage = await pdfDoc.embedPng(pngBuffer);


    let minX: number = 999,
    maxX: number = 0,
    minY: number = 999,
    maxY: number = 0
    Object.values(gabarito.positions).forEach(async (p) => {
      let imgWidth = mmToPt(parseFloat(modelWidth))
      let imgHeight = mmToPt(parseFloat(modelHeight))

      let x = mmToPt(p.x)
      let y = height - mmToPt(parseFloat(modelHeight)) - mmToPt(p.y)

      const rotate = p.rotate ?? 0


      if(p.x < minX) minX = p.x
      if(p.x + parseFloat(modelWidth) > maxX) maxX = p.x + parseFloat(modelWidth)

      if(p.y < minY) minY = p.y
      if(p.y + parseFloat(modelHeight) > maxY) maxY = p.y + parseFloat(modelHeight)

      if (rotate == -90) {
        y += imgHeight
        
        maxX = p.x + parseFloat(modelHeight)
        maxY = p.y + parseFloat(modelWidth)
      }
    
      page.drawImage(pngImage, {
        x: x,
        y: y,
        width: imgWidth,
        height: imgHeight,
        rotate: degrees(rotate)
      });
    });
    

    if (line) {
      const centerX = width / 2;
      const centerY = height / 2;
    
      const lineLength = (orientation === 'horizontal' ? height : width) * 0.9;
      const halfLine = lineLength / 2;

      const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
      const fontSize = 10
      const warningText = tForm('middle_line')
      const warningTextWidth = font.widthOfTextAtSize(warningText,fontSize)
    
      if (line === 'horizontal') {
        // Horizontal line centered on page
        page.drawLine({
          start: { x: centerX - halfLine, y: centerY },
          end: { x: centerX + halfLine, y: centerY },
          thickness: 1,
          color: rgb(0, 0, 0),
        });
      

        page.drawText(warningText, {
          x: centerX - warningTextWidth / 2,
          y: centerY + 5, 
          size: fontSize,
          font,
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

        page.drawText(warningText, {
          x: centerX + 8,
          y: centerY - warningTextWidth / 2,
          size: fontSize,
          font,
          rotate: degrees(90),
          color: rgb(0, 0, 0),
        });

      }
    }

    for (let i = 0; i < lines.length; i++) {
      const { x: rawX, y: rawY } = lines[i];
    
      let x: number;
      if (rawX === 'lower') x = minX - 1;
      else if (rawX === 'higher') x = maxX + 1;
      else x = rawX ?? 5;
    
      let y: number;
      if (rawY === 'lower') y = minY - 1;
      else if (rawY === 'higher') y = maxY + 1;
      else y = rawY ?? 5;
    
      const start = line === 'vertical'
        ? { x: mmToPt(x), y: height - mmToPt(y) }
        : { x: mmToPt(x), y: height - mmToPt(y) };
    
      const end = line === 'vertical'
        ? { x: width - mmToPt(x), y: height - mmToPt(y) }
        : { x: mmToPt(x), y: mmToPt(0) };
    
      page.drawLine({
        start,
        end,
        thickness: 1,
        color: rgb(0, 0, 0),
      });
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