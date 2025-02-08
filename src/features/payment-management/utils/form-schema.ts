import { z } from 'zod';

export const paymentItemSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)), // 빈 문자열이면 undefined로 변환 (필수값 검증)
    z
      .number({ invalid_type_error: '가격을 입력해 주세요.' })
      .min(1, '가격은 1 이상이어야 합니다.')
  )
});

export type PaymentItemFormData = z.infer<typeof paymentItemSchema>;
