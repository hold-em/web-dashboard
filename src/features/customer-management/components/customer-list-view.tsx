'use client';

import * as React from 'react';
import PageContainer from '@/components/layout/page-container';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import CustomerListSection from './customer-list-section';
import AddTemporaryMemberDialog from './add-temporary-member-dialog';
import PushNotificationDialog from './push-notification-dialog';
import { UserResponse } from '@/lib/api/types.gen';
import { useQuery } from '@tanstack/react-query';
import { getStoreUsers } from '@/lib/api/sdk.gen';

interface CustomerListViewProps {
  selectUser: (user: UserResponse) => void;
}

export default function CustomerListView({
  selectUser
}: CustomerListViewProps) {
  // API에서 사용자 데이터 가져오기
  const { data: usersData, isLoading } = useQuery({
    queryKey: ['storeUsers'],
    queryFn: async () => {
      // 현재 매장 ID를 가져와야 합니다. 임시로 1로 설정
      const storeId = 1;
      const response = await getStoreUsers({
        path: { storeId }
      });
      return response.data?.data || [];
    }
  });

  const [users, setUsers] = React.useState<UserResponse[]>([]);
  const [checkedUsers, setCheckedUSers] = React.useState<UserResponse[]>([]);

  // API 데이터가 로드되면 상태 업데이트
  React.useEffect(() => {
    if (usersData) {
      setUsers(usersData);
    }
  }, [usersData]);

  const handleAddUser = (user: UserResponse) => {
    setUsers((prev) => [...prev, user]);
  };

  if (isLoading) {
    return <div>로딩 중...</div>;
  }

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
