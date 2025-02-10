import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  price: z.preprocess(
    (val) => (val === '' ? undefined : Number(val)), // 빈 문자열이면 undefined로 변환 (필수값 검증)
    z
      .number({ invalid_type_error: '가격을 입력해 주세요.' })
      .min(1, '가격은 1 이상이어야 합니다.')
  )
});

export type ProductFormData = z.infer<typeof productSchema>;

export const paymentSchema = z.object({
  user_id: z.string().min(1, '고객을 선택하세요.'),
  product_id: z.string().min(1, '결제 항목을 선택하세요.'),
  payment_method: z.string().min(1, '결제 수단을 선택하세요.')
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
