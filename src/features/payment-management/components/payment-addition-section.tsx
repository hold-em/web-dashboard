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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
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
import { User } from '@/mocks/users';
import { v4 as uuid } from 'uuid';

const paymentMethods = ['카드', '현금', '이용권'] as const;

interface PaymentAdditionSectionProps {
  products: Product[];
  users: User[];
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
  const [selectedCustomer, setSelectedCustomer] = useState<User | null>(null);

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
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
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
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>결제 항목</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='결제 항목 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((item) => (
                          <SelectItem key={item.id} value={String(item.id)}>
                            {item.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='payment_method'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>결제 수단</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='결제 수단 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentMethods.map((item) => (
                          <SelectItem key={item} value={item}>
                            {item}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
