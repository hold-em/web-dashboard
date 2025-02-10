import { z } from 'zod';

export const ticketDesignFormSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  price: z.number({ required_error: '가격을 입력하세요.' }),
  date: z.date({ required_error: '유효기간을 선택하세요.' })
});

export type TicketDesignFormData = z.infer<typeof ticketDesignFormSchema>;

export const ticketIssuanceFormSchema = z.object({
  user_id: z.string().min(1, '고객명을 입력하세요.'),
  amount: z.number({ required_error: '수량을 입력하세요.' }),
  date: z.date({ required_error: '유효기간을 선택하세요.' }),
  store_id: z.string().min(1, '매장을 선택하세요.')
});

export type TicketIssuanceFormData = z.infer<typeof ticketIssuanceFormSchema>;

export const ticketCreationFormSchema = z.object({
  ticket_id: z.string().min(1, '이용권을 선택하세요.'),
  amount: z.number({ required_error: '생성 개수를 입력하세요.' })
});

export type TicketCreationFormData = z.infer<typeof ticketCreationFormSchema>;
