import { SortingState } from "@tanstack/react-table";
import { useCallback, useState } from "react";

export type TableSortType = {
  sorting: {
    id: string
    desc: boolean
  }[]
  handleSort: (props: SortingState) => void
}

export const useTableSort = (): TableSortType => {
  const [sorting, setSorting] = useState<SortingState>([]);

  const handleSort = useCallback((sorted: SortingState): void => {
    setSorting(sorted);
  }, []);

  return {
    sorting,
    handleSort,
  };
};