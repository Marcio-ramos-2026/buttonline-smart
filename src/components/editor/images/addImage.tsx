"use client";

import { LoadingIcon } from "@/components/loading";
import { SearchInput } from "@/components/searchInput";
import { useEditorContext } from "@/context/editor";
import { useInifiteScroll } from "@/hooks/useInifiteScroll";
import { useInifiteScrollImage } from "@/hooks/useInifiteScrollImage";
import * as fabric from "fabric";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { useState } from "react";

const BATATAS_TESTE = [
  "https://images.unsplash.com/photo-1732295160378-78fbd97fbf83?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyfHx8fHx8fHwxNzMyNjUzMDMyfA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1719937051157-d3d81cc28e86?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MXwxfGFsbHwxfHx8fHx8fHwxNzMyNjUzMDMyfA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1732613942657-61684c51eb55?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwzfHx8fHx8fHwxNzMyNjUzMDMyfA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1732364559459-c25543c82064?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw0fHx8fHx8fHwxNzMyNjUzMDMyfA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1732601471612-213023f569d8?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw1fHx8fHx8fHwxNzMyNjUzMDMyfA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1732530361158-09f4154b6b3b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHw3fHx8fHx8fHwxNzMyNjUzMDMyfA&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1732521028694-2c1908915495?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMHx8fHx8fHx8MTczMjY1MzAzMnw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1732540988407-1f38cf012f0a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxMnx8fHx8fHx8MTczMjY1MzAzMnw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1732482124543-84aecd47788d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxNnx8fHx8fHx8MTczMjY1MzAzMnw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1732482124543-e9bb4ed3fede?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxN3x8fHx8fHx8MTczMjY1MzAzMnw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1732444827571-3b16b9a837e4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwxOXx8fHx8fHx8MTczMjY1MzAzMnw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1732439857681-ece7fe1ff7eb?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MHwxfGFsbHwyMHx8fHx8fHx8MTczMjY1MzAzMnw&ixlib=rb-4.0.3&q=80&w=400",
  "https://images.unsplash.com/photo-1721332154373-17e78d19b4a4?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3wxMTY5OTZ8MXwxfGFsbHwyMXx8fHx8fHx8MTczMjY1NDg0N3w&ixlib=rb-4.0.3&q=80&w=400",
];

export function AddImage() {
  const { canvas } = useEditorContext();
  const [images, setImages] = useState<string[]>(BATATAS_TESTE);
  const t = useTranslations("pages.editor.sideBar.tabs.image");
  const [value, setValue] = useState("");

  const handleAddImage = async (src: string) => {
    if (!canvas) return;

    const image = await fabric.FabricImage.fromURL(src);
    const canvasWidth = canvas.width || 0;
    const canvasHeight = canvas.height || 0;
    const scaleFactor = Math.min(
      (canvasWidth - 700) / image.width!,
      (canvasHeight - 700) / image.height!
    );
    image.scale(scaleFactor);

    canvas.add(image);
    canvas.centerObject(image);
    canvas.renderAll();
  };

  const handleUploadImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!canvas) return;

    const imgObj = e.target.files?.[0];
    if (!imgObj) return;
    const imageUrl = URL.createObjectURL(imgObj);
    setImages((prev) => {
      const updatedImages = [imageUrl as string, ...prev];
      return updatedImages;
    });
  };

  const handleDropImage = (e: React.DragEvent<HTMLInputElement>) => {
    e.preventDefault();

    if (!canvas) return;

    const imgObj = e.dataTransfer.files?.[0];
    if (!imgObj) return;
    const imageUrl = URL.createObjectURL(imgObj);
    setImages((prev) => {
      const updatedImages = [imageUrl as string, ...prev];
      return updatedImages;
    });
  };

  const { items, ref, loading } = useInifiteScrollImage({
    endpoint: "https://pixabay.com/api/",
    limit: 20,
    get: `q=${value}&image_type=photo&key=391497-ce4d5e5bcc7e2531c2f8ebe17&lang=pt&per_page=20`,
  });

  // console.log("ITEMS", items);

  return (
    <div className="text-textForefround h-full flex flex-col gap-4">
      <div className="w-full">
        <label
          onDragOver={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onDragEnter={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          onDragLeave={(e) => {
            e.stopPropagation();
            e.preventDefault();
          }}
          className="flex flex-col items-center justify-center relative w-full h-28 py-3 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-gray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-7 h-7 mb-2 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-1 text-xs text-gray-500 dark:text-gray-400 text-center">
              <span className="font-semibold">{t("load")}</span> {t("drag")}.
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (Max. 800px x 400px)
            </p>
          </div>
          <input
            type="file"
            className="opacity-0 z-50 absolute inset-0 cursor-pointer"
            onChange={handleUploadImage}
            onDrop={handleDropImage}
          />
        </label>
      </div>

      <SearchInput
        onValueChange={(val) => {
          setValue(val);
        }}
        debounceTime={300}
      />

      <div className="overflow-y-auto h-[77vh] scrollBar pr-2">
        <div className="gap-2 grid grid-cols-2">
          {items.map((image) => {
            return (
              <button
                key={image.id + image.tag}
                type="button"
                //@ts-ignore
                onClick={() => handleAddImage(image.webformatURL)}
                className="rounded-md inline-block last:mb-0 h-24"
                data-id={image.id}
              >
                <Image
                  alt="imagem teste"
                  //@ts-ignore
                  src={image.previewURL}
                  width={150}
                  height={200}
                  className="w-full h-24 block rounded-md object-cover"
                />
              </button>
            );
          })}
        </div>

        <div className="flex justify-center items-center mt-2" ref={ref}>
          {loading && <LoadingIcon />}
        </div>
      </div>
    </div>
  );
}
