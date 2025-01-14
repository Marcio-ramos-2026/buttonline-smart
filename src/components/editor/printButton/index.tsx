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

export const PrintButton = ({
  canvas,
  currentModel,
}: {
  canvas: any;
  currentModel: any;
}) => {
  const handlePrint = async () => {
    if (!canvas) return;
    const dpi = getScreenDPI();

    let allObjects = canvas.getObjects();
    allObjects = allObjects.map((obj: any) => {
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

        // Replace the image source with the Base64 data
        imageElement.src = base64;

        image.set({
          element: imageElement,
        });
        return image;
      }

      return obj;
    });

    const allObjectsGroup = new fabric.Group(allObjects, {
      left: 0,
      top: 0,
    });

    // Calculate the bounding dimensions of the group
    const boundingRect = allObjectsGroup.getBoundingRect();
    const groupWidth = boundingRect.width;
    const groupHeight = boundingRect.height;

    // Fixed canvas size
    const canvasWidth = fabric.util.parseUnit("65mm"); // Canvas width in px
    const canvasHeight = fabric.util.parseUnit("65mm"); // Canvas height in px

    // Calculate the scale factor to fit content within canvas
    const scaleFactor = Math.min(
      canvasWidth / groupWidth,
      canvasHeight / groupHeight
    );

    // Scale the group proportionally
    allObjectsGroup.scale(scaleFactor);
    allObjectsGroup.setCoords(); // Update coordinates after scaling

    // const copyRealCanvas = await realCanvas.clone()
    // copyRealCanvas.width = allObjectsGroup.getScaledWidth()
    // copyRealCanvas.height = allObjectsGroup.getScaledHeight()

    // realCanvas.backgroundColor = 'blue'

    // Create a new canvas with the fixed size
    const printCanvas = new fabric.Canvas("c", {
      width: canvasWidth,
      height: canvasHeight,
      // clipPath: realCanvas
    });

    printCanvas.add(allObjectsGroup);
    printCanvas.centerObject(allObjectsGroup);

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
  };
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
