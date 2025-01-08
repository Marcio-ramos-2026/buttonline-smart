"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";

type InfiniteScrollParams = {
  endpoint: string;
  limit: number;
  get?: string;
};

export function useInifiteScrollImage({
  endpoint,
  limit,
  get = "",
}: InfiniteScrollParams) {
  const [items, setItems] = useState<
    { tag: string; id: number; webformatURL: string; previewURL: string }[]
  >([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 1 });
  const [hasMore, setHasMore] = useState(true);

  const newItems = async () => {
    setLoading(true);

    const response = await fetch(`${endpoint}?${get}&page=1&limit=${limit}`);

    const { hits } = await response.json();

    setItems(hits);
    setPage(2);
    // setHasMore(false);
    setLoading(false);
  };

  const loadMoreItems = async () => {
    setLoading(true);

    const response = await fetch(
      `${endpoint}?${get}&page=${page}&limit=${limit}`
    );
    const { hits } = await response.json();

    setItems((prevItems) => [...prevItems, ...hits]);
    setPage((prevPage) => prevPage + 1);
    //setHasMore(data.length >= limit);
    setLoading(false);
  };

  useEffect(() => {
    if (isIntersecting && !loading && hasMore) {
      loadMoreItems();
    }
  }, [isIntersecting, loading]);

  useEffect(() => {
    if (!loading) {
      newItems();
    }
  }, [get]);

  return { ref, items, loading };
}
