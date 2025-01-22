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

export const PrintButton = ({
  canvas,
  currentModel,
}: {
  canvas: fabric.Canvas;
  currentModel: editor_canvas;
}) => {
  const handlePrint = async () => {
    /*
      STEPS TO PRINT
      1 - clone canvas objects
      2 - replace all images src url to base64
      3 - group all elements to scale properly
      4 - create a new canvas with the proper size
      5 - 
    */

    if (!canvas) return;
    const canvasWidth = fabric.util.parseUnit("65mm")
    const canvasHeight = fabric.util.parseUnit("65mm")

    const dpi = getScreenDPI();

    const {cardenasCanvas, elements} = await canvas.getObjects().reduce(async (accPromise,obj)=>{
      const acc = await accPromise;

      if(obj.cardenas_canvas) {
        acc.cardenasCanvas = await obj.clone() as fabric.Group
      }

      if(!obj.cardenas_canvas){
        if (obj.type === "image") {
          const image = obj as fabric.FabricImage;
          const imageElement = image.getElement() as HTMLImageElement;

          const url = new URL(imageElement.src);
          const pathname = url.pathname; // Get the file path
          const extension = pathname.split(".").pop()?.toLowerCase(); // Extract the file extension (before query params)

           // Check for file format based on the extension
          const isJpeg = extension === "jpg" || extension === "jpeg";
          // Convert the image to Base64
          const base64 = image.toDataURL({
            format: isJpeg ? "jpeg" : "png", // Use 'jpeg' if needed
            quality: 1, // High quality for JPEG
          });

          // imageElement.src = base64;

          // image.set({
          //   element: imageElement,
          // });

          obj = image
        }

        obj = await obj.clone()

        acc.elements.push(obj)
      }

      return acc
    },
    Promise.resolve({ cardenasCanvas: {} as fabric.Group, elements: [] as fabric.Object[] })
  )

  console.log('XXX',cardenasCanvas)

    const groupElement = new fabric.Group(elements,{});
    const scaleFactorGroup = canvasWidth / Math.max(groupElement.width, groupElement.height);
    groupElement.scale(scaleFactorGroup)
     
    cardenasCanvas.getObjects().forEach(o => {
      console.log('aaa',o.cardenas_print)
      if (!o.cardenas_print) {
        cardenasCanvas.remove(o);
      }
    })
    const clip = new fabric.Group(cardenasCanvas.getObjects());
    const scaleFactor = canvasWidth / Math.max(clip.width, clip.height);

    clip.scale(scaleFactor)
    // clip.left = (canvasWidth - clip.getScaledWidth()) / 2;
    // clip.top = (canvasHeight - clip.getScaledHeight()) / 2;

    // // Ensure changes are updated
    // clip.setCoords();


    const printCanvas = new fabric.Canvas("c", {
      width: canvasWidth,
      height: canvasHeight,
      // clipPath: clip
    });


    printCanvas.add(clip)
    printCanvas.add(groupElement)
    printCanvas.centerObject(groupElement)
    printCanvas.centerObject(clip)
    printCanvas.clipPath = clip

    
    fetch("/api/print", {
      method: "POST",
      body: JSON.stringify({
        svg: printCanvas.toSVG(),
        model_id: currentModel.id,
        dpi,
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
        window.open(url, "_blank");
      })
      .catch((error) => {
        console.error("Error fetching the PDF:", error);
      });
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
            >
              Imprimir usando gabarito
            </Button>
            <Button
              size="default"
              iconPlacement="start"
              icon={<Printer />}
              onClick={handlePrint}
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
