"use client";

import { useInifiteScroll } from "@/hooks/useInifiteScroll";
import { ReactSVG } from "react-svg";
import { LoadingIcon } from "@/components/loading";

export const TabIcons = ({ content }: { content: string }) => {
  const { items, ref, loading } = useInifiteScroll({
    endpoint: "/api/icons",
    limit: 10,
  });

  return (
    <>
      <div className="flex flex-wrap">
        {items.map((icon) => {
          const base64Svg = `data:image/svg+xml;base64,${btoa(icon.svg)}`;

          return (
            <div className="h-[75px] w-[75px] ">
              <ReactSVG src={base64Svg} />
            </div>
          );
        })}
      </div>

      <div className="flex justify-center items-center mt-8" ref={ref}>{loading && <LoadingIcon />}</div>
    </>
  );
};
