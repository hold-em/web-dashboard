'use client';

import { useState } from 'react';
import { PaymentHistory, PaymentHistoryItem, Product } from '@/mocks/payments';
import PaymentHistoryListSection from './payment-history-list-section';
import PaymentAdditionSection from './payment-addition-section';
import { UserResponse } from '@/lib/api/types.gen';

interface PaymentManagementViewProps {
  products: Product[];
  paymentHistories: PaymentHistory[];
  paymentHistoryItems: PaymentHistoryItem[];
  users: UserResponse[];
  addPaymentHistory: (paymentHistory: PaymentHistory) => void;
  updatePaymentHistoryMemo?: (id: string, memo: string) => void;
}

export default function PaymentManagementView({
  products,
  paymentHistories,
  paymentHistoryItems,
  users,
  addPaymentHistory,
  updatePaymentHistoryMemo
}: PaymentManagementViewProps) {
  const [selectedPaymentHistory, setSelectedPaymentHistory] =
    useState<PaymentHistoryItem | null>(null);

  const selectPaymentHistory = (item: PaymentHistoryItem) => {
    setSelectedPaymentHistory(item);
  };

  return (
    <div className='space-y-8'>
      <PaymentAdditionSection
        products={products}
        users={users}
        addPaymentHistory={addPaymentHistory}
      />
      <PaymentHistoryListSection
        paymentHistories={paymentHistories}
        paymentHistoryItems={paymentHistoryItems}
        selectPaymentHistory={selectPaymentHistory}
        updatePaymentHistory={updatePaymentHistoryMemo}
      />
    </div>
  );
}
