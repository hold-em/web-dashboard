'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { ChevronDown, Check } from 'lucide-react';
import { Section, SectionContent, SectionTitle } from '@/components/section';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import TablePagination from '@/components/table-pagination';
import { PaymentHistory, PaymentHistoryItem } from '@/mocks/payments';
import { PAGE_SIZE } from '@/constants/common';

const statusItems = [
  { label: '전체', value: '' },
  { label: '대기', value: '대기' },
  { label: '완료', value: '완료' }
];

interface PaymentListProps {
  paymentHistories: PaymentHistory[];
  paymentHistoryItems: PaymentHistoryItem[];
  selectPaymentHistory: (item: PaymentHistoryItem) => void;
}

export default function PaymentListSection({
  selectPaymentHistory,
  paymentHistoryItems
}: PaymentListProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );

  const columns = React.useMemo<ColumnDef<PaymentHistoryItem>[]>(
    () => [
      {
        accessorKey: 'user_name',
        header: '고객',
        cell: ({ row }) => <div>{row.getValue('user_name')}</div>
      },
      {
        accessorKey: 'price',
        header: '금액',
        cell: ({ row }) => (
          <div>{Number(row.getValue('price')).toLocaleString()}원</div>
        )
      },
      {
        accessorKey: 'payment_method',
        header: '결제수단',
        cell: ({ row }) => <div>{row.getValue('payment_method')}</div>
      },
      {
        accessorKey: 'date',
        header: '날짜',
        cell: ({ row }) => <div>{row.getValue('date')}</div>
      },
      {
        accessorKey: 'status',
        header: '상태',
        cell: ({ row }) => <div>{row.getValue('status')}</div>
      },
      {
        id: 'actions',
        enableHiding: false,
        header: '관리',
        cell: ({ row }) => (
          <Button
            variant='secondary'
            size='sm'
            onClick={() => selectPaymentHistory(row.original)}
          >
            상세정보
          </Button>
        )
      }
    ],
    [selectPaymentHistory]
  );

  const table = useReactTable({
    data: paymentHistoryItems,
    columns,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      columnFilters
    },
    initialState: {
      sorting: [{ id: 'date', desc: true }],
      pagination: { pageSize: PAGE_SIZE }
    }
  });

  return (
    <Section>
      <SectionTitle>결제 목록</SectionTitle>
      <SectionContent>
        <div className='flex items-center justify-between gap-2 py-4'>
          <Input
            placeholder='고객 검색'
            value={
              (table.getColumn('user_name')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('user_name')?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='flex-none'>
                결제 상태 <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {(() => {
                const currentStatus = table
                  .getColumn('status')
                  ?.getFilterValue() as string | undefined;
                return statusItems.map((item) => {
                  const isChecked =
                    item.value === ''
                      ? !currentStatus || currentStatus === ''
                      : currentStatus === item.value;
                  return (
                    <DropdownMenuItem
                      key={item.value}
                      onClick={() =>
                        table.getColumn('status')?.setFilterValue(item.value)
                      }
                    >
                      {isChecked && <Check className='mr-2 h-4 w-4' />}
                      {item.label}
                    </DropdownMenuItem>
                  );
                });
              })()}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
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
