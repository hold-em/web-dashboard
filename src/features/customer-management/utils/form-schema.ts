import { z } from 'zod';

export const temporaryMemberSchema = z.object({
  nickname: z.string().min(1, '닉네임을 입력해주세요'),
  name: z.string().optional(),
  phone: z.string().optional()
});

export type TemporaryMemberFormData = z.infer<typeof temporaryMemberSchema>;

export const notificationSchema = z.object({
  content: z.string().min(1, '내용을 입력해주세요.')
});

export type NotificationFormData = z.infer<typeof notificationSchema>;
