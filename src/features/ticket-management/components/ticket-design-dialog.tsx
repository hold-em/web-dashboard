'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';

import {
  ticketDesignFormSchema,
  type TicketDesignFormData
} from '../utils/form-schema';
import { Ticket } from '@/mocks/tickets';
import { v4 as uuidv4 } from 'uuid';
import { cn } from '@/lib/utils';
import { Icons } from '@/components/icons';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { ko } from 'date-fns/locale';

interface TicketDesignDialogProps {
  addTicket: (ticket: Ticket) => void;
}

export default function TicketDesignDialog({
  addTicket
}: TicketDesignDialogProps) {
  const [open, setOpen] = useState(false);
  const form = useForm<TicketDesignFormData>({
    resolver: zodResolver(ticketDesignFormSchema),
    mode: 'onChange',
    defaultValues: {
      name: '',
      price: undefined
    }
  });

  const onSubmit = (data: TicketDesignFormData) => {
    const { name, price, date } = data;
    const newTicket: Ticket = {
      id: uuidv4(),
      name,
      price,
      date: date.toISOString(),
      remaining_count: 0,
      created_at: new Date().toISOString()
    };
    addTicket(newTicket);
    setOpen(false);
    form.reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant='outline'>이용권 설계</Button>
      </DialogTrigger>
      <DialogContent className='sm:max-w-[425px]'>
        <DialogHeader>
          <DialogTitle>이용권 설계</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='name'>이용권 명</FormLabel>
                  <FormControl>
                    <Input id='name' placeholder='이용권 명 입력' {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='price'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='price'>가격</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      id='price'
                      placeholder='가격 입력'
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
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant={'outline'}
                          className={cn(
                            'w-[full] pl-3 text-left font-normal',
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
                        onSelect={field.onChange}
                        locale={ko}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type='submit'>추가</Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
