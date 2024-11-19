"use client";

import { useInifiteScroll } from "@/hooks/useInifiteScroll";
import { ReactSVG } from "react-svg";
import { LoadingIcon } from "@/components/loading";

import { useDebounceCallback } from "@/hooks/useDebounceCallback";
import { useState } from "react";

import { SearchInput } from "@/components/searchInput";

export const TabIcons = ({ content }: { content: string }) => {
  const [value, setValue] = useState("");

  const { items, ref, loading } = useInifiteScroll({
    endpoint: "/api/icons",
    limit: 10,
    // get: value,
  });

  return (
    <>
      <div className="flex flex-col px-4 divide-y-2 divide-red-600">
        <SearchInput
          onValueChange={(val) => {
            console.log("Valor atualizado:", val);
            setValue(val);
          }}
          debounceTime={300}
        />

        <div className="pt-4">
          <div className="flex flex-wrap">
            {items.map((icon) => {
              const base64Svg = `data:image/svg+xml;base64,${btoa(icon.svg)}`;

              return (
                <div className="h-[75px] w-[75px] text-white" key={icon.id}>
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
