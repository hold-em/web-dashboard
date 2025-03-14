'use client';

import { useState } from 'react';
import PaymentHistoryListSection from './payment-history-list-section';
import PaymentAdditionSection from './payment-addition-section';
import {
  UserResponse,
  PayableItemRestResponse,
  PaymentRestResponse
} from '@/lib/api/types.gen';
import { usePayments } from '../utils/use-payments';

interface PaymentManagementViewProps {
  products: PayableItemRestResponse[];
  users: UserResponse[];
}

export default function PaymentManagementView({
  products,
  users
}: PaymentManagementViewProps) {
  const { payments, updatePayment } = usePayments();

  // 메모 업데이트 핸들러
  const handleUpdateMemo = (id: string, memo: string) => {
    updatePayment({
      paymentId: id,
      memo
    });
  };

  return (
    <div className='space-y-8'>
      <PaymentAdditionSection products={products} users={users} />
      <PaymentHistoryListSection
        paymentHistoryItems={payments}
        updatePaymentHistoryMemo={handleUpdateMemo}
      />
    </div>
  );
}
