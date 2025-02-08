'use client';

import * as React from 'react';
import { User } from '@/mocks/users';
import CustomerListView from './customer-list-view';
import CustomerDetailView from './customer-detail-view';

export default function CustomerManagementViewPage() {
  const [selectedUser, setSelectedUser] = React.useState<User | null>(null);

  const goBack = () => {
    setSelectedUser(null);
  };

  return (
    <>
      {!selectedUser && <CustomerListView selectUser={setSelectedUser} />}
      {selectedUser && (
        <CustomerDetailView user={selectedUser} goBack={goBack} />
      )}
    </>
  );
}
