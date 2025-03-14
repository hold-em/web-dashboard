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
import { ChevronDown, Check, Download, Pencil } from 'lucide-react';
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
import { PaymentHistory, PaymentHistoryItem } from './payment-management-page';
import { PAGE_SIZE } from '@/constants/common';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const statusItems = [
  { label: '전체', value: '' },
  { label: '대기', value: '대기' },
  { label: '완료', value: '완료' }
];

interface PaymentListProps {
  paymentHistories: PaymentHistory[];
  paymentHistoryItems: PaymentHistoryItem[];
  selectPaymentHistory: (item: PaymentHistoryItem) => void;
  updatePaymentHistory?: (id: string, memo: string) => void;
}

export default function PaymentListSection({
  selectPaymentHistory,
  paymentHistoryItems,
  updatePaymentHistory
}: PaymentListProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [memoDialogOpen, setMemoDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PaymentHistoryItem | null>(
    null
  );
  const [memo, setMemo] = useState('');

  const handleExportToExcel = () => {
    // 실제 구현에서는 엑셀 다운로드 로직 구현
    console.log('Export to Excel');
  };

  const openMemoDialog = (item: PaymentHistoryItem) => {
    setSelectedItem(item);
    setMemo(item.memo || '');
    setMemoDialogOpen(true);
  };

  const saveMemo = () => {
    if (selectedItem && updatePaymentHistory) {
      updatePaymentHistory(selectedItem.id, memo);
    }
    setMemoDialogOpen(false);
  };

  const columns = React.useMemo<ColumnDef<PaymentHistoryItem>[]>(
    () => [
      {
        accessorKey: 'user_name',
        header: '고객',
        cell: ({ row }) => <div>{row.getValue('user_name')}</div>
      },
      {
        accessorKey: 'price',
        header: '상품 금액',
        cell: ({ row }) => <div>-</div>
      },
      {
        accessorKey: 'amount',
        header: '결제 금액',
        cell: ({ row }) => {
          const amount = row.getValue('amount');
          return (
            <div>{amount ? Number(amount).toLocaleString() + '원' : '-'}</div>
          );
        }
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
        accessorKey: 'memo',
        header: '메모',
        cell: ({ row }) => (
          <div className='flex items-center'>
            <span className='max-w-[150px] truncate'>
              {row.getValue('memo') || '-'}
            </span>
            {updatePaymentHistory && (
              <Button
                variant='ghost'
                size='icon'
                onClick={(e) => {
                  e.stopPropagation();
                  openMemoDialog(row.original);
                }}
              >
                <Pencil className='h-4 w-4' />
              </Button>
            )}
          </div>
        )
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
    [selectPaymentHistory, updatePaymentHistory]
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
          <div className='flex gap-2'>
            <Button
              variant='outline'
              onClick={handleExportToExcel}
              className='flex items-center'
            >
              <Download className='mr-2 h-4 w-4' />
              엑셀 다운로드
            </Button>
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

      <Dialog open={memoDialogOpen} onOpenChange={setMemoDialogOpen}>
        <DialogContent className='sm:max-w-[425px]'>
          <DialogHeader>
            <DialogTitle>메모 편집</DialogTitle>
          </DialogHeader>
          <div className='grid gap-4 py-4'>
            <Textarea
              placeholder='메모를 입력하세요'
              value={memo}
              onChange={(e) => setMemo(e.target.value)}
              className='min-h-[100px]'
            />
          </div>
          <DialogFooter>
            <Button type='button' onClick={saveMemo}>
              저장
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </Section>
  );
}
