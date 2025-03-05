import * as z from 'zod';

const facilityTypes = [
  'PARKING_LOT',
  'CREDIT_CARD',
  'WIFI',
  'RESERVATION',
  'GROUP_TABLE',
  'SMOKING_ROOM',
  'VALET_PARKING'
] as const;

export const storeSchema = z.object({
  name: z.string().min(1, { message: '매장 이름을 입력해주세요' }),
  phone_number: z.string().min(1, { message: '전화번호를 입력해주세요' }),
  address: z.string().min(1, { message: '주소를 입력해주세요' }),
  league_id: z.number(),
  longitude: z.number(),
  latitude: z.number(),
  store_image_file_ids: z.array(z.string()),
  available_facility_types: z.array(z.enum(facilityTypes))
});

export type StoreFormValues = z.infer<typeof storeSchema>;
