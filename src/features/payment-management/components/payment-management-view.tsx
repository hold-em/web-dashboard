'use client';

import { useState } from 'react';
import { PaymentHistory, Product, PaymentHistoryItem } from '@/mocks/payments';
import PaymentListSection from './payment-history-list-section';
import PaymentAdditionSection from './payment-addition-section';
import { User } from '@/mocks/users';

interface PaymentManagementViewProps {
  products: Product[];
  paymentHistories: PaymentHistory[];
  paymentHistoryItems: PaymentHistoryItem[];
  users: User[];
  addPaymentHistory: (paymentHistory: PaymentHistory) => void;
}

export default function PaymentManagementView({
  products,
  paymentHistories,
  paymentHistoryItems,
  users,
  addPaymentHistory
}: PaymentManagementViewProps) {
  const [selectedPaymentHistory, setSelectedPaymentHistory] =
    useState<PaymentHistoryItem | null>(null);

  const selectPaymentHistory = (paymentHistory: PaymentHistoryItem) => {
    setSelectedPaymentHistory(paymentHistory);
    console.log(`선택됨 : `, paymentHistory);
  };

  return (
    <>
      <PaymentListSection
        paymentHistories={paymentHistories}
        paymentHistoryItems={paymentHistoryItems}
        selectPaymentHistory={selectPaymentHistory}
      />
      <PaymentAdditionSection
        products={products}
        users={users}
        addPaymentHistory={addPaymentHistory}
      />
    </>
  );
}
