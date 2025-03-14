'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  PaymentRestResponse,
  UserResponse,
  PayableItemRestResponse,
  CreatePartialPaymentRestRequest
} from '@/lib/api/types.gen';
import { usePayments, PaymentMethod } from '../utils/use-payments';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Save, Plus, Trash } from 'lucide-react';
import { toast } from 'sonner';
import {
  Section,
  SectionContent,
  SectionTitle,
  SectionTopToolbar,
  SectionTopButtonArea
} from '@/components/section';
import PageContainer from '@/components/layout/page-container';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import CustomerSelect from './customer-select';
import PaymentItemSelect from './payment-item-select';

interface PaymentDetailPageProps {
  paymentId: string;
  onBack: () => void;
  users: UserResponse[];
  products: PayableItemRestResponse[];
}

export default function PaymentDetailPage({
  paymentId,
  onBack,
  users,
  products
}: PaymentDetailPageProps) {
  const { payments, updatePayment, cancelPayment } = usePayments();
  const [payment, setPayment] = useState<PaymentRestResponse | null>(null);
  const [memo, setMemo] = useState('');
  const [status, setStatus] = useState<'PENDING' | 'PAID'>('PENDING');
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [selectedItemId, setSelectedItemId] = useState<string>('');
  const [paymentMethods, setPaymentMethods] = useState<
    Array<{
      type: 'CARD' | 'CASH' | 'TRANSFER';
      amount: number;
      id?: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState(false);

  // Find the payment by ID
  useEffect(() => {
    const foundPayment = payments.find((p) => p.id === paymentId);
    if (foundPayment) {
      setPayment(foundPayment);
      setMemo(foundPayment.memo || '');
      setSelectedUserId(foundPayment.payed_by);
      setSelectedItemId(foundPayment.payable_item_id || '');
      // Only set status if it's PENDING or PAID, otherwise default to PENDING
      setStatus(foundPayment.payment_status === 'PAID' ? 'PAID' : 'PENDING');

      // Convert partial payments to PaymentMethod format
      const methods = foundPayment.partial_payments.map((pp) => {
        // Map payment types to supported types
        let paymentType: 'CARD' | 'CASH' | 'TRANSFER';

        if (pp.payment_type === 'CARD') {
          paymentType = 'CARD';
        } else if (pp.payment_type === 'CASH') {
          paymentType = 'CASH';
        } else if (
          pp.payment_type === 'TRANSFER' ||
          pp.payment_type === 'VOUCHER'
        ) {
          paymentType = 'TRANSFER';
        } else {
          // Default to CARD for any other types
          paymentType = 'CARD';
        }

        return {
          type: paymentType,
          amount: pp.price || 0,
          id: pp.id
        };
      });

      setPaymentMethods(methods);
    }
  }, [paymentId, payments]);

  const handleSave = async () => {
    if (!payment) return;

    setIsLoading(true);
    try {
      // For the API, we need to use CreatePartialPaymentRestRequest
      // We can't include the IDs here as the API expects a different format
      const partialPayments: CreatePartialPaymentRestRequest[] =
        paymentMethods.map((pm) => ({
          payment_type: pm.type,
          price: pm.amount,
          status: 'PENDING'
        }));

      await updatePayment({
        paymentId,
        memo,
        status,
        payableItemId: selectedItemId,
        partialPayments
      });
      toast.success('결제 정보가 업데이트되었습니다.');
    } catch (error) {
      toast.error('결제 정보 업데이트 중 오류가 발생했습니다.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    if (!payment) return;

    if (window.confirm('정말로 이 결제를 취소하시겠습니까?')) {
      setIsLoading(true);
      try {
        await cancelPayment(paymentId);
        toast.success('결제가 취소되었습니다.');
        onBack();
      } catch (error) {
        toast.error('결제 취소 중 오류가 발생했습니다.');
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
  };

  const handlePaymentMethodChange = (
    index: number,
    field: 'type' | 'amount',
    value: any
  ) => {
    const updatedMethods = [...paymentMethods];
    updatedMethods[index] = {
      ...updatedMethods[index],
      [field]: field === 'amount' ? Number(value) : value
    };
    setPaymentMethods(updatedMethods);
  };

  const addPaymentMethod = () => {
    setPaymentMethods([
      ...paymentMethods,
      {
        type: 'CARD',
        amount: 0
      }
    ]);
  };

  const removePaymentMethod = (index: number) => {
    // Don't allow removing if it's the only payment method
    if (paymentMethods.length <= 1) {
      toast.error('최소 하나의 결제 수단이 필요합니다.');
      return;
    }

    const updatedMethods = [...paymentMethods];
    updatedMethods.splice(index, 1);
    setPaymentMethods(updatedMethods);
  };

  if (!payment) {
    return (
      <PageContainer>
        <SectionTopToolbar>
          <SectionTopButtonArea>
            <Button variant='outline' onClick={onBack}>
              <ArrowLeft className='mr-2 h-4 w-4' />
              뒤로 가기
            </Button>
          </SectionTopButtonArea>
        </SectionTopToolbar>
        <div className='flex h-64 items-center justify-center'>
          <p>결제 정보를 찾을 수 없습니다.</p>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <SectionTopToolbar>
        <SectionTopButtonArea>
          <Button variant='outline' onClick={onBack} className='mr-2'>
            <ArrowLeft className='mr-2 h-4 w-4' />
            뒤로 가기
          </Button>
          <Button onClick={handleSave} disabled={isLoading}>
            <Save className='mr-2 h-4 w-4' />
            저장
          </Button>
        </SectionTopButtonArea>
      </SectionTopToolbar>

      <div className='grid gap-6 md:grid-cols-2'>
        <Card>
          <CardHeader>
            <CardTitle>결제 정보</CardTitle>
            <CardDescription>결제에 대한 기본 정보입니다.</CardDescription>
          </CardHeader>
          <CardContent className='space-y-4'>
            <div className='grid gap-2'>
              <Label>결제 ID</Label>
              <Input value={payment.id} disabled />
            </div>

            <CustomerSelect
              users={users}
              selectedUserId={selectedUserId}
              onSelect={setSelectedUserId}
              label='고객'
              disabled={true} // 고객 변경은 현재 API에서 지원하지 않음
            />

            <PaymentItemSelect
              items={products}
              selectedItemId={selectedItemId}
              onSelect={setSelectedItemId}
              label='결제 항목'
            />

            <div className='grid gap-2'>
              <Label>생성일</Label>
              <Input
                value={new Date(payment.created_at).toLocaleString()}
                disabled
              />
            </div>
            <div className='grid gap-2'>
              <Label>상태</Label>
              <Select
                value={status}
                onValueChange={(value: 'PENDING' | 'PAID') => setStatus(value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder='상태 선택' />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value='PENDING'>대기</SelectItem>
                  <SelectItem value='PAID'>완료</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className='grid gap-2'>
              <Label>메모</Label>
              <Textarea
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder='메모를 입력하세요'
                className='resize-none'
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className='flex flex-row items-center justify-between'>
            <div>
              <CardTitle>결제 수단</CardTitle>
              <CardDescription>
                결제에 사용된 결제 수단 정보입니다.
              </CardDescription>
            </div>
            <Button
              variant='outline'
              size='icon'
              onClick={addPaymentMethod}
              title='결제 수단 추가'
            >
              <Plus className='h-4 w-4' />
            </Button>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {paymentMethods.map((method, index) => (
                <div
                  key={index}
                  className='grid grid-cols-[1fr_1fr_auto] items-end gap-4'
                >
                  <div>
                    <Label>결제 수단</Label>
                    <Select
                      value={method.type}
                      onValueChange={(value: 'CARD' | 'CASH' | 'TRANSFER') =>
                        handlePaymentMethodChange(index, 'type', value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder='결제 수단 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value='CARD'>카드</SelectItem>
                        <SelectItem value='CASH'>현금</SelectItem>
                        <SelectItem value='TRANSFER'>이용권</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>금액</Label>
                    <Input
                      type='number'
                      value={method.amount}
                      onChange={(e) =>
                        handlePaymentMethodChange(
                          index,
                          'amount',
                          e.target.value
                        )
                      }
                    />
                  </div>
                  <Button
                    variant='ghost'
                    size='icon'
                    onClick={() => removePaymentMethod(index)}
                    title='결제 수단 삭제'
                  >
                    <Trash className='h-4 w-4' />
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
          <CardFooter className='flex justify-between'>
            <div className='text-lg font-semibold'>
              총 금액:{' '}
              {paymentMethods
                .reduce((sum, method) => sum + method.amount, 0)
                .toLocaleString()}
              원
            </div>
            <Button
              variant='destructive'
              onClick={handleCancel}
              disabled={isLoading}
            >
              결제 취소
            </Button>
          </CardFooter>
        </Card>
      </div>
    </PageContainer>
  );
}
