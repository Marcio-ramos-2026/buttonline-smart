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
import { extractCardenasCanvas } from "./test";


export const PrintButton = ({
  canvas,
  currentModel,
}: {
  canvas: fabric.Canvas;
  currentModel: editor_canvas;
}) => {
  const [printing, setPrinting] = useState(false)

  const handlePrint = async () => {
    if (!currentModel || !currentModel.size) {
      alert("Configuração errada");
      return;
    }
  
    setPrinting(true);
  
    let [width, height] = currentModel.size.split(",");
    if (!height) height = width;
  
    if (!canvas) return;
  
    const canvasWidth = fabric.util.parseUnit(`${width}mm`);
    const canvasHeight = fabric.util.parseUnit(`${height}mm`);
  
    const originalCanvas = await canvas.clone(["cardenas_print", "cardenas_canvas","cardenas_mark"]);
    const svg = await extractCardenasCanvas(originalCanvas,Number(width),Number(height))

    // Step 8: Send to server
    fetch("/api/print", {
      method: "POST",
      body: JSON.stringify({
        svg,
        model_id: currentModel.id,
        canvasWidth,
        canvasHeight,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(blob);
        const printTAB = window.open(url, "_blank");
        if (!printTAB?.document) return;
  
        const style = printTAB.document.createElement("style");
        style.textContent = `
          @page {
            size: A3 landscape;
            margin: 0;
          }
        `;
        printTAB.document.head.appendChild(style);
  
        setTimeout(() => {
          printTAB.print();
        }, 200);
      })
      .catch((error) => {
        console.error("Error fetching the PDF:", error);
      })
      .finally(() => setPrinting(false));
  };
  

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
