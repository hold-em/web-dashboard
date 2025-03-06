'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import UserListView from './user-list-view';
import UserInfoView from './user-info-view';
import { usePageNavigation } from '@/hooks/user-page-navigation';
import { useUsers } from '@/hooks/use-users';

export type PageState = 'list' | 'read' | 'update';

export default function AdminManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('list');
  const { users } = useUsers();

  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  const selectUser = (user: any, newPage: PageState) => {
    setSelectedUser(user);
    navigateTo(newPage);
  };

  const goBack = () => {
    setSelectedUser(null);
    navigateTo('list');
  };

  return (
    <PageContainer>
      {page === 'list' && (
        <UserListView users={users?.data ?? []} selectUser={selectUser} />
      )}
      {page !== 'list' && (
        <UserInfoView
          selectedUser={selectedUser}
          goBack={goBack}
          pageState={page}
        />
      )}
    </PageContainer>
  );
}
