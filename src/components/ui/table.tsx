import * as React from "react"

import { cn } from "@/lib/utils"
import { TableActionsType } from "@/hooks/useTableActions"
import { ColumnDef, flexRender, functionalUpdate, getCoreRowModel, PaginationState, SortingState, Updater, useReactTable } from "@tanstack/react-table"
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react"

const TableElement = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm", className)}
      {...props}
    />
  </div>
))
TableElement.displayName = "Table"

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn(
      "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
      className
    )}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

export interface TableOptions<T> extends TableActionsType {
  columns: ColumnDef<T>[];
  data: T[];
  totalData: number;
  isLoading?: boolean;
}

const Table = <T extends { id: string }>(opt: TableOptions<T>) => {
  const dataDef = React.useMemo(() => {
    return opt.data;
  }, [opt.data]);

  const columnsDef = React.useMemo(() => {
    return opt.columns;
  }, [opt.columns]);

  const handleSorting = React.useCallback((updater: Updater<SortingState>) => {
    const sorted = functionalUpdate(updater, opt.sorting);
    opt.handleSort(sorted);
  }, []);

  const handlePagination = React.useCallback((updater: Updater<PaginationState>) => {
    const sorted = functionalUpdate(updater, opt.pagination);
    opt.onPaginate(sorted);
  }, []);

  const table = useReactTable({
    columns: columnsDef,
    data: dataDef,
    getCoreRowModel: getCoreRowModel(),
    state: {
      sorting: opt.sorting,
      pagination: {
        pageIndex: opt.pagination.pageIndex,
        pageSize: opt.pagination.pageSize,
      },
    },
    onSortingChange: handleSorting,
    onPaginationChange: handlePagination,
  });

  const tableLength = table.getRowModel().rows?.length;

  // const Tablea = opt.table ? opt.table : Table
  //TODO render options to table

  return (
    <TableElement>
      <TableHeader>
        {tableLength ? (
          table.getHeaderGroups().map((headerGroup) => {
            return (
              <TableRow key={headerGroup.id} className="bg-gray-200">
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead
                      key={header.id}
                      className={`text-center ${
                        header.column.columnDef.enableSorting
                          ? "cursor-pointer"
                          : "cursor-default"
                      }`}
                      onClick={header.column.getToggleSortingHandler()}
                    >
                      <div className="flex gap-1 items-center justify-center">
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext()
                            )}
                        {header.column.getCanSort() && (
                          <>
                            {{
                              asc: <ArrowUp className="w-4 h-4" />,
                              desc: <ArrowDown className="w-4 h-4" />,
                            }[header.column.getIsSorted() as string] ?? (
                              <ArrowUpDown className="w-4 h-4" />
                            )}
                          </>
                        )}
                      </div>
                    </TableHead>
                  );
                })}
              </TableRow>
            );
          })
        ) : (
          <></>
        )}
      </TableHeader>
      <TableBody>
        {opt.isLoading ? (
          <tr><td>loading...</td></tr>
        ) : (
          <>
            {tableLength ? (
              table.getRowModel().rows.map((row) => {
                return (
                  <TableRow key={row.id} className="[&>td]:even:bg-secondary">
                    {row.getVisibleCells().map((cell) => {
                      return (
                        <TableCell
                          key={cell.id}
                          className="text-center text-nowrap"
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell className="h-24 w-full text-center bg-primary/15 rounded-xl text-primary">
                  Não há informações para exibir.
                </TableCell>
              </TableRow>
            )}
          </>
        )}
      </TableBody>
    </TableElement>
  );
};

export {
  Table,
  TableElement,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
}
