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
import { PageState } from './store-management-page';
import { StoreRestResponse, LeagueRestResponse } from '@/lib/api';
import { useLeagues } from '@/hooks/use-leagues';

interface StoreListSectionProps {
  stores: StoreRestResponse[];
  selectStore: (store: StoreRestResponse, pageState: PageState) => void;
}

export default function StoreListSection({
  stores,
  selectStore
}: StoreListSectionProps) {
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ created_at: false });

  const { leagues, isLoading: isLoadingLeagues } = useLeagues();

  // Function to get league name by ID
  const getLeagueName = React.useCallback(
    (leagueId: number) => {
      if (!leagues || isLoadingLeagues) return '로딩 중...';

      // Check if leagues.data exists and is an array
      const leaguesList = leagues.data || [];
      const league = leaguesList.find(
        (league: LeagueRestResponse) => league.id === leagueId
      );
      return league ? league.name : '알 수 없음';
    },
    [leagues, isLoadingLeagues]
  );

  const columns = React.useMemo<ColumnDef<StoreRestResponse>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '매장명',
        cell: ({ row }) => <div>{row.getValue('name')}</div>
      },
      {
        accessorKey: 'phone_number',
        header: '전화번호',
        cell: ({ row }) => <div>{row.getValue('phone_number')}</div>
      },
      {
        accessorKey: 'address',
        header: '주소',
        cell: ({ row }) => <div>{row.getValue('address')}</div>
      },

      {
        accessorKey: 'league_id',
        header: '리그',
        cell: ({ row }) => <div>{getLeagueName(row.getValue('league_id'))}</div>
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
              onClick={() => selectStore(row.original, 'read')}
            >
              상세정보
            </Button>
            <Button
              variant='secondary'
              size='sm'
              onClick={() => selectStore(row.original, 'update')}
            >
              수정
            </Button>
          </div>
        )
      }
    ],
    [selectStore, getLeagueName]
  );

  const table = useReactTable({
    data: stores,
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
    <Section className='w-full'>
      <SectionTitle>매장 목록</SectionTitle>
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
