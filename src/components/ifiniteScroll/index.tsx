'use server'

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "@/hooks/useIntersectionObserver";
import { fetchIcons } from "@/lib/db";

export const TabIcons = async ({ children, endpoit, limit }) => {
  const [items, setItems] = useState<string[]>([])
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(true)

  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 1 });

  const fetch = async () => {
    const newItems = await fetchIcons();

    setItems((prevItems) => [...prevItems, ...newItems]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  useEffect(() => {
    if (isIntersecting && !loading) {
      fetch();
    }
  }, [isIntersecting, loading]);

  console.log("c", items, page);

  return (
    <div>
      {children}
      <p>
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
        aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa
      </p>

      <div ref={ref}>xxxxxxxxxxxxxxxxxxxxxxxxxx</div>
    </div>
  );
};
