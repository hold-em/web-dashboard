'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import StoreListView from './store-list-view';
import StoreInfoView from './store-info-view';
import { usePageNavigation } from '@/hooks/user-page-navigation';
import { useStores } from '@/hooks/use-stores';
import { StoreRestResponse } from '@/lib/api';

export type PageState = 'list' | 'create' | 'read' | 'update';

export default function StoreManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('list');

  const { stores } = useStores();

  const [selectedStore, setSelectedStore] = useState<StoreRestResponse | null>(
    null
  );

  const selectStore = (store: StoreRestResponse, newPage: PageState) => {
    setSelectedStore(store);
    navigateTo(newPage);
  };

  const goBack = () => {
    setSelectedStore(null);
    navigateTo('list');
  };

  const goCreateForm = () => {
    navigateTo('create');
  };

  return (
    <PageContainer>
      {page === 'list' && (
        <StoreListView
          stores={stores ?? []}
          selectStore={selectStore}
          goCreateForm={goCreateForm}
        />
      )}
      {page !== 'list' && (
        <StoreInfoView
          selectedStore={selectedStore}
          goBack={goBack}
          pageState={page}
        />
      )}
    </PageContainer>
  );
}
