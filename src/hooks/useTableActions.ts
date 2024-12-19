'use client'

import { useCallback, useEffect, useState } from "react";
import { TableSortType, useTableSort } from "@/hooks/useTableSorting";
import { PaginationState } from "@tanstack/react-table";
import { useIsMounted } from "@/hooks/useIsMounted";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

export type TablePaginationType = {
  pagination: PaginationState & {
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
    totalItems: number;
  };
  onPaginate: (prop: PaginationState) => void;
};

export interface TableActionsType
  extends Omit<TableSortType, "handleSort">,
    TablePaginationType {
  onSorting: (column_id: string) => void;
  onFiltering: (filters: Record<string, string>) => void;
}

export interface UseTableActionParams {
  totalItems: number; // Total number of items in the table
  pageSize?: number; // Items per page (default: 10)
  pageIndex?: number; // Current page index (1-based, default: 1)
}

export const useTableAction = ({
  totalItems,
  pageSize = 10,
  pageIndex = 1,
}: UseTableActionParams): TableActionsType => {
  const isMounted = useIsMounted();
  const router = useRouter();
  const pathname = usePathname();
  const { sorting, handleSort } = useTableSort();
  const searchParams = useSearchParams();

  const calculateTotalPages = () => Math.ceil(totalItems / pageSize);

  const [page, setPage] = useState<
    PaginationState & {
      totalPages: number;
      hasNextPage: boolean;
      hasPreviousPage: boolean;
    }
  >(() => ({
    pageIndex: pageIndex >= 1 ? pageIndex : 1,
    pageSize,
    totalPages: calculateTotalPages(),
    hasNextPage: pageIndex < calculateTotalPages(),
    hasPreviousPage: pageIndex > 1,
  }));

  useEffect(() => {
    if (!isMounted) return;

    setPage((prevState) => {
      const totalPages = calculateTotalPages();
      const newPageIndex = pageIndex >= 1 ? pageIndex : 1;

      return {
        ...prevState,
        pageIndex: newPageIndex,
        totalPages,
        hasNextPage: newPageIndex < totalPages,
        hasPreviousPage: newPageIndex > 1,
      };
    });
  }, [pageIndex, pageSize, totalItems, isMounted]);

  const onPaginate = (x: PaginationState) => {
    const totalPages = calculateTotalPages();

    setPage({
      ...x,
      totalPages,
      hasNextPage: x.pageIndex < totalPages,
      hasPreviousPage: x.pageIndex > 1,
    });
  };

  const onSorting = useCallback((column_id: string) => {
    const params = new URLSearchParams(searchParams.toString());

    params.forEach((value, key) => {
      if (key.startsWith("sort_")) {
        params.delete(key);
      }
    });

    //@ts-ignore
    handleSort((prev) => {
      let newSorting;

      if (!prev.length || prev[0].id !== column_id) {
        newSorting = [
          {
            id: column_id,
            desc: false,
            teste: "first",
          },
        ];
        params.set(`sort_${column_id}`, "asc");
      } else {
        newSorting = [
          {
            id: column_id,
            desc: !prev[0].desc,
            teste: "is not first",
          },
        ];
        params.set(`sort_${column_id}`, prev[0].desc ? "asc" : "desc");
      }

      setTimeout(() => {
        router.replace(`${pathname}?${params.toString()}`);
        // router.refresh()
      }, 0);

      return newSorting;
    });
  }, [handleSort, pathname, router, searchParams]);

  const onFiltering = (filters: Record<string, string>) => {
    const params = new URLSearchParams();
    Object.keys(filters).forEach((key) => {
      params.set(`filter_${key}`, filters[key]);
    });
    // router.refresh()
    setTimeout(() => {
      router.replace(`${pathname}?${params.toString()}`);
    }, 0);
  };

  return {
    sorting,
    onSorting,
    onFiltering,
    pagination: { ...page, totalItems },
    onPaginate,
  };
};
