import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Printer } from "lucide-react";
import * as fabric from "fabric";
import type { editor_canvas } from "@prisma/client";
import { useState } from "react";
import { ButtonItemMultiple } from "../multiple/multiple";
import { sign } from "crypto";


export const PrintButton = ({
  canvas,
  currentModel,
}: {
  canvas: fabric.Canvas;
  currentModel: editor_canvas;
}) => {
  const [printing, setPrinting] = useState(false)

  const handlePrint = async () => {
    if(!currentModel || !currentModel.size){
      alert('Configuração errada')
      return
    }

    setPrinting(true)

    let [width,height] = currentModel.size.split(',') 
    if(!height) height = width

    if (!canvas) return;
    const canvasWidth = fabric.util.parseUnit(`${width}mm`)
    const canvasHeight = fabric.util.parseUnit(`${height}mm`)

    const dpi = getScreenDPI();

    const cardenasCanvas = await canvas.clone(["cardenas_print","cardenas_canvas"])

    cardenasCanvas.getObjects().forEach((obj) => {
      if (obj.type === "image") {
        const image = obj as fabric.Image;
        const imageElement = image.getElement() as HTMLImageElement;
    
        // Get the file extension from the image src (for determining format)
        const url = new URL(imageElement.src);
        const pathname = url.pathname;
        const extension = pathname.split(".").pop()?.toLowerCase();
    
        // Determine the format based on the extension (JPEG or PNG)
        const isJpeg = extension === "jpg" || extension === "jpeg";
    
        // Create an offscreen canvas
        const offscreenCanvas = document.createElement("canvas");
        const ctx = offscreenCanvas.getContext("2d");
    
        if (ctx) {
          // Use the image's natural width and height
          offscreenCanvas.width = imageElement.naturalWidth;
          offscreenCanvas.height = imageElement.naturalHeight;
    
          // Draw the image on the offscreen canvas
          ctx.drawImage(imageElement, 0, 0, offscreenCanvas.width, offscreenCanvas.height);
    
          // Convert the canvas to base64 with the chosen format (JPEG or PNG)
          const base64 = offscreenCanvas.toDataURL(
            isJpeg ? "image/jpeg" : "image/png",
            1 // Maximum quality for JPEG
          );
    
          // Set the base64 as the image's src
          imageElement.src = base64;
    
          // Update the fabric image object
          image.set({
            element: imageElement,
          });
    
          // Optionally, replace the image object in the canvas (if necessary)
          obj = image;
        }
      }
      // Check if the object has the 'cardenas_canvas' property and is a group
      if (!obj.cardenas_canvas) return;
    
      const canvasGroup = obj as fabric.Group 

      cardenasCanvas.bringObjectToFront(canvasGroup);

      // Use forEachObject to iterate through the objects inside the group

      canvasGroup.getObjects().forEach((groupObj) => {
        groupObj.fill = 'transparent'
        groupObj.backgroundColor = 'transparent'

        if(groupObj.cardenas_print) return
        
        canvasGroup.remove(groupObj);
        cardenasCanvas.remove(groupObj)
      });      
      
    });
    
    const canvasElement = cardenasCanvas.getObjects().filter(obj => obj.cardenas_canvas)
    const clip = new fabric.Group(canvasElement);
    const scaleFactor = canvasWidth / Math.max(clip.width, clip.height);
    clip.scale(scaleFactor)

    const editorElements = cardenasCanvas.getObjects().filter(obj => !obj.cardenas_canvas)
    const elementsGroup = new fabric.Group(editorElements)
    const originalCanvasSize = Math.max(clip.width, clip.height);

    const editorScaleFactor = canvasWidth / originalCanvasSize;

    elementsGroup.scale(editorScaleFactor);

    // clip.absolutePositioned = true;
    const printCanvas = new fabric.Canvas("c", {
      width: canvasWidth,
      height: canvasHeight,
    })

    printCanvas.add(elementsGroup)
    printCanvas.add(clip)
    printCanvas.centerObject(clip)
    printCanvas.clipPath = clip


    console.log('SVG',printCanvas.toSVG())
    
    fetch("/api/print", {
      method: "POST",
      body: JSON.stringify({
        svg: printCanvas.toSVG(),
        model_id: currentModel.id,
        dpi,
        canvasWidth,
        canvasHeight
      }), // Send any necessary data for PDF generation
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.blob()) // Get the response as a Blob (binary data)
      .then((blob) => {
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Open the PDF in a new tab
        const printTAB = window.open(url, "_blank");
        if(!printTAB?.document) return

        const style = printTAB.document.createElement("style");

        style.textContent = `
              @page {
                size: A3 landscape;
                margin: 0;
                size: landscape;
              }
        `;
        
        printTAB.document.head.appendChild(style);
        setTimeout(() => {
          printTAB.print();
        }, 200);
        
      })
      .catch((error) => {
        console.error("Error fetching the PDF:", error);
      }).finally(()=> setPrinting(false));
  }

  const handlePrintMultiple = async () => {
    const storedButtons = localStorage.getItem("cardenas_multiple_buttons");
    if (!storedButtons){
      alert('Nenhum múltiplo salvo')
      return
    }

    setPrinting(true)

    const parsedButtons = JSON.parse(storedButtons) as ButtonItemMultiple[];

    let bodyButtons = await Promise.all(parsedButtons.map(async (button) => {

      let [width,height] = button.size
      if(!height) height = width

      return {
        size: button.size,
        name: button.name,
        qty: button.qty,
        svg: button.svg
      }
    }))


    fetch("/api/print_multiple", {
      method: "POST",
      body: JSON.stringify(bodyButtons), // Send any necessary data for PDF generation
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.blob()) // Get the response as a Blob (binary data)
      .then((blob) => {
        // Create a URL for the Blob
        const url = window.URL.createObjectURL(blob);

        // Open the PDF in a new tab
        const printTAB = window.open(url, "_blank");
        if(!printTAB?.document) return


        printTAB.print();
        
      })
      .catch((error) => {
        console.error("Error fetching the PDF:", error);
      }).finally(()=> setPrinting(false))
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button icon={<Printer />}></Button>
      </DialogTrigger>
      <DialogContent className="min-w-fit">
        <DialogHeader>
          <DialogTitle>Aviso</DialogTitle>
        </DialogHeader>
        <div className="px-6 py-4 space-y-2">
          <p>
            Nesta opção de impressão você usará o nosso gabarito, portanto toda
            a folha será preenchida com este button. A partir de 100 unidade é
            possível imprimir na nossa gráfica e recebê-los já cortados! Saiba
            mais através do email{" "}
            <span className="underline">comercial3@kitbutton.com.br</span>
          </p>
          <p>
            Você quer imprimir apenas alguns buttons? Use a opção
            &quot;Múltiplos Buttons&quot; no canto superior direito da tela.
          </p>

          <div className="pt-8 px-4 flex gap-10 justify-between">
            <Button
              size="default"
              iconPlacement="start"
              icon={<Printer />}
              variant="outline"
              onClick={handlePrint}
              disabled={printing}
              loading={printing}
            >
              Imprimir usando gabarito
            </Button>
            <Button
              size="default"
              iconPlacement="start"
              icon={<Printer />}
              onClick={handlePrintMultiple}
              disabled={printing}
              loading={printing}
            >
              Usar &quot;Múltiplos Buttons&quot;
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

function getScreenDPI() {
  const div = document.createElement("div");
  div.style.width = "1in"; // 1 inch in CSS units
  div.style.height = "1in";
  div.style.position = "absolute";
  div.style.visibility = "hidden";
  document.body.appendChild(div);

  const dpi = div.offsetWidth; // The number of pixels in 1 inch
  document.body.removeChild(div);

  return dpi;
}
