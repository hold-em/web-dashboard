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
  TableRow,
  TablePagination
} from '@/components/ui/table';
import { User } from '@/mocks/users';
import { PAGE_SIZE } from '@/constants/common';

const statusItems = [
  { label: '전체', value: '' },
  { label: '정회원', value: '정회원' },
  { label: '임시회원', value: '임시회원' }
];

interface CustomerListProps {
  users: User[];
  selectUser: (user: User) => void;
  setCheckedUsers: (checkedUsers: User[]) => void;
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

  const columns = React.useMemo<ColumnDef<User>[]>(
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
        accessorKey: 'phone',
        header: '전화번호',
        cell: ({ row }) => <div>{row.getValue('phone')}</div>
      },
      {
        accessorKey: 'email',
        header: '이메일',
        cell: ({ row }) => <div>{row.getValue('email')}</div>
      },
      {
        accessorKey: 'member_status',
        header: '회원유형',
        cell: ({ row }) => <div>{row.getValue('member_status')}</div>
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
          <Button
            variant='outline'
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
        <div className='flex items-center justify-between py-4'>
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
              <Button variant='outline'>
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
