'use client';

import { useState } from 'react';
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
import { Product, PaymentHistory } from '@/mocks/payments';
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
import { ChevronsUpDown, Check } from 'lucide-react';
import { cn } from '@/lib/utils';
import { v4 as uuid } from 'uuid';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { UserResponse } from '@/lib/api/types.gen';

// 결제 수단 목록
const paymentMethods = ['카드', '현금', '이용권', '미수'] as const;

interface PaymentAdditionSectionProps {
  products: Product[];
  users: UserResponse[];
  addPaymentHistory: (paymentHistory: PaymentHistory) => void;
}

export default function PaymentAdditionSection({
  products,
  users,
  addPaymentHistory
}: PaymentAdditionSectionProps) {
  const form = useForm<PaymentFormData>({
    resolver: zodResolver(paymentSchema),
    mode: 'onChange',
    defaultValues: {
      product_id: '',
      payment_method: '',
      user_id: ''
    }
  });
  const [open, setOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState<UserResponse | null>(
    null
  );

  const onSubmit: SubmitHandler<PaymentFormData> = (data) => {
    const newPaymentHistory: PaymentHistory = {
      id: uuid(),
      user_id: data.user_id,
      product_id: data.product_id,
      payment_method: data.payment_method,
      date: new Date().toISOString(),
      status: '대기'
    };
    addPaymentHistory(newPaymentHistory);
    form.reset({
      product_id: '',
      payment_method: '',
      user_id: ''
    });
    setSelectedCustomer(null);
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
                    <RadioGroup
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      className='flex flex-col space-y-1'
                    >
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className='flex items-center space-x-3 space-y-0'
                        >
                          <RadioGroupItem value={product.id} id={product.id} />
                          <FormLabel
                            htmlFor={product.id}
                            className='cursor-pointer font-normal'
                          >
                            {product.name} ({product.price.toLocaleString()}원)
                          </FormLabel>
                        </div>
                      ))}
                    </RadioGroup>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name='payment_method'
              render={({ field }) => (
                <FormItem className='space-y-3'>
                  <FormLabel>결제 수단</FormLabel>
                  <FormControl>
                    <div className='flex flex-wrap gap-2'>
                      {paymentMethods.map((method) => (
                        <Button
                          key={method}
                          type='button'
                          variant={
                            field.value === method ? 'default' : 'outline'
                          }
                          onClick={() => field.onChange(method)}
                          className='flex-1'
                        >
                          {method}
                        </Button>
                      ))}
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type='submit' className='w-full'>
              결제 추가
            </Button>
          </form>
        </Form>
      </SectionContent>
    </Section>
  );
}
