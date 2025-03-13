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
  ticketDesignFormSchema,
  type TicketDesignFormData
} from '../utils/form-schema';
import { Ticket } from '@/mocks/tickets';
import { v4 as uuidv4 } from 'uuid';

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
      gold_count: 0,
      silver_count: 0,
      bronze_count: 0
    }
  });

  const onSubmit = (data: TicketDesignFormData) => {
    const { name, gold_count, silver_count, bronze_count } = data;
    const newTicket: Ticket = {
      id: uuidv4(),
      name,
      gold_count,
      silver_count,
      bronze_count,
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
              name='gold_count'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='gold_count'>골드 개수</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      id='gold_count'
                      placeholder='골드 개수 입력'
                      value={field.value ?? 0}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : 0
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
              name='silver_count'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='silver_count'>실버 개수</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      id='silver_count'
                      placeholder='실버 개수 입력'
                      value={field.value ?? 0}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : 0
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
              name='bronze_count'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='bronze_count'>브론즈 개수</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      id='bronze_count'
                      placeholder='브론즈 개수 입력'
                      value={field.value ?? 0}
                      onChange={(e) =>
                        field.onChange(
                          e.target.value ? Number(e.target.value) : 0
                        )
                      }
                    />
                  </FormControl>
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
