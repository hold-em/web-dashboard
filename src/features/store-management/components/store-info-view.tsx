'use client';

import * as React from 'react';
import StoreInfoSection from './store-info-section';
import { PageState } from './store-management-page';
import { SectionTopToolbar, BackButton } from '@/components/section';
import { StoreRestResponse } from '@/lib/api';
interface StoreInfoViewProps {
  selectedStore: StoreRestResponse | null;
  pageState: PageState;
  goBack: () => void;
}

export default function StoreInfoView({
  selectedStore,
  pageState,
  goBack
}: StoreInfoViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>매장 목록</BackButton>
      </SectionTopToolbar>
      <StoreInfoSection selectedStore={selectedStore} pageState={pageState} />
    </>
  );
}
