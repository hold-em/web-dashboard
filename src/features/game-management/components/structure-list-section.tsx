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
import { Button } from '@/components/ui/button';
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
import { GameStructureTemplateRestResponse } from '@/lib/api/types.gen';

interface StructureListSectionProps {
  structures: GameStructureTemplateRestResponse[];
  selectStructure: (structure: GameStructureTemplateRestResponse) => void;
}

export default function StructureListSection({
  structures,
  selectStructure
}: StructureListSectionProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ created_at: false });

  const columns = React.useMemo<ColumnDef<GameStructureTemplateRestResponse>[]>(
    () => [
      {
        accessorKey: 'id',
        header: 'ID',
        cell: ({ row }) => <div>{row.getValue('id')}</div>
      },
      {
        accessorKey: 'structures',
        header: '스트럭처',
        cell: ({ row }) => {
          const structureData = JSON.parse(row.getValue('structures'));
          return <div>{structureData.name || '이름 없음'}</div>;
        }
      },
      {
        accessorKey: 'created_at',
        header: '생성일',
        cell: ({ row }) => {
          const createdAt = row.getValue('created_at') as {
            [key: string]: unknown;
          };
          return new Date(createdAt as unknown as string).toLocaleString();
        },
        enableHiding: true
      },
      {
        id: 'actions',
        enableHiding: false,
        header: '관리',
        cell: ({ row }) => (
          <div className='flex gap-1'>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => selectStructure(row.original)}
            >
              수정
            </Button>
          </div>
        )
      }
    ],
    [selectStructure]
  );

  const table = useReactTable({
    data: structures,
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
      <SectionTitle>스트럭처 목록</SectionTitle>
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
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className='h-24 text-center'
                  >
                    No results.
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
