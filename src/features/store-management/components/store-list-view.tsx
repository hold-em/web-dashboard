'use client';

import * as React from 'react';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import StoreListSection from './store-list-section';
import { Button } from '@/components/ui/button';
import { PageState } from './store-management-page';
import { StoreRestResponse } from '@/lib/api';

interface StoreListViewProps {
  stores: StoreRestResponse[];
  selectStore: (store: StoreRestResponse, pageState: PageState) => void;
  goCreateForm: () => void;
}

export default function StoreListView({
  stores,
  selectStore,
  goCreateForm
}: StoreListViewProps) {
  return (
    <>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <Button variant='outline' onClick={goCreateForm}>
            매장 추가
          </Button>
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <StoreListSection stores={stores} selectStore={selectStore} />
    </>
  );
}
