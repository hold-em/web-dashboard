'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import {
  PaymentHistory,
  mockPaymentHistories,
  Product,
  mockProducts,
  PaymentHistoryItem
} from '@/mocks/payments';
import { Button } from '@/components/ui/button';
import { SectionTopToolbar, SectionTopButtonArea } from '@/components/section';
import ProductManagementView from './product-management-view';
import PaymentManagementView from './payment-management-view';
import { usePageNavigation } from '@/hooks/user-page-navigation';
import { Download } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { getStoreUsers } from '@/lib/api/sdk.gen';
import { UserResponse } from '@/lib/api/types.gen';

type PageState = 'management' | 'product';

export default function PaymentManagementPage() {
  const { page, navigateTo } = usePageNavigation<PageState>('management');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [paymentHistories, setPaymentHistories] =
    useState<PaymentHistory[]>(mockPaymentHistories);

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

  const paymentHistoryItems: PaymentHistoryItem[] = paymentHistories.map(
    (item) => {
      // UserResponse 타입에서 사용자 정보 찾기
      const user = users.find((user) => user.id === item.user_id);
      return {
        id: item.id,
        user_id: item.user_id, // user_id 필드 추가
        user_name: user ? user.name : '알 수 없음',
        price:
          products.find((paymentItem) => paymentItem.id === item.product_id)
            ?.price || 0,
        product_id: item.product_id, // product_id 필드 추가
        date: new Date(item.date).toISOString().split('T')[0],
        status: item.status,
        payment_method: item.payment_method,
        memo: item.memo
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
    setPaymentHistories((prev) => [...prev, paymentHistory]);
  };

  const addProduct = (product: Product) => {
    setProducts((prev) => [...prev, product]);
  };

  const updateProduct = (product: Product) => {
    setProducts((prev) =>
      prev.map((item) =>
        item.id === product.id ? { ...item, ...product } : item
      )
    );
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
          {!isUsersLoading && (
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
          addProduct={addProduct}
          updateProduct={updateProduct}
          goBack={goBack}
        />
      )}
    </PageContainer>
  );
}
