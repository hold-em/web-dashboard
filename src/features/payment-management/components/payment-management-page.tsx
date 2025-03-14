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
import { UserResponse, PayableItemRestResponse } from '@/lib/api/types.gen';
import { usePayableItems } from '@/hooks/use-payable-items';
import { v4 as uuidv4 } from 'uuid';

type PageState = 'management' | 'product';

// Define interfaces directly here instead of importing from mocks
export interface Product {
  id: string;
  name: string;
  created_at: string;
  position?: number;
}

export interface PaymentHistory {
  id: string;
  user_id: string;
  product_id: string;
  payment_method: string;
  date: string;
  status: string;
  memo?: string;
  amount?: number;
}

export interface PaymentHistoryItem {
  id: string;
  user_id: string;
  user_name: string;
  product_id: string;
  price: number; // 실제 가격 정보는 없으며, UI 표시용으로만 사용
  date: string;
  status: string;
  payment_method: string;
  memo: string;
  amount: number;
}

// PayableItemRestResponse 타입을 Product 타입으로 변환하는 어댑터 함수
const adaptPayableItemToProduct = (item: PayableItemRestResponse): Product => {
  return {
    id: item.id,
    name: item.name,
    created_at: item.created_at,
    position: item.position
  };
};

export default function PaymentManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('management');
  const [paymentHistories, setPaymentHistories] = useState<PaymentHistory[]>(
    []
  );

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
  const products = payableItemsList.map(adaptPayableItemToProduct);

  const paymentHistoryItems: PaymentHistoryItem[] = paymentHistories.map(
    (item) => {
      // UserResponse 타입에서 사용자 정보 찾기
      const user = users.find((user) => user.id === item.user_id);

      return {
        id: item.id,
        user_id: item.user_id,
        user_name: user?.name || '알 수 없음',
        price: 0, // 가격 정보 없음
        product_id: item.product_id,
        date: new Date(item.date).toISOString().split('T')[0],
        status: item.status,
        payment_method: item.payment_method,
        memo: item.memo || '',
        amount: item.amount || 0
      };
    }
  );

  const goBack = () => {
    navigateTo('management');
  };

  const goProduct = () => {
    navigateTo('product');
  };

  const addPaymentHistory = (paymentHistory: PaymentHistory) => {
    const newPaymentHistory = {
      ...paymentHistory,
      id: uuidv4(),
      date: new Date().toISOString()
    };
    setPaymentHistories((prev) => [...prev, newPaymentHistory]);
  };

  const updatePaymentHistoryMemo = (id: string, memo: string) => {
    setPaymentHistories((prev) =>
      prev.map((item) => (item.id === id ? { ...item, memo } : item))
    );
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
            <PaymentManagementView
              products={products}
              paymentHistories={paymentHistories}
              paymentHistoryItems={paymentHistoryItems}
              users={users}
              addPaymentHistory={addPaymentHistory}
              updatePaymentHistoryMemo={updatePaymentHistoryMemo}
            />
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
