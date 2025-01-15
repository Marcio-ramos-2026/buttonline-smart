"use client";

import { useEffect, useState } from "react";
import { useIntersectionObserver } from "./useIntersectionObserver";
import { useLocale } from "next-intl";

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
  const [items, setItems] = useState<{ svg: string; id: string }[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const { isIntersecting, ref } = useIntersectionObserver({ threshold: 1 });
  const [hasMore, setHasMore] = useState(true);
  const locale = useLocale();

  const newItems = async () => {
    setLoading(true);

    const response = await fetch(
      `${endpoint}?${get}&page=1&limit=${limit}&locale=${locale}`
    );
    const { data } = await response.json();

    setItems(data);
    setPage(2);
    setHasMore(data?.length >= limit);
    setLoading(false);
  };

  const loadMoreItems = async () => {
    setLoading(true);

    const response = await fetch(
      `${endpoint}?${get}&page=${page}&limit=${limit}&locale=${locale}`
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
    if (!loading) {
      newItems();
    }
  }, [get]);

  return { ref, items, loading };
}
