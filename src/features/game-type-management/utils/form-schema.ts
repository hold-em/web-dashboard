import * as z from 'zod';

export const gameTypeSchema = z.object({
  name: z.string().min(1, '게임 타입명을 입력해주세요'),
  position: z.coerce.number().min(0, '0 이상의 값을 입력해주세요')
});

export type GameTypeFormValues = z.infer<typeof gameTypeSchema>;
