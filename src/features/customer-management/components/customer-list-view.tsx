'use client';

import * as React from 'react';
import PageContainer from '@/components/layout/page-container';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import { mockUsers, User } from '@/mocks/users';
import CustomerListSection from './customer-list-section';
import AddTemporaryMemberDialog from './add-temporary-member-dialog';
import PushNotificationDialog from './push-notification-dialog';

interface CustomerListViewProps {
  selectUser: (user: User) => void;
}

export default function CustomerListView({
  selectUser
}: CustomerListViewProps) {
  const [users, setUsers] = React.useState<User[]>(mockUsers);
  const [checkedUsers, setCheckedUSers] = React.useState<User[]>([]);

  const handleAddUser = (user: User) => {
    setUsers((prev) => [...prev, user]);
  };

  return (
    <PageContainer>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <AddTemporaryMemberDialog addUser={handleAddUser} />
          <PushNotificationDialog
            checkedUsers={checkedUsers}
            pushNotification={(text) => {
              console.log(text);
            }}
          />
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <CustomerListSection
        users={users}
        selectUser={selectUser}
        setCheckedUsers={setCheckedUSers}
      />
    </PageContainer>
  );
}
