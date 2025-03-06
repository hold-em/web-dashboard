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
import { PageState } from './game-type-management-page';
import { GameTypeRestResponse } from '@/lib/api/types.gen';
import { useGameTypes } from '@/hooks/use-game-types';

interface GameTypeListSectionProps {
  gameTypes: GameTypeRestResponse[];
  selectGameType: (
    gameType: GameTypeRestResponse,
    pageState: PageState
  ) => void;
}

export default function GameTypeListSection({
  gameTypes,
  selectGameType
}: GameTypeListSectionProps) {
  const { deleteGameType, isDeleting } = useGameTypes();

  const handleDelete = (gameTypeId: number) => {
    deleteGameType(gameTypeId);
  };

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      created_at: false
    });

  const columns = React.useMemo<ColumnDef<GameTypeRestResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '게임 타입명',
        cell: ({ row }) => <div>{row.getValue('name')}</div>
      },
      {
        accessorKey: 'position',
        header: '위치',
        cell: ({ row }) => <div>{row.getValue('position')}</div>
      },
      {
        accessorKey: 'created_at',
        header: '생성일',
        cell: ({ row }) =>
          new Date(row.getValue('created_at')).toLocaleString(),
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
              onClick={() => selectGameType(row.original, 'read')}
            >
              상세정보
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => selectGameType(row.original, 'update')}
            >
              수정
            </Button>
            <Button
              variant='destructive'
              size='sm'
              onClick={() => handleDelete(row.original.id)}
              disabled={isDeleting}
            >
              삭제
            </Button>
          </div>
        )
      }
    ],
    [selectGameType]
  );

  const table = useReactTable({
    data: gameTypes,
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
      columnVisibility: {
        created_at: false
      }
    }
  });

  return (
    <Section className='w-full'>
      <SectionTitle>게임 타입 목록</SectionTitle>
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
