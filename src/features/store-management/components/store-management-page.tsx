'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Store, mockStores } from '@/mocks/stores';
import StoreListView from './store-list-view';
import StoreInfoView from './store-info-view';
import { usePageNavigation } from '@/hooks/user-page-navigation';

export type PageState = 'list' | 'create' | 'read' | 'update';

export default function StoreManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('list');
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const selectStore = (store: Store, newPage: PageState) => {
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

  const createStore = (store: Store) => {
    setStores((prev) => [...prev, store]);
    goBack();
  };

  const updateStore = (store: Store) => {
    setStores((prev) =>
      prev.map((item) => (item.id === store.id ? { ...item, ...store } : item))
    );
    goBack();
  };

  return (
    <PageContainer>
      {page === 'list' && (
        <StoreListView
          stores={stores}
          selectStore={selectStore}
          goCreateForm={goCreateForm}
        />
      )}
      {page !== 'list' && (
        <StoreInfoView
          selectedStore={selectedStore}
          goBack={goBack}
          pageState={page}
          createStore={createStore}
          updateStore={updateStore}
        />
      )}
    </PageContainer>
  );
}
