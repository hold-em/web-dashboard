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
import { PaymentRestResponse } from '@/lib/api/types.gen';
import { PAGE_SIZE } from '@/constants/common';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription
} from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';

const statusItems = [
  { label: '전체', value: '' },
  { label: '대기', value: 'PENDING' },
  { label: '완료', value: 'PAID' },
  { label: '취소', value: 'CANCELED' }
];

interface PaymentListProps {
  paymentHistoryItems: PaymentRestResponse[];
  updatePaymentHistoryMemo?: (id: string, memo: string) => void;
}

export default function PaymentListSection({
  paymentHistoryItems,
  updatePaymentHistoryMemo
}: PaymentListProps) {
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [memoDialogOpen, setMemoDialogOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<PaymentRestResponse | null>(
    null
  );
  const [memo, setMemo] = useState('');

  const handleExportToExcel = () => {
    // 실제 구현에서는 엑셀 다운로드 로직 구현
    console.log('Export to Excel');
  };

  const openMemoDialog = (item: PaymentRestResponse) => {
    setSelectedItem(item);
    setMemo(item.memo || '');
    setMemoDialogOpen(true);
  };

  const saveMemo = () => {
    if (selectedItem && updatePaymentHistoryMemo) {
      updatePaymentHistoryMemo(selectedItem.id, memo);
    }
    setMemoDialogOpen(false);
  };

  const columns = React.useMemo<ColumnDef<PaymentRestResponse>[]>(
    () => [
      {
        accessorKey: 'payed_by',
        header: '고객',
        cell: ({ row }) => <div>{row.getValue('payed_by')}</div>
      },
      {
        accessorKey: 'total_price',
        header: '금액',
        cell: ({ row }) =>
          Number(row.getValue('total_price')).toLocaleString('ko-KR', {
            style: 'currency',
            currency: 'KRW'
          })
      },
      {
        accessorKey: 'payment_status',
        header: '상태',
        cell: ({ row }) => {
          const status = row.getValue('payment_status') as string;
          let statusText = '';
          let statusClass = '';

          switch (status) {
            case 'PENDING':
              statusText = '대기';
              statusClass = 'bg-yellow-100 text-yellow-800';
              break;
            case 'PAID':
              statusText = '완료';
              statusClass = 'bg-green-100 text-green-800';
              break;
            case 'CANCELED':
              statusText = '취소';
              statusClass = 'bg-red-100 text-red-800';
              break;
            default:
              statusText = status;
              statusClass = 'bg-gray-100 text-gray-800';
          }

          return (
            <div
              className={`inline-block rounded-full px-2 py-1 text-xs font-semibold ${statusClass}`}
            >
              {statusText}
            </div>
          );
        }
      },
      {
        accessorKey: 'created_at',
        header: '날짜',
        cell: ({ row }) => new Date(row.getValue('created_at')).toLocaleString()
      },
      {
        accessorKey: 'memo',
        header: '메모',
        cell: ({ row }) => {
          const memo = row.getValue('memo') as string | undefined;
          return memo ? memo : '-';
        }
      },
      {
        id: 'actions',
        header: '관리',
        cell: ({ row }) => {
          return (
            <div className='flex items-center gap-2'>
              <Button
                variant='ghost'
                size='icon'
                onClick={() => openMemoDialog(row.original)}
              >
                <Pencil className='h-4 w-4' />
              </Button>
            </div>
          );
        }
      }
    ],
    []
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
          {/* <Input
            placeholder='고객 검색'
            value={
              (table.getColumn('user_name')?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table.getColumn('user_name')?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          /> */}
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
              {/* <DropdownMenuContent align='end'>
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
              </DropdownMenuContent> */}
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
