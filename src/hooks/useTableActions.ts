import { useEffect, useState } from "react";
import { TableSortType, useTableSort } from "@/hooks/useTableSorting";
import { PaginationState } from "@tanstack/react-table";

export type TablePaginationType = {
  pagination: PaginationState
  onPaginate: (prop: PaginationState) => void
}

export interface TableActionsType extends TableSortType, TablePaginationType {}

export const useTableAction = (pageSize?: number, pageIndex: number = 1): TableActionsType => {
    const sort = useTableSort();
    const [page, setPage] = useState<PaginationState>(() => ({pageIndex: pageIndex >= 1 ? pageIndex : 1 , pageSize: pageSize ?? 10 }));
    // const [filters, setFilter] = useState({})

    useEffect(()=>{
      console.log('pageIndex',pageIndex)
    },[pageIndex])
  
    return {
      ...sort,
      pagination: {...page},
      onPaginate: (x) => setPage(x),
    };
};