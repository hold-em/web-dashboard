'use client';

import { useState } from 'react';
import { PaymentItem, mockPaymentItems } from '@/mocks/payments';
import PaymentItemListSection from './payment-item-list-section';
import {
  SectionTopToolbar,
  BackButton,
  SectionTopButtonArea
} from '@/components/section';
import PaymentItemDialog from './payment-item-form-dialog';
import { Button } from '@/components/ui/button';

interface PaymentItemManagementViewProps {
  goBack: () => void;
}

export default function PaymentItemManagementView({
  goBack
}: PaymentItemManagementViewProps) {
  const [paymentItems, setPaymentItems] =
    useState<PaymentItem[]>(mockPaymentItems);
  const [open, setOpen] = useState<boolean>(false);
  const [selectedPaymentItem, setSelectedPaymentItem] =
    useState<PaymentItem | null>(null);

  const addPaymentItem = (paymentItem: PaymentItem) => {
    setPaymentItems((prev) => [...prev, paymentItem]);
  };

  const updatePaymentItem = (paymentItem: PaymentItem) => {
    setPaymentItems((prev) =>
      prev.map((item) =>
        item.id === paymentItem.id ? { ...item, ...paymentItem } : item
      )
    );
    setSelectedPaymentItem(null);
  };

  const selectPaymentItem = (paymentItem: PaymentItem) => {
    setSelectedPaymentItem(paymentItem);
    setOpen(true);
  };

  return (
    <>
      <SectionTopToolbar>
        <BackButton onClick={goBack}>결제 목록</BackButton>
        <SectionTopButtonArea>
          <Button
            onClick={() => {
              setOpen(true);
              setSelectedPaymentItem(null);
            }}
          >
            결제 항목 추가
          </Button>
        </SectionTopButtonArea>
      </SectionTopToolbar>
      <PaymentItemListSection
        paymentItems={paymentItems}
        selectPaymentItem={selectPaymentItem}
      />
      <PaymentItemDialog
        addPaymentItem={addPaymentItem}
        updatePaymentItem={updatePaymentItem}
        initialData={selectedPaymentItem}
        open={open}
        setOpen={setOpen}
      />
    </>
  );
}
