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
import { User, mockUsers } from '@/mocks/users';
import { usePageNavigation } from '@/hooks/user-page-navigation';

type PageState = 'management' | 'product';

export default function PaymentManagementPage() {
  const users: User[] = [...mockUsers];
  const { page, navigateTo } = usePageNavigation<PageState>('management');
  const [products, setProducts] = useState<Product[]>(mockProducts);
  const [paymentHistories, setPaymentHistories] =
    useState<PaymentHistory[]>(mockPaymentHistories);
  const paymentHistoryItems: PaymentHistoryItem[] = paymentHistories.map(
    (item) => {
      return {
        id: item.id,
        user_name: users.find((user) => user.id === item.user_id)!.name,
        price: products.find(
          (paymentItem) => paymentItem.id === item.product_id
        )!.price,
        date: new Date(item.date).toISOString().split('T')[0],
        status: item.status,
        payment_method: item.payment_method
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

  return (
    <PageContainer>
      {page === 'management' && (
        <>
          <SectionTopToolbar>
            <SectionTopButtonArea>
              <Button variant='outline' onClick={goProduct}>
                결제 항목 관리
              </Button>
            </SectionTopButtonArea>
          </SectionTopToolbar>
          <PaymentManagementView
            products={products}
            paymentHistories={paymentHistories}
            paymentHistoryItems={paymentHistoryItems}
            users={users}
            addPaymentHistory={addPaymentHistory}
          />
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
