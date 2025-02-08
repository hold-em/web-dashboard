'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Store, mockStores } from '@/mocks/stores';
import StoreListView from './store-list-view';
import StoreInfoView from './store-info-view';

export type PageState = 'list' | 'create' | 'read' | 'update';

export default function StoreManagementPage() {
  const [pageState, setPageState] = useState<PageState>('list');
  const [stores, setStores] = useState<Store[]>(mockStores);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);

  const selectStore = (store: Store, pageState: PageState) => {
    setSelectedStore(store);
    setPageState(pageState);
  };

  const goBack = () => {
    setSelectedStore(null);
    setPageState('list');
  };

  const moveCreateForm = () => {
    setPageState('create');
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
      {pageState === 'list' && (
        <StoreListView
          stores={stores}
          selectStore={selectStore}
          moveCreateForm={moveCreateForm}
        />
      )}
      {pageState !== 'list' && (
        <StoreInfoView
          selectedStore={selectedStore}
          goBack={goBack}
          pageState={pageState}
          createStore={createStore}
          updateStore={updateStore}
        />
      )}
    </PageContainer>
  );
}
