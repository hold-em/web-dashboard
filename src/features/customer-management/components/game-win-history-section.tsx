import * as React from 'react';
import { Section, SectionContent, SectionTitle } from '@/components/section';
import { User, GameWinHistory, mockGameWinHistories } from '@/mocks/users';
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TablePagination
} from '@/components/ui/table';

const columns: ColumnDef<GameWinHistory>[] = [
  {
    accessorKey: 'date',
    header: '날짜',
    cell: ({ row }) => new Date(row.getValue('date')).toLocaleDateString()
  },
  {
    accessorKey: 'tournament',
    header: '토너먼트',
    cell: ({ row }) => row.getValue('tournament')
  },
  {
    accessorKey: 'prize',
    header: '상금',
    cell: ({ row }) =>
      Number(row.getValue('prize')).toLocaleString('ko-KR', {
        style: 'currency',
        currency: 'KRW'
      })
  }
];

interface GameWinHistorySectionProps {
  user: User;
}

export default function GameWinHistorySection({
  user
}: GameWinHistorySectionProps) {
  const winHistories = mockGameWinHistories.filter(
    (item) => item.user_id === user.id
  );

  const table = useReactTable({
    data: winHistories,
    columns: columns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Section>
      <SectionTitle>게임 우승 이력</SectionTitle>
      <SectionContent>
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
        <TablePagination table={table} />
      </SectionContent>
    </Section>
  );
}
