import { z } from 'zod';
import { addYears } from 'date-fns';

export const ticketDesignFormSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  gold_count: z
    .number({ required_error: '골드 개수를 입력하세요.' })
    .min(0, '0 이상의 값을 입력하세요.'),
  silver_count: z
    .number({ required_error: '실버 개수를 입력하세요.' })
    .min(0, '0 이상의 값을 입력하세요.'),
  bronze_count: z
    .number({ required_error: '브론즈 개수를 입력하세요.' })
    .min(0, '0 이상의 값을 입력하세요.')
});

export type TicketDesignFormData = z.infer<typeof ticketDesignFormSchema>;

export const ticketIssuanceFormSchema = z.object({
  user_id: z.string().min(1, '고객명을 입력하세요.'),
  amount: z
    .number({ required_error: '수량을 입력하세요.' })
    .min(1, '최소 1개 이상 지급해야 합니다.'),
  date: z
    .date({ required_error: '유효기간을 선택하세요.' })
    .default(() => addYears(new Date(), 1))
});

export type TicketIssuanceFormData = z.infer<typeof ticketIssuanceFormSchema>;

export const ticketCreationFormSchema = z.object({
  ticket_id: z.string().min(1, '이용권을 선택하세요.'),
  amount: z.number({ required_error: '생성 개수를 입력하세요.' })
});

export type TicketCreationFormData = z.infer<typeof ticketCreationFormSchema>;

// 이용권 현황 관련 스키마
export const ticketHistoryFormSchema = z.object({
  memo: z.string().optional()
});

export type TicketHistoryFormData = z.infer<typeof ticketHistoryFormSchema>;
