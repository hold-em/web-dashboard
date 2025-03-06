'use client';

import * as React from 'react';
import { PageState } from './admin-management-page';
import {
  SectionTopToolbar,
  SectionTopButtonArea,
  BackButton
} from '@/components/section';
import UserInfoSection from './user-info-section';

interface UserInfoViewProps {
  selectedUser: any | null;
  goBack: () => void;
  pageState: PageState;
}

export default function UserInfoView({
  selectedUser,
  goBack,
  pageState
}: UserInfoViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>사용자 목록</BackButton>
      </SectionTopToolbar>

      <UserInfoSection selectedUser={selectedUser} pageState={pageState} />
    </>
  );
}
