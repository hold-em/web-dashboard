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
import { PageState } from './admin-management-page';
import { useUsers } from '@/hooks/use-users';
import { toast } from 'sonner';

interface UserListSectionProps {
  users: any[];
  selectUser: (user: any, pageState: PageState) => void;
}

export default function UserListSection({
  users,
  selectUser
}: UserListSectionProps) {
  const { makeUserManager, deleteUser, isDeleting, isMakingManager } =
    useUsers();

  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      created_at: false
    });

  const handleMakeManager = async (userId: string) => {
    try {
      await makeUserManager(userId);
      toast.success('사용자가 관리자로 임명되었습니다.');
    } catch (error) {
      toast.error('관리자 임명에 실패했습니다.');
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!confirm('정말로 이 사용자를 삭제하시겠습니까?')) {
      return;
    }

    try {
      await deleteUser(userId);
      toast.success('사용자가 삭제되었습니다.');
    } catch (error) {
      toast.error('사용자 삭제에 실패했습니다.');
    }
  };

  const columns = React.useMemo<ColumnDef<any>[]>(
    () => [
      {
        accessorKey: 'name',
        header: '이름',
        cell: ({ row }) => <div>{row.getValue('name') || '이름 없음'}</div>
      },
      {
        accessorKey: 'email',
        header: '이메일',
        cell: ({ row }) => <div>{row.getValue('email')}</div>
      },
      {
        accessorKey: 'role',
        header: '역할',
        cell: ({ row }) => <div>{row.getValue('role')}</div>
      },
      {
        accessorKey: 'created_at',
        header: '가입일',
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
              onClick={() => {
                selectUser(row.original, 'read');
              }}
            >
              상세정보
            </Button>
            {/* <Button
              variant='secondary'
              size='sm'
              onClick={() => selectUser(row.original, 'update')}
            >
              수정
            </Button> */}
            {row.original.role !== 'STORE_MANAGER' &&
              row.original.role !== 'SYSTEM_ADMIN' && (
                <Button
                  variant='outline'
                  size='sm'
                  onClick={() => handleMakeManager(row.original.id)}
                  disabled={isMakingManager}
                >
                  관리자 임명
                </Button>
              )}
            {/* <Button
              variant='destructive'
              size='sm'
              onClick={() => handleDeleteUser(row.original.id)}
              disabled={isDeleting}
            >
              삭제
            </Button> */}
          </div>
        )
      }
    ],
    [
      selectUser,
      handleMakeManager,
      handleDeleteUser,
      isMakingManager,
      isDeleting
    ]
  );

  const table = useReactTable({
    data: users,
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
      <SectionTitle>사용자 목록</SectionTitle>
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
