"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

type InfiniteScrollParams = {
  endpoint: string;
  limit: number;
  get?: string;
};

export function useInifiteScroll({
  endpoint,
  limit,
  get = "",
}: InfiniteScrollParams) {
  const [items, setItems] = useState<string[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 1 });
  const [hasMore, setHasMore] = useState(true);

  const newItems = async () => {
    setLoading(true);  

    const response = await fetch(`${endpoint}?${get}&page=1&limit=${limit}`);
    const { data } = await response.json();

    setItems(data);
    setPage(2);
    setHasMore(data.length >= limit);
    setLoading(false);
  };

  const loadMoreItems = async () => {
    setLoading(true);

    const response = await fetch(
      `${endpoint}?${get}&page=${page}&limit=${limit}`
    );
    const { data } = await response.json();

    setItems((prevItems) => [...prevItems, ...data]);
    setPage((prevPage) => prevPage + 1);
    setHasMore(data.length >= limit);
    setLoading(false);
  };

  useEffect(() => {
    if (isIntersecting && !loading && hasMore) {
      loadMoreItems();
    }
  }, [isIntersecting, loading]);

  useEffect(() => {
    if (isIntersecting && !loading) {
      newItems();
    }
  }, [get]);

  return { ref, items, loading };
}
