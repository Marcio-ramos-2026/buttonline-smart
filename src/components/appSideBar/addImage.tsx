"use client";

import { useEditorContext } from "@/context/editor";
import * as fabric from "fabric";
import { ImageUp } from "lucide-react";
import Image from "next/image";
import { useRef } from "react";

export function AddImage() {
  const { canvas } = useEditorContext();
  const imgRef = useRef(null);

  const handleAddImage = () => {
    if (!imgRef?.current || !canvas) return;

    const image = new fabric.FabricImage(imgRef.current);

    canvas.add(image);
    canvas.centerObject(image);
    canvas.renderAll();
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!imgRef?.current || !canvas || !e) return;

    const imgObj = e.target.files?.[0];
    const reader = new FileReader();
    reader.readAsDataURL(imgObj!);
    reader.onload = (e) => {
      const imageUrl = e.target?.result;
      const imageEl = document.createElement("img");
      imageEl.src = imageUrl as string;
      imageEl.onload = () => {
        const newImage = new fabric.FabricImage(imageEl);
        const canvasWidth = canvas.width || 0;
        const canvasHeight = canvas.height || 0;
        const scaleFactor = Math.min(
          (canvasWidth - 700) / newImage.width!,
          (canvasHeight - 700) / newImage.height!
        );
        newImage.scale(scaleFactor);

        canvas.add(newImage);
        canvas.centerObject(newImage);
        canvas.renderAll();
      };
    };
  };

  return (
    <div className="flex gap-3 flex-col text-textForefround">
      <label className="rounded-md bg-gray-300/15 hover:bg-gray-300/35 cursor-pointer px-3 py-1.5 w-fit">
        <span className="flex gap-0.5 items-center">
          <ImageUp className="w-5 h-5" />
          <span>Carregar imagem</span>
        </span>
        <input type="file" className="hidden" onChange={handleUploadImage} />
      </label>
      <button
        type="button"
        onClick={handleAddImage}
        className="rounded-md overflow-hidden w-fit"
      >
        <Image
          alt="imagem teste"
          src="data:image/jpeg;base64,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"
          width={150}
          height={200}
          ref={imgRef}
        />
      </button>
    </div>
  );
}
