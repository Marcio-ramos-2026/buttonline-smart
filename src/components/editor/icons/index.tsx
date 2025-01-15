"use client";

import { useInifiteScroll } from "@/hooks/useInifiteScroll";
import { ReactSVG } from "react-svg";
import { LoadingIcon } from "@/components/loading";
import { useState } from "react";
import { SearchInput } from "@/components/searchInput";
import { useEditorContext } from "@/context/editor";
import * as fabric from "fabric";

export const TabIcons = ({ content }: { content: string }) => {
  const [value, setValue] = useState("");

  const { canvas } = useEditorContext();

  const handleAddIcon = async (svgString: string) => {
    if (!canvas) return;
    const { objects, options } = await fabric.loadSVGFromString(svgString);

    let svgObject;

    /// se tem multiplos paths temq  passar aqui pra agrupar
    if (Array.isArray(objects)) {
      //@ts-ignore
      svgObject = fabric.util.groupSVGElements(objects, options);
    } else {
      svgObject = objects;
    }

    svgObject.scaleToWidth(100);
    svgObject.scaleToHeight(100);

    svgObject.setControlsVisibility({
      mt: false,
      mb: false,
      ml: false,
      mr: false,
      mtr: true,
      tl: true,
      tr: true,
      bl: true,
      br: true,
    });

    canvas.add(svgObject);
    canvas.centerObject(svgObject);
    canvas.renderAll();
  };

  const { items, ref, loading } = useInifiteScroll({
    endpoint: "/api/icons",
    limit: 20,
    get: `name=${value}`,
  });

  // console.log('ITEMS', items)

  return (
    <>
      <div className="flex flex-col px-4 h-full space-y-4">
        <SearchInput
          onValueChange={(val) => {
            setValue(val);
          }}
          debounceTime={300}
        />

        <div className="flex-1 overflow-y-auto scrollBar">
          <div className="flex flex-wrap h-fit max-h-full">
            {items?.map((icon) => {
              const base64Svg = `data:image/svg+xml;base64,${btoa(icon.svg)}`;

              return (
                <div
                  onClick={() => handleAddIcon(icon.svg)}
                  className="h-[75px] w-[75px] text-white"
                  key={icon.id}
                >
                  <ReactSVG src={base64Svg} />
                </div>
              );
            })}
          </div>

          <div className="flex justify-center items-center mt-8" ref={ref}>
            {loading && <LoadingIcon />}
          </div>
        </div>
      </div>
    </>
  );
};
