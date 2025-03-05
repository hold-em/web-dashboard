import * as z from 'zod';

export const leagueSchema = z.object({
  name: z.string().min(1, '리그명을 입력해주세요'),
  prize_point_weight: z.coerce.number().min(0, '0 이상의 값을 입력해주세요'),
  payed_amount_point_weight: z.coerce
    .number()
    .min(0, '0 이상의 값을 입력해주세요'),
  voucher_payed_amount_point_weight: z.coerce
    .number()
    .min(0, '0 이상의 값을 입력해주세요'),
  visit_count_point_weight: z.coerce
    .number()
    .min(0, '0 이상의 값을 입력해주세요')
});

export type LeagueFormValues = z.infer<typeof leagueSchema>;
