'use client';

import * as React from 'react';
import {
  ColumnDef,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { Section, SectionContent, SectionTitle } from '@/components/section';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import TablePagination from '@/components/table-pagination';
import { PAGE_SIZE } from '@/constants/common';
import { GameTable } from '@/mocks/tables';

interface TableStatusSectionProps {
  tables: GameTable[];
}

export default function TableStatusSection({
  tables
}: TableStatusSectionProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ created_at: false });

  const columns = React.useMemo<ColumnDef<GameTable>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '테이블명',
        cell: ({ row }) => <div>{row.getValue('name')}</div>
      },
      {
        accessorKey: 'player_ids',
        header: '플레이어 수',
        cell: ({ row }) => (
          <div>{(row.getValue('player_ids') as string[]).length}</div>
        )
      },
      {
        accessorKey: 'status',
        header: '상태',
        cell: ({ row }) => <div>{row.getValue('status')}</div>
      },
      {
        accessorKey: 'created_at',
        header: '생성일',
        cell: ({ row }) =>
          new Date(row.getValue('created_at')).toLocaleString(),
        enableHiding: true
      }
    ],
    []
  );

  const table = useReactTable({
    data: tables,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    state: {
      columnVisibility
    },
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      pagination: { pageSize: PAGE_SIZE },
      columnVisibility: { created_at: false }
    }
  });

  return (
    <Section>
      <SectionTitle>테이블 현황</SectionTitle>
      <SectionContent>
        <div className='rounded-md border'>
          <Table>
            <TableHeader>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getPageCount() > 0 &&
                table.getPaginationRowModel().rows.map((row) => (
                  <TableRow key={row.id}>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              {table.getPageCount() === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    정보가 없습니다.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <TablePagination table={table} />
      </SectionContent>
    </Section>
  );
}
