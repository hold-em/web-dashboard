'use client';

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormField,
  FormLabel,
  FormItem,
  FormControl,
  FormMessage,
  FormDescription
} from '@/components/ui/form';
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
import {
  ticketIssuanceFormSchema,
  TicketIssuanceFormData
} from '../utils/form-schema';
import { Ticket } from '@/mocks/tickets';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Calendar } from '@/components/ui/calendar';
import { format, addYears } from 'date-fns';
import { ko } from 'date-fns/locale';
import { UserResponse } from '@/lib/api/types.gen';

interface TicketIssuanceDialogProps {
  ticket: Ticket;
  users: UserResponse[];
  onClose?: () => void;
  openTrigger: number;
}

export default function TicketIssuanceDialog({
  ticket,
  users,
  onClose,
  openTrigger
}: TicketIssuanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [userComboboxOpen, setUserComboboxOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<UserResponse | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [maxAmount, setMaxAmount] = useState<number>(1);

  const form = useForm<TicketIssuanceFormData>({
    resolver: zodResolver(ticketIssuanceFormSchema),
    mode: 'onChange',
    defaultValues: {
      date: addYears(new Date(), 1)
    }
  });

  useEffect(() => {
    setOpen(true);
  }, [ticket, openTrigger]);

  useEffect(() => {
    form.reset({
      date: addYears(new Date(), 1)
    });
    setSelectedUser(null);
  }, [open, form]);

  // 사용자 선택 시 자녀 수에 따라 최대 수량 설정
  useEffect(() => {
    if (selectedUser) {
      // 실제 API에서는 자녀 수 정보를 가져와야 함
      // 임시로 최대 수량을 3으로 설정
      const childrenCount = 3;
      setMaxAmount(childrenCount);

      // 현재 입력된 수량이 최대 수량을 초과하면 최대 수량으로 조정
      const currentAmount = form.getValues('amount');
      if (currentAmount && currentAmount > childrenCount) {
        form.setValue('amount', childrenCount);
      }
    }
  }, [selectedUser, form]);

  const onSubmit = (data: TicketIssuanceFormData) => {
    // 최종 제출 전 수량 검증
    if (selectedUser && data.amount > maxAmount) {
      form.setError('amount', {
        type: 'manual',
        message: `최대 ${maxAmount}개까지만 지급 가능합니다.`
      });
      return;
    }

    setOpen(false);
    form.reset();
    if (onClose) onClose();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>이용권 지급</DialogTitle>
        </DialogHeader>
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
                      <Popover
                        open={userComboboxOpen}
                        onOpenChange={setUserComboboxOpen}
                      >
                        <PopoverTrigger asChild>
                          <Button
                            variant='outline'
                            role='combobox'
                            aria-expanded={userComboboxOpen}
                            className='w-full justify-between'
                          >
                            {selectedUser
                              ? selectedUser.name
                              : '고객을 선택하세요'}
                            <ChevronsUpDown className='opacity-50' />
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className='p-0' align='start'>
                          <Command value={form.watch('user_id') || ''}>
                            <CommandInput placeholder='고객 검색' />
                            <CommandList>
                              <CommandEmpty>
                                고객을 찾을 수 없습니다.
                              </CommandEmpty>
                              <CommandGroup>
                                {users.map((user) => (
                                  <CommandItem
                                    key={user.id}
                                    onSelect={() => {
                                      setSelectedUser(user);
                                      field.onChange(user.id);
                                      setUserComboboxOpen(false);
                                    }}
                                  >
                                    {user.name}
                                    <Check
                                      className={cn(
                                        'ml-auto',
                                        selectedUser?.id === user.id
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
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='amount'>수량</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      id='amount'
                      placeholder='수량 입력'
                      value={field.value ?? ''}
                      onChange={(e) => {
                        const value = e.target.value
                          ? Number(e.target.value)
                          : undefined;
                        // 최대 수량 제한
                        if (value && value > maxAmount) {
                          field.onChange(maxAmount);
                        } else {
                          field.onChange(value);
                        }
                      }}
                      max={maxAmount}
                      min={1}
                    />
                  </FormControl>
                  {selectedUser && (
                    <FormDescription>
                      최대 {maxAmount}개까지 지급 가능합니다.
                    </FormDescription>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='date'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>유효기간</FormLabel>
                  <FormControl>
                    <div className='flex items-center space-x-2'>
                      <Input
                        value={format(field.value, 'PPP', { locale: ko })}
                        readOnly
                        className='bg-muted'
                      />
                      <Button
                        type='button'
                        variant='outline'
                        size='icon'
                        onClick={() => setCalendarOpen(true)}
                      >
                        <Icons.calendar className='h-4 w-4' />
                      </Button>
                    </div>
                  </FormControl>
                  <FormDescription>
                    기본값은 현재 날짜로부터 1년 후입니다.
                  </FormDescription>
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(date) => {
                          if (date) {
                            field.onChange(date);
                          }
                          setCalendarOpen(false);
                        }}
                        locale={ko}
                        initialFocus
                        fromDate={new Date()}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>지급</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
