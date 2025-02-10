'use client';

import { Section, SectionTitle, SectionContent } from '@/components/section';
import {
  Form,
  FormLabel,
  FormItem,
  FormField,
  FormControl,
  FormMessage
} from '@/components/ui/form';
import {
  ticketCreationFormSchema,
  type TicketCreationFormData
} from '../utils/form-schema';
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
import { Input } from '@/components/ui/input';
import { Ticket } from '@/mocks/tickets';

interface TicketCreationgSectionProps {
  tickets: Ticket[];
  updateTicket: (ticket: Ticket) => void;
}

export default function TicketCreationgSection({
  tickets,
  updateTicket
}: TicketCreationgSectionProps) {
  const form = useForm<TicketCreationFormData>({
    resolver: zodResolver(ticketCreationFormSchema),
    mode: 'onChange'
  });

  const onSubmit: SubmitHandler<TicketCreationFormData> = (data) => {
    const ticket = tickets.find((item) => item.id === data.ticket_id)!;
    updateTicket({
      ...ticket,
      remaining_count: ticket.remaining_count + data.amount
    });
    form.reset({
      ticket_id: '',
      amount: undefined
    });
  };

  return (
    <Section>
      <SectionTitle>결제 추가</SectionTitle>
      <SectionContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
            <FormField
              control={form.control}
              name='ticket_id'
              render={({ field: { value, onChange } }) => (
                <FormItem>
                  <FormLabel>이용권</FormLabel>
                  <FormControl>
                    <Select value={value} onValueChange={onChange}>
                      <SelectTrigger>
                        <SelectValue placeholder='이용권 선택' />
                      </SelectTrigger>
                      <SelectContent>
                        {tickets.map((item) => (
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
              name='amount'
              render={({ field }) => (
                <FormItem>
                  <FormLabel htmlFor='amount'>생성 개수</FormLabel>
                  <FormControl>
                    <Input
                      type='number'
                      id='amount'
                      placeholder='생성 개수 입력'
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
            <Button type='submit'>생성</Button>
          </form>
        </Form>
      </SectionContent>
    </Section>
  );
}
