'use client';

import { useState, useEffect } from 'react';
import { Section, SectionTitle, SectionContent } from '@/components/section';
import {
  Form,
  FormLabel,
  FormItem,
  FormField,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import { paymentSchema, type PaymentFormData } from '../utils/form-schema';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { SubmitHandler, useForm } from 'react-hook-form';
import { PayableItemRestResponse } from '@/lib/api/types.gen';
import {
  Popover,
  PopoverTrigger,
  PopoverContent
} from '@/components/ui/popover';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem
} from '@/components/ui/command';
import { ChevronsUpDown, Check, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { UserResponse } from '@/lib/api/types.gen';
import { usePayments, PaymentMethod } from '@/hooks/use-payments';
import { toast } from 'sonner';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// 결제 수단 매핑
const paymentMethodMapping: Record<
  string,
  'CARD' | 'CASH' | 'TRANSFER' | 'UNPAID'
> = {
  카드: 'CARD',
  CARD: 'CARD',
  현금: 'CASH',
  CASH: 'CASH',
  이용권: 'TRANSFER',
  VOUCHER: 'TRANSFER',
  미수: 'UNPAID',
  UNPAID: 'UNPAID'
};

interface PaymentAdditionSectionProps {
  products: PayableItemRestResponse[];
  users: UserResponse[];
}

export default function PaymentAdditionSection({
  products,
  users
}: PaymentAdditionSectionProps) {
  // 결제 방식 선택 (일반 결제 또는 미수 결제)
  const [paymentType, setPaymentType] = useState<'normal' | 'unpaid'>('normal');

  // 각 결제 수단별 금액 상태 관리
  const [paymentAmounts, setPaymentAmounts] = useState<Record<string, string>>({
    카드: '',
    현금: '',
    이용권: '',
    미수: ''
  });

  const { createPayment, isCreating } = usePayments();

  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: {
      product_id: '',
      payment_method: '',
      user_id: '',
      memo: ''
    }
  });
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<UserResponse | null>(
    null
  );

  // 결제 수단별 금액 변경 핸들러
  const handleAmountChange = (method: string, value: string) => {
    // 미수 결제 방식이면 다른 결제 수단은 무시
    if (paymentType === 'unpaid' && method !== '미수') {
      return;
    }

    // 일반 결제 방식이면 미수는 무시
    if (paymentType === 'normal' && method === '미수') {
      return;
    }

    // 값이 변경된 경우에만 상태 업데이트
    if (paymentAmounts[method] !== value) {
      setPaymentAmounts((prev) => ({
        ...prev,
        [method]: value
      }));
    }
  };

  // 결제 방식 변경 시 금액 초기화
  useEffect(() => {
    if (paymentType === 'normal') {
      setPaymentAmounts({
        카드: paymentAmounts.카드,
        현금: paymentAmounts.현금,
        이용권: paymentAmounts.이용권,
        미수: ''
      });
    } else {
      setPaymentAmounts({
        카드: '',
        현금: '',
        이용권: '',
        미수: paymentAmounts.미수
      });
    }
  }, [paymentType]);

  const onSubmit: SubmitHandler<PaymentFormData> = (data) => {
    // 결제 방식에 따라 필터링할 결제 수단 결정
    const methodsToFilter =
      paymentType === 'normal' ? ['카드', '현금', '이용권'] : ['미수'];

    // 선택된 결제 수단에서 금액이 입력된 것만 필터링
    const paymentMethods: PaymentMethod[] = Object.entries(paymentAmounts)
      .filter(
        ([method, amount]) =>
          methodsToFilter.includes(method) && amount && parseInt(amount) > 0
      )
      .map(([method, amount]) => ({
        type: paymentMethodMapping[method],
        amount: parseInt(amount)
      }));

    // 결제 수단이 하나도 선택되지 않은 경우
    if (paymentMethods.length === 0) {
      toast.error('하나 이상의 결제 수단과 금액을 입력해야 합니다.');
      return;
    }

    // API를 통해 결제 생성
    createPayment({
      userId: data.user_id,
      payableItemId: data.product_id,
      paymentMethods,
      memo: data.memo || ''
    });

    // 폼 초기화
    form.reset({
      product_id: '',
      user_id: '',
      payment_method: '',
      memo: ''
    });
    setSelectedCustomer(null);

    // 결제 금액 초기화
    setPaymentAmounts({
      카드: '',
      현금: '',
      이용권: '',
      미수: ''
    });

    // 결제 방식 초기화
    setPaymentType('normal');
  };

  return (
    <Section>
      <SectionTitle>결제 추가</SectionTitle>
      <SectionContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-6'>
            <FormField
              control={form.control}
              name='user_id'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>고객 검색</FormLabel>
                  <FormControl>
                    <div>
                      <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={open}
                            className='w-full justify-between'
                          >
                            {selectedCustomer
                              ? `${selectedCustomer.name}`
                              : '고객을 선택하세요'}
                            <ChevronsUpDown className='opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='w-[200px] p-0'>
                          <Command value={form.watch('user_id') || ''}>
                            <CommandInput placeholder='고객 검색' />
                            <CommandList>
                              <CommandEmpty>
                                고객을 찾을 수 없습니다.
                              </CommandEmpty>
                              <CommandGroup>
                                {users.map((customer) => (
                                  <CommandItem
                                    key={customer.id}
                                    onSelect={() => {
                                      setSelectedCustomer(customer);
                                      field.onChange(customer.id);
                                      setOpen(false);
                                    }}
                                  >
                                    {customer.name}
                                    <Check
                                      className={cn(
                                        'ml-auto',
                                        selectedCustomer?.id === customer.id
                                          ? 'opacity-100'
                                          : 'opacity-0'
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='product_id'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>결제 항목</FormLabel>
                  <FormControl>
                    <div className='flex flex-wrap gap-2'>
                      {products.map((product) => (
                        <div
                          key={product.id}
                          onClick={() => field.onChange(product.id)}
                        >
                          <div
                            className={cn(
                              'cursor-pointer rounded-md border px-3 py-1 text-sm',
                              field.value === product.id
                                ? 'border-primary bg-primary/10 font-medium'
                                : 'border-input hover:bg-accent/50'
                            )}
                          >
                            {product.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormItem className='space-y-3'>
              <FormLabel>결제 방식</FormLabel>
              <Tabs
                value={paymentType}
                onValueChange={(value) =>
                  setPaymentType(value as 'normal' | 'unpaid')
                }
                className='w-full'
              >
                <TabsList className='grid w-full grid-cols-2'>
                  <TabsTrigger value='normal'>일반 결제</TabsTrigger>
                  <TabsTrigger value='unpaid'>미수 결제</TabsTrigger>
                </TabsList>
                <TabsContent value='normal'>
                  <div className='mt-4 space-y-4'>
                    {['카드', '현금', '이용권'].map((method) => (
                      <div key={method} className='flex items-center gap-3'>
                        <div className='w-24 font-medium'>{method}</div>
                        <Input
                          type='number'
                          placeholder='금액'
                          value={paymentAmounts[method]}
                          onChange={(e) =>
                            handleAmountChange(method, e.target.value)
                          }
                          className='flex-1'
                        />
                      </div>
                    ))}
                  </div>
                </TabsContent>
                <TabsContent value='unpaid'>
                  <div className='mt-4 space-y-4'>
                    <Alert className='mb-4'>
                      <AlertCircle className='h-4 w-4' />
                      <AlertTitle>미수 결제 안내</AlertTitle>
                      <AlertDescription>
                        미수 결제는 다른 결제 수단과 함께 사용할 수 없습니다.
                      </AlertDescription>
                    </Alert>
                    <div className='flex items-center gap-3'>
                      <div className='w-24 font-medium'>미수</div>
                      <Input
                        type='number'
                        placeholder='금액'
                        value={paymentAmounts['미수']}
                        onChange={(e) =>
                          handleAmountChange('미수', e.target.value)
                        }
                        className='flex-1'
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              <FormMessage />
            </FormItem>

            <FormField
              control={form.control}
              name='memo'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>메모 (선택사항)</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='메모를 입력하세요'
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full' disabled={isCreating}>
              {isCreating ? '처리 중...' : '결제 추가'}
            </Button>
          </form>
        </Form>
      </SectionContent>
    </Section>
  );
}
