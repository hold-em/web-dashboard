'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import { Button } from '@/components/ui/button';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import ProductManagementView from './product-management-view';
import PaymentManagementView from './payment-management-view';
import { usePageNavigation } from '@/hooks/user-page-navigation';
import { Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStoreUsers } from '@/lib/api/sdk.gen';
import {
  UserResponse,
  PayableItemRestResponse,
  PaymentRestResponse
} from '@/lib/api/types.gen';
import { usePayableItems } from '@/hooks/use-payable-items';

type PageState = 'management' | 'product';

// Remove custom types and use the generated types directly
// No need for adapter function anymore since we're using the API types directly

export default function PaymentManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('management');

  // 결제 항목 데이터 가져오기
  const {
    payableItems,
    isLoading: isPayableItemsLoading,
    createPayableItem,
    updatePayableItem
  } = usePayableItems();

  // API에서 사용자 데이터 가져오기
  const { data: usersData, isLoading: isUsersLoading } = useQuery({
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

  const users: UserResponse[] = usersData || [];
  const payableItemsList = payableItems?.data || [];
  // Use the PayableItemRestResponse directly
  const products = payableItemsList;

  const goBack = () => {
    navigateTo('management');
  };

  const goProduct = () => {
    navigateTo('product');
  };

  const handleExportToExcel = () => {
    // 실제 구현에서는 엑셀 다운로드 로직 구현
    console.log('Export to Excel');
  };

  const isLoading = isUsersLoading || isPayableItemsLoading;

  return (
    <PageContainer>
      {page === 'management' && (
        <>
          <SectionTopToolbar>
            <SectionTopButtonArea>
              <Button
                variant='outline'
                onClick={handleExportToExcel}
                className='mr-2'
              >
                <Download className='mr-2 h-4 w-4' />
                엑셀 다운로드
              </Button>
              <Button variant='outline' onClick={goProduct}>
                결제 항목 관리
              </Button>
            </SectionTopButtonArea>
          </SectionTopToolbar>
          {!isLoading && (
            <PaymentManagementView products={products} users={users} />
          )}
        </>
      )}
      {page === 'product' && (
        <ProductManagementView
          products={products}
          addProduct={(product) =>
            createPayableItem({
              name: product.name,
              position: product.position || 0
            })
          }
          updateProduct={(product) =>
            updatePayableItem({
              id: product.id,
              data: {
                name: product.name,
                position: product.position || 0
              }
            })
          }
          goBack={goBack}
        />
      )}
    </PageContainer>
  );
}
