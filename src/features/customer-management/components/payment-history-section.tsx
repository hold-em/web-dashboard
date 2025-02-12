import * as React from 'react';
import { Section, SectionContent, SectionTitle } from '@/components/section';
import { User, mockPaymentHistories, PaymentHistory } from '@/mocks/users';
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
  TableRow
} from '@/components/ui/table';
import TablePagination from '@/components/table-pagination';

const paymentColumns: ColumnDef<PaymentHistory>[] = [
  {
    accessorKey: 'date',
    header: '날짜',
    cell: ({ row }) => new Date(row.getValue('date')).toLocaleDateString()
  },
  {
    accessorKey: 'item',
    header: '이용 항목',
    cell: ({ row }) => row.getValue('item')
  },
  {
    accessorKey: 'amount',
    header: '금액',
    cell: ({ row }) =>
      Number(row.getValue('amount')).toLocaleString('ko-KR', {
        style: 'currency',
        currency: 'KRW'
      })
  },
  {
    accessorKey: 'method',
    header: '결제 방법',
    cell: ({ row }) => row.getValue('method')
  }
];

interface PaymentHistorySectionProps {
  user: User;
}

export default function PaymentHistorySection({
  user
}: PaymentHistorySectionProps) {
  const histories = mockPaymentHistories.filter(
    (item) => item.user_id === user.id
  );

  const table = useReactTable({
    data: histories,
    columns: paymentColumns,
    getCoreRowModel: getCoreRowModel()
  });

  return (
    <Section>
      <SectionTitle>결제 이력</SectionTitle>
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
            {table.getRowModel().rows.map((row) => (
              <TableRow key={row.id}>
                {row.getVisibleCells().map((cell) => (
                  <TableCell key={cell.id}>
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </TableCell>
                ))}
              </TableRow>
            ))}
            {table.getRowModel().rows.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={paymentColumns.length}
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
