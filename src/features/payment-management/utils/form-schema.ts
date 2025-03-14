import { z } from 'zod';

export const productSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  position: z.preprocess(
    (val) => (val === '' ? 0 : Number(val)),
    z.number().default(0)
  )
});

export type ProductFormData = z.infer<typeof productSchema>;

export const paymentSchema = z.object({
  user_id: z.string().min(1, '고객을 선택하세요.'),
  product_id: z.string().min(1, '결제 항목을 선택하세요.'),
  payment_method: z.string().min(1, '결제 수단을 선택하세요.')
});

export type PaymentFormData = z.infer<typeof paymentSchema>;
