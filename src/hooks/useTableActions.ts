import { useState } from "react";
import { TableSortType, useTableSort } from "@/hooks/useTableSorting";
import { PaginationState } from "@tanstack/react-table";

export type TablePaginationType = {
  pagination: PaginationState
  onPaginate: (prop: PaginationState) => void
}

export interface TableActionsType extends TableSortType, TablePaginationType {}

export const useTableAction = (pageSize?: number): TableActionsType => {
    const sort = useTableSort();
    const [page, setPage] = useState<PaginationState>({pageIndex: 0, pageSize: pageSize ?? 10 });
    // const [filters, setFilter] = useState({})
  
    return {
      ...sort,
      pagination: {...page},
      onPaginate: (x) => setPage(x),
    };
};