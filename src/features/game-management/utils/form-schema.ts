import { z } from 'zod';

export const structureSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  level: z.string().min(1, '레벨을 입력하세요.'),
  ante: z.string().min(1, '앤티를 입력하세요.'),
  duration: z.string().min(1, '듀레이션을 입력하세요.')
});

export type StructureFormData = z.infer<typeof structureSchema>;

export const gameFormSchema = z.object({
  game_type_id: z.number({ required_error: '게임 타입을 선택하세요.' }),
  mode: z.string({ required_error: '게임 모드를 입력하세요.' }),
  store_id: z.number({ required_error: '매장을 선택하세요.' }),
  scheduled_at: z.coerce.date({ required_error: '시작 시간을 선택하세요.' }),
  status: z.enum(['WAITING', 'PLAYING', 'FINISHED']).default('WAITING'),
  buy_in_amount: z.number({ required_error: '바이인 금액을 입력하세요.' }),
  reg_close_level: z.number().optional(),
  max_players: z.number({ required_error: '최대 플레이어 수를 입력하세요.' }),
  early_chips: z.number().optional(),
  starting_chips: z.number({ required_error: '시작 칩을 입력하세요.' }),
  reentry_chips: z.number().optional(),
  break_time: z.string({ required_error: '브레이크 타임을 입력하세요.' }),
  structure_template_id: z.string({ required_error: '스트럭처를 선택하세요.' }),
  prize: z.string().default('')
});

export type GameFormSchemaValues = z.infer<typeof gameFormSchema>;
