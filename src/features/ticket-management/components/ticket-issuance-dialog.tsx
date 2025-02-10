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
  FormMessage
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { ChevronsUpDown, Check } from 'lucide-react';
import {
  ticketIssuanceFormSchema,
  TicketIssuanceFormData
} from '../utils/form-schema';
import { Ticket } from '@/mocks/tickets';
import { User } from '@/mocks/users';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';
import { Store } from '@/mocks/stores';

interface TicketIssuanceDialogProps {
  ticket: Ticket;
  users: User[];
  stores: Store[];
  onClose?: () => void;
  openTrigger: number;
}

export default function TicketIssuanceDialog({
  ticket,
  users,
  stores,
  onClose,
  openTrigger
}: TicketIssuanceDialogProps) {
  const [open, setOpen] = useState(false);
  const [userComboboxOpen, setUserComboboxOpen] = useState<boolean>(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [calendarOpen, setCalendarOpen] = useState(false);

  const form = useForm<TicketIssuanceFormData>({
    resolver: zodResolver(ticketIssuanceFormSchema),
    mode: 'onChange'
  });

  useEffect(() => {
    setOpen(true);
  }, [ticket, openTrigger]);

  useEffect(() => {
    form.reset();
    setSelectedUser(null);
  }, [open, form]);

  const onSubmit = (data: TicketIssuanceFormData) => {
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
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : undefined
                        )
                      }
                    />
                  </FormControl>
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
                  <Popover open={calendarOpen} onOpenChange={setCalendarOpen}>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant='outline'
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP', { locale: ko })
                          ) : (
                            <span>유효기간 선택</span>
                          )}
                          <Icons.calendar className='ml-auto h-4 w-4 opacity-50' />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className='w-auto p-0' align='start'>
                      <Calendar
                        mode='single'
                        selected={field.value}
                        onSelect={(date) => {
                          field.onChange(date);
                          setCalendarOpen(false);
                        }}
                        locale={ko}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='store_id'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>리그</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='리그 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {stores.map((item) => (
                          <SelectItem key={item.id} value={item.id}>
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
            <DialogFooter>
              <Button type='submit'>지급</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
