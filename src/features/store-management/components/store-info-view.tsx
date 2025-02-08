'use client';

import * as React from 'react';
import { Store } from '@/mocks/stores';
import StoreInfoSection from './store-info-section';
import { PageState } from './store-management-page';
import { SectionTopToolbar, BackButton } from '@/components/section';

interface StoreInfoViewProps {
  selectedStore: Store | null;
  pageState: PageState;
  goBack: () => void;
  createStore: (store: Store) => void;
  updateStore: (store: Store) => void;
}

export default function StoreInfoView({
  selectedStore,
  pageState,
  goBack,
  createStore,
  updateStore
}: StoreInfoViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>매장 목록</BackButton>
      </SectionTopToolbar>
      <StoreInfoSection
        selectedStore={selectedStore}
        pageState={pageState}
        createStore={createStore}
        updateStore={updateStore}
      />
    </>
  );
}
