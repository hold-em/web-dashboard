import * as React from 'react';
import { Table as TableType } from '@tanstack/react-table';
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationPrevious,
  PaginationButton,
  PaginationNext
} from './ui/pagination';

interface TablePaginationProps<T> {
  table: TableType<T>;
}

export default function TablePagination<T>({ table }: TablePaginationProps<T>) {
  if (table.getPageCount() < 2) return null;
  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          />
        </PaginationItem>
        {Array.from({ length: table.getPageCount() }).map((_, i) => (
          <PaginationItem key={i}>
            <PaginationButton
              onClick={() => table.setPageIndex(i)}
              isActive={table.getState().pagination.pageIndex === i}
            >
              {i + 1}
            </PaginationButton>
          </PaginationItem>
        ))}
        <PaginationItem>
          <PaginationNext
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
