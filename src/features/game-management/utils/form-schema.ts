import { z } from 'zod';

export const structureSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  level: z.string().min(1, '레벨을 입력하세요.'),
  ante: z.string().min(1, '앤티를 입력하세요.'),
  duration: z.string().min(1, '듀레이션을 입력하세요.')
});

export type StructureFormData = z.infer<typeof structureSchema>;

export const gameFormSchema = z.object({
  game_type: z.string().min(1, '게임 종류를 선택하세요.'),
  game_mode: z.string().min(1, '게임 방식을 선택하세요.'),
  name: z.string().min(1, '게임명을 선택하세요.'),
  store_id: z.string().min(1, '매장을 선택하세요.'),
  start_date: z.date({ required_error: '시작 기간을 선택하세요.' }),
  start_time: z.string().min(1, '시작 시간을 선택하세요.'),
  status: z.string().optional(),
  buy_in: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ invalid_type_error: '바이인을 입력하세요.' })
      .min(1, '바이인은 1 이상이어야 합니다.')
  ),
  reg_close_level: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ invalid_type_error: '레지 마감 레벨을 입력하세요.' })
      .min(1, '레지 마감 레벨은 1 이상이어야 합니다.')
  ),
  total_players: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ invalid_type_error: '플레이어 총 수를 입력하세요.' })
      .min(1, '플레이어 총 수는 1 이상이어야 합니다.')
  ),
  starting_chips: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ invalid_type_error: '스타팅 칩을 입력하세요.' })
      .min(1, '스타팅 칩은 1 이상이어야 합니다.')
  ),
  reentry_chips: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ invalid_type_error: '리엔트리 칩을 입력하세요.' })
      .min(1, '리엔트리 칩은 1 이상이어야 합니다.')
  ),
  average_stack: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ invalid_type_error: '에버러지 스택을 입력하세요.' })
      .min(1, '에버러지 스택은 1 이상이어야 합니다.')
  ),
  total_stack: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ invalid_type_error: '토탈 스택을 입력하세요.' })
      .min(1, '토탈 스택은 1 이상이어야 합니다.')
  ),
  break_time: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)),
    z
      .number({ invalid_type_error: '브레이크 타임을 입력하세요.' })
      .min(1, '브레이크 타임은 1 이상이어야 합니다.')
  ),
  structure_id: z.string().min(1, '스트럭처를 선택하세요.'),
  table_id: z.string().min(1, '테이블 정보를 선택하세요.')
});

export type GameFormSchemaValues = z.infer<typeof gameFormSchema>;
