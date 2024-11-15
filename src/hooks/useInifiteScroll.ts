"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

export function useInifiteScroll(endpoint: string, limit: number) {
  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 1 });
  const [hasMore, setHasMore] = useState(true);

  const fetchData = async () => {
    if (!hasMore) return;    

    setLoading(true);

    const newItems = await fetch(endpoint);   
    const { data } = await newItems.json();
    if (data.length < limit) setHasMore(false);

    setItems((prevItems) => [...prevItems, ...data]);
    setPage((prevPage) => prevPage + 1);
    setLoading(false);
  };

  useEffect(() => {
    if (isIntersecting && !loading && hasMore) {
      fetchData();
    }
  }, [isIntersecting, loading]);

  return { ref, items };
}
