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
import { GameRestResponse } from '@/lib/api/types.gen';
import { PAGE_SIZE } from '@/constants/common';
import { PageState } from './game-management-page';
import { useStores } from '@/hooks/use-stores';

interface GameListSectionProps {
  games: GameRestResponse[];
  selectGame: (game: GameRestResponse, pageState: PageState) => void;
}

export default function GameListSection({
  games,
  selectGame
}: GameListSectionProps) {
  const { stores } = useStores();

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      created_at: false
    });

  const columns = React.useMemo<ColumnDef<GameRestResponse>[]>(
    () => [
      {
        accessorKey: 'mode',
        header: '게임 모드',
        cell: ({ row }) => <div>{row.getValue('mode')}</div>
      },
      {
        accessorKey: 'buy_in_amount',
        header: '바이인',
        cell: ({ row }) => <div>{row.getValue('buy_in_amount')}</div>
      },
      {
        accessorKey: 'prize',
        header: 'PRIZE',
        cell: ({ row }) => (
          <div>
            {row.getValue('prize') ? `${row.getValue('prize')}원` : '-'}
          </div>
        )
      },
      {
        accessorKey: 'store_id',
        header: '개최 장소',
        cell: ({ row }) => {
          const storeId = row.getValue('store_id');
          const store = stores?.find((s) => s.id === storeId);
          return <div>{store ? store.name : `매장 ${storeId}`}</div>;
        }
      },
      {
        accessorKey: 'max_players',
        header: '최대 인원',
        cell: ({ row }) => <div>{row.getValue('max_players')}</div>
      },
      {
        accessorKey: 'status',
        header: '상태',
        cell: ({ row }) => <div>{row.getValue('status')}</div>
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
              onClick={() => selectGame(row.original, 'read')}
            >
              조회
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => selectGame(row.original, 'update')}
            >
              수정
            </Button>
          </div>
        )
      }
    ],
    [selectGame, stores]
  );

  const table = useReactTable({
    data: games,
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
  console.log('🚀 ~ games:', games);

  return (
    <Section>
      <SectionTitle>게임 목록</SectionTitle>
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
