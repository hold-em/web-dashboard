import { z } from 'zod';

export const temporaryMemberSchema = z.object({
  name: z.string().min(1, '이름을 입력하세요.'),
  nickname: z.string().min(1, '닉네임을 입력하세요.'),
  phone: z
    .string()
    .min(1, '전화번호를 입력해 주세요.')
    .refine((value) => /^(\d{2,3}-\d{3,4}-\d{4})$/.test(value), {
      message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)'
    }),
  gender: z.string().min(1, '성별을 선택해 주세요.')
});

export type TemporaryMemberFormData = z.infer<typeof temporaryMemberSchema>;

export const notificationSchema = z.object({
  content: z.string().min(1, '내용을 입력해주세요.')
});

export type NotificationFormData = z.infer<typeof notificationSchema>;
