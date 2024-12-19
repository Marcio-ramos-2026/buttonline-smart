"use client";

import * as React from "react";

import { cn } from "@/lib/utils";
import { TableActionsType } from "@/hooks/useTableActions";
import {
  ColumnDef,
  flexRender,
  functionalUpdate,
  getCoreRowModel,
  PaginationState,
  SortingState,
  Updater,
  useReactTable,
} from "@tanstack/react-table";
import { ArrowUp, ArrowDown, ArrowUpDown } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationLink,
  PaginationEllipsis,
  PaginationNext,
} from "./pagination";
import { useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { ALLOWED_PERMISSIONS } from "@/lib/permissions";

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
));
TableElement.displayName = "Table";

const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
));
TableHeader.displayName = "TableHeader";

const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
));
TableBody.displayName = "TableBody";

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
));
TableFooter.displayName = "TableFooter";

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
));
TableRow.displayName = "TableRow";

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
));
TableHead.displayName = "TableHead";

const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
    {...props}
  />
));
TableCell.displayName = "TableCell";

const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
));
TableCaption.displayName = "TableCaption";

export interface TableOptions<T> extends TableActionsType {
  columns: ColumnDef<T>[];
  data: T[];
  isLoading?: boolean;
}

const Table = <T extends {}>(opt: TableOptions<T>) => {
  const { data: session } = useSession();

  const dataDef = React.useMemo(() => {
    return opt.data;
  }, [opt.data]);

  const columnsDef = React.useMemo(() => {
    let hiddenColumns: { [key: string]: boolean } = {};
    if (session?.user) {
      hiddenColumns = opt.columns
        .filter((column) => {
          if (column.meta?.permissions) {
            const permissions = session?.permissions.find((p) =>
              column.meta?.permissions?.includes(p as ALLOWED_PERMISSIONS)
            );
            if (permissions) {
              return false;
            } else {
              return true;
            }
          }
          return false;
        })
        .reduce(
          (acc, column) => {
            const accessorKey = (column as any).accessorKey as string;
            if (accessorKey) {
              acc[accessorKey] = false;
            }
            return acc;
          },
          {} as { [key: string]: boolean }
        );
    }
    return { columns: opt.columns, hiddenColumns };
  }, [opt.columns, session]);

  const handlePagination = React.useCallback(
    (updater: Updater<PaginationState>) => {
      const sorted = functionalUpdate(updater, opt.pagination);
      opt.onPaginate(sorted);
    },
    []
  );

  const totalPages = Math.ceil(
    opt.pagination.totalPages / opt.pagination.pageSize
  );

  const pageStart = Math.max(opt.pagination.pageIndex - 2, 0);
  const pageEnd = Math.min(pageStart + 4, totalPages - 1);
  const pageRange = Array.from(
    { length: pageEnd - pageStart + 1 },
    (_, i) => pageStart + i
  );
  const table = useReactTable({
    initialState: {
      columnVisibility: columnsDef.hiddenColumns,
    },
    columns: columnsDef.columns,
    data: dataDef,
    getCoreRowModel: getCoreRowModel(),
    state: {
      pagination: {
        pageIndex: opt.pagination.pageIndex,
        pageSize: opt.pagination.pageSize,
      },
    },
    onPaginationChange: handlePagination,
  });

  const t = useTranslations("table");

  const tableLength = table.getRowModel().rows?.length;

  // const Tablea = opt.table ? opt.table : Table
  //TODO render options to table

  return (
    <div className="h-full flex flex-col justify-between rounded-lg overflow-hidden">
      <TableElement>
        <TableHeader>
          {tableLength ? (
            table.getHeaderGroups().map((headerGroup) => {
              return (
                <TableRow
                  key={headerGroup.id}
                  className="bg-primary/80 hover:bg-primary/80"
                >
                  {headerGroup.headers.map((header) => {
                    return (
                      <TableHead
                        key={header.id}
                        className={`text-center text-textForefround ${
                          header.column.columnDef.enableSorting
                            ? "cursor-pointer"
                            : "cursor-default"
                        }`}
                        style={{ width: header.getSize() }}
                        // @ts-ignore
                        onClick={() => opt.onSorting(header.column.columnDef.accessorKey)}
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
            <tr>
              <td>loading...</td>
            </tr>
          ) : (
            <>
              {tableLength ? (
                table.getRowModel().rows.map((row) => {
                  return (
                    <TableRow key={row.id} className="[&>td]:even:bg-gray-200">
                      {row.getVisibleCells().map((cell) => {
                        return (
                          <TableCell
                            key={cell.id}
                            width={cell.column.getSize()}
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
      {/* Pagination Controls */}
      <div className="flex items-center">
        <div className="w-full">
          <p>
            {t("showing")} {dataDef.length} de {opt.pagination.totalItems}{" "}
            {t("results")}
          </p>
        </div>
        <Pagination>
          <PaginationContent>
            {/* Previous Button */}

            <PaginationItem>
              <PaginationPrevious
                href={`?page=${opt.pagination.pageIndex - 1}`}
                disabled={!opt.pagination.hasPreviousPage}
                // onClick={(e) => {
                //   e.preventDefault()
                //   if (opt.pagination.pageIndex > 0) {
                //     opt.onPaginate({
                //       pageIndex: opt.pagination.pageIndex - 1,
                //       pageSize: 0
                //     })
                //   }
                // }}
              />
            </PaginationItem>

            {/* Page Numbers */}
            {pageRange.map((page) => {
              page = page + 1;
              return (
                <PaginationItem key={page}>
                  <PaginationLink
                    href={`?page=${[page]}`}
                    // onClick={(e) => {
                    //   e.preventDefault()
                    //   opt.onPaginate({
                    //     pageIndex: page,
                    //     pageSize: 0
                    //   })
                    // }}
                    className={cn(
                      opt.pagination.pageIndex == page
                        ? "bg-primary text-white"
                        : "text-primary"
                    )}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              );
            })}

            {/* Ellipsis for skipped pages */}
            {pageEnd < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}

            {/* Next Button */}
            <PaginationItem>
              <PaginationNext
                href={`?page=${opt.pagination.pageIndex + 1}`}
                disabled={!opt.pagination.hasNextPage}
                // onClick={(e) => {
                //   e.preventDefault()
                //   if (opt.pagination.pageIndex < totalPages - 1) {
                //     opt.onPaginate({
                //       pageIndex: opt.pagination.pageIndex + 1,
                //       pageSize: 0
                //     })
                //   }
                // }}
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </div>
    </div>
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
};
