import * as z from 'zod';

export const addStoreSchema = z.object({
  representativeImage: z.preprocess(
    (val) => (val instanceof File ? val : undefined),
    z
      .instanceof(File)
      .refine(
        (file) => file.type.startsWith('image/'),
        '대표사진은 이미지 파일이어야 합니다.'
      )
      .optional()
  ),
  storeName: z.string().min(1, '매장이름을 입력해 주세요.'),
  phone: z
    .string()
    .min(1, '전화번호를 입력해 주세요.')
    .refine((value) => /^(\d{2,3}-\d{3,4}-\d{4})$/.test(value), {
      message: '전화번호 형식이 올바르지 않습니다. (예: 010-1234-5678)'
    }),
  storeAddress: z.string().min(1, '매장 주소를 입력해 주세요.'),
  league: z.string().min(1, '리그를 선택해 주세요.'),
  convenienceInfo: z.array(z.string()).optional()
});

export type AddStoreFormValues = z.infer<typeof addStoreSchema>;
