import { useEffect, useState } from "react";
import { TableSortType, useTableSort } from "@/hooks/useTableSorting";
import { PaginationState } from "@tanstack/react-table";
import { useIsMounted } from "@/hooks/useIsMounted";

export type TablePaginationType = {
  pagination: PaginationState & {
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
  onPaginate: (prop: PaginationState) => void;
};

export interface TableActionsType extends TableSortType, TablePaginationType {}

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
  const sort = useTableSort();

  const calculateTotalPages = () => Math.ceil(totalItems / pageSize);

  const [page, setPage] = useState<PaginationState & {
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }>(() => ({
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

  return {
    ...sort,
    pagination: { ...page },
    onPaginate,
  };
};
