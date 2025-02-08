import { z } from 'zod';

export const structureSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  level: z.string().min(1, '레벨을 입력하세요.'),
  ante: z.string().min(1, '앤티를 입력하세요.'),
  duration: z.string().min(1, '듀레이션을 입력하세요.')
});

export type StructureFormData = z.infer<typeof structureSchema>;
