import { z } from 'zod';

export const gameFormSchema = z.object({
  gameType: z.string().min(1, '게임 종류를 선택하세요.'),
  gameMode: z.string().min(1, '게임 방식을 선택하세요.'),
  buyIn: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: '바이인은 숫자만 입력할 수 있습니다.'
    })
    .transform((value) => (value ? Number(value) : undefined)),
  regCloseLevel: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: '레지 마감 레벨은 숫자만 입력할 수 있습니다.'
    })
    .transform((value) => (value ? Number(value) : undefined)),
  totalPlayers: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: '플레이어 총 수는 숫자만 입력할 수 있습니다.'
    })
    .transform((value) => (value ? Number(value) : undefined)),
  startingChips: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: '스타팅 칩은 숫자만 입력할 수 있습니다.'
    })
    .transform((value) => (value ? Number(value) : undefined)),
  reentryChips: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: '리엔트리 칩은 숫자만 입력할 수 있습니다.'
    })
    .transform((value) => (value ? Number(value) : undefined)),
  averageStack: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: '에버러지 스택은 숫자만 입력할 수 있습니다.'
    })
    .transform((value) => (value ? Number(value) : undefined)),
  totalStack: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: '토탈 스택은 숫자만 입력할 수 있습니다.'
    })
    .transform((value) => (value ? Number(value) : undefined)),
  breakTime: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+$/.test(value), {
      message: '브레이크 타임은 숫자만 입력할 수 있습니다.'
    })
    .transform((value) => (value ? Number(value) : undefined)),
  structure: z.string().min(1, '스트럭처를 선택하세요.'),
  tableInfo: z.string().min(1, '테이블 정보를 선택하세요.')
});

export type GameFormSchemaValues = z.infer<typeof gameFormSchema>;
