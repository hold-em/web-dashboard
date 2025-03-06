'use client';

import * as React from 'react';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import UserListSection from './user-list-section';
import { Input } from '@/components/ui/input';
import { PageState } from './admin-management-page';

interface UserListViewProps {
  users: any[];
  selectUser: (user: any, pageState: PageState) => void;
}

export default function UserListView({ users, selectUser }: UserListViewProps) {
  const [searchQuery, setSearchQuery] = React.useState('');

  const filteredUsers = React.useMemo(() => {
    if (!searchQuery.trim()) return users;

    const query = searchQuery.toLowerCase();
    return users.filter(
      (user) =>
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query)
    );
  }, [users, searchQuery]);

  return (
    <>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <Input
            placeholder='사용자 검색 (이름 또는 이메일)'
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className='max-w-md'
          />
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <UserListSection users={filteredUsers} selectUser={selectUser} />
    </>
  );
}
