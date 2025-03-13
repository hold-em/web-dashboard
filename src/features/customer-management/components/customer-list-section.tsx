'use client';

import * as React from 'react';
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
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
import { Checkbox } from '@/components/ui/checkbox';
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
import { PAGE_SIZE } from '@/constants/common';
import { UserResponse } from '@/lib/api/types.gen';

const statusItems = [
  { label: '전체', value: '' },
  { label: '정회원', value: 'NORMAL' },
  { label: '임시회원', value: 'TEMP' }
];

interface CustomerListProps {
  users: UserResponse[];
  selectUser: (user: UserResponse) => void;
  setCheckedUsers: (checkedUsers: UserResponse[]) => void;
}

export default function CustomerListSection({
  users,
  selectUser,
  setCheckedUsers
}: CustomerListProps) {
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: 'created_at', desc: true }
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({ created_at: false });
  const [rowSelection, setRowSelection] = React.useState({});

  const columns = React.useMemo<ColumnDef<UserResponse>[]>(
    () => [
      {
        id: 'select',
        header: ({ table }) => (
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label='Select all'
          />
        ),
        cell: ({ row }) => (
          <Checkbox
            checked={row.getIsSelected()}
            onCheckedChange={(value) => row.toggleSelected(!!value)}
            aria-label='Select row'
          />
        ),
        enableSorting: false,
        enableHiding: false
      },
      {
        accessorKey: 'name',
        header: '이름',
        cell: ({ row }) => <div>{row.getValue('name')}</div>
      },
      {
        accessorKey: 'phone_number',
        header: '전화번호',
        cell: ({ row }) => <div>{row.getValue('phone_number')}</div>
      },
      {
        accessorKey: 'email_address',
        header: '이메일',
        cell: ({ row }) => <div>{row.getValue('email_address')}</div>
      },
      {
        accessorKey: 'type',
        header: '회원 상태',
        cell: ({ row }) => (
          <div>{row.getValue('type') === 'NORMAL' ? '정회원' : '임시회원'}</div>
        )
      },
      {
        accessorKey: 'created_by',
        header: '가입일',
        cell: ({ row }) => <div>{row.getValue('created_by')}</div>
      },
      {
        id: 'actions',
        enableHiding: false,
        cell: ({ row }) => (
          <Button
            variant='secondary'
            size='sm'
            onClick={() => selectUser(row.original)}
          >
            상세정보
          </Button>
        )
      }
    ],
    [selectUser]
  );

  const table = useReactTable({
    data: users,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection
    },
    initialState: {
      sorting: [{ id: 'created_at', desc: true }],
      pagination: { pageSize: PAGE_SIZE },
      columnVisibility: { created_at: false }
    }
  });

  const checkedUsers = React.useMemo(() => {
    return table.getSelectedRowModel().rows.map((row) => row.original);
  }, [table.getSelectedRowModel().rows]);

  React.useEffect(() => {
    setCheckedUsers(checkedUsers);
  }, [checkedUsers]);

  return (
    <Section>
      <SectionTitle>
        {users.length ? `고객 목록 (${users.length})` : '고객 목록'}
      </SectionTitle>
      <SectionContent>
        <div className='flex items-center justify-between gap-2 py-4'>
          <Input
            placeholder='고객 검색'
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
            }
            className='max-w-sm'
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant='outline' className='flex-none'>
                회원유형 <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align='end'>
              {(() => {
                const currentStatus = table
                  .getColumn('member_status')
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
                        table
                          .getColumn('member_status')
                          ?.setFilterValue(item.value)
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
