import { z } from 'zod';

export const temporaryMemberSchema = z.object({
  name: z.string().min(1, '이름을 입력해주세요'),
  phone: z.string().min(1, '전화번호를 입력해주세요'),
  email: z.string().email('올바른 이메일 주소를 입력해주세요'),
  birth: z.string().min(1, '생년월일을 입력해주세요'),
  gender: z.enum(['MALE', 'FEMALE'], {
    required_error: '성별을 선택해주세요'
  })
});

export type TemporaryMemberFormData = z.infer<typeof temporaryMemberSchema>;

export const notificationSchema = z.object({
  content: z.string().min(1, '내용을 입력해주세요.')
});

export type NotificationFormData = z.infer<typeof notificationSchema>;
