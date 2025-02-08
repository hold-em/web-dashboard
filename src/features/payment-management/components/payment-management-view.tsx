'use client';

import { useState } from 'react';
import { PaymentHistory, mockPaymentHistories } from '@/mocks/payments';
import PaymentItemListSection from './payment-item-list-section';
import {
  SectionTopToolbar,
  BackButton,
  SectionTopButtonArea
} from '@/components/section';
import PaymentItemDialog from './payment-item-form-dialog';
import { Button } from '@/components/ui/button';
import PaymentListSection from './payment-list-section';

interface PaymentManagementViewProps {}

export default function PaymentManagementView({}: PaymentManagementViewProps) {
  const [paymentHistories, setPaymentHistores] =
    useState<PaymentHistory[]>(mockPaymentHistories);
  const [selectedPaymentHistory, setSelectedPaymentHistory] =
    useState<PaymentHistory | null>(null);

  const selectPaymentHistory = (paymentHistory: PaymentHistory) => {
    setSelectedPaymentHistory(paymentHistory);
    console.log(`선택됨 : `, paymentHistory);
  };

  return (
    <>
      <PaymentListSection
        paymentHistories={paymentHistories}
        selectPaymentHistory={selectPaymentHistory}
      />
    </>
  );
}
