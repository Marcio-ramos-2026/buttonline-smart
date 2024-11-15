"use client";

import { useInifiteScroll } from "@/hooks/useInifiteScroll";

export const TabIcons = ({ content }: { content: string }) => {
  const { items, ref } = useInifiteScroll("/api/icons", 10);



  return (
    <>
      <div ref={ref}>more</div>
    </>
  );
};
