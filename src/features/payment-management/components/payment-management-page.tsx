'use client';

import { useState } from 'react';
import PageContainer from '@/components/layout/page-container';
import PaymentManagementView from './payment-management-view';
import PaymentItemManagementView from './payment-item-management-view';

export default function PaymentManagementPage() {
  return (
    <PageContainer>
      <PaymentManagementView />
      <PaymentItemManagementView goBack={() => {}} />
    </PageContainer>
  );
}
