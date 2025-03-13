'use client';

import * as React from 'react';
import CustomerListView from './customer-list-view';
import CustomerDetailView from './customer-detail-view';
import { usePageNavigation } from '@/hooks/user-page-navigation';
import { UserResponse } from '@/lib/api/types.gen';

export type PageState = 'list' | 'detail';

export default function CustomerManagementViewPage() {
  const { navigateTo } = usePageNavigation<PageState>('list');
  const [selectedUser, setSelectedUser] = React.useState<UserResponse | null>(
    null
  );

  const goBack = () => {
    setSelectedUser(null);
    navigateTo('list');
  };

  const selectUser = (user: UserResponse) => {
    setSelectedUser(user);
    navigateTo('detail');
  };

  return (
    <>
      {!selectedUser && <CustomerListView selectUser={selectUser} />}
      {selectedUser && (
        <CustomerDetailView user={selectedUser} goBack={goBack} />
      )}
    </>
  );
}
