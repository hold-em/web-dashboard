export interface Product {
  id: string;
  name: string;
  price: number;
  created_at: string;
}

export const mockProducts: Product[] = [
  {
    id: '3bee1f8b-8e01-45a9-bc43-bd054f13ee33',
    name: '바이인',
    price: 50000,
    created_at: '2021-01-01'
  },
  {
    id: '3ac28067-4377-4125-a7d7-49789acde451',
    name: '리엔트리',
    price: 30000,
    created_at: '2022-01-01'
  },
  {
    id: 'f51c6942-80ab-4df5-89dd-f258ef4e8a55',
    name: '음료',
    price: 50000,
    created_at: '2023-01-01'
  }
];

export interface PaymentHistory {
  id: string;
  user_id: string;
  product_id: string;
  payment_method: string;
  date: string;
  status: string;
}

export const mockPaymentHistories: PaymentHistory[] = [
  {
    id: '18320243-c45d-410f-85b3-23bb9ffa8002',
    user_id: 'a31d5465-0100-41fa-9c08-69f5c1478248',
    product_id: '3bee1f8b-8e01-45a9-bc43-bd054f13ee33',
    payment_method: '이용권',
    date: '2021-01-01',
    status: '대기'
  },
  {
    id: 'afa8d3f8-3048-4628-baf3-f16bc3d90484',
    user_id: '57df757c-218d-4131-990a-31b5eace78a0',
    product_id: '3ac28067-4377-4125-a7d7-49789acde451',
    payment_method: '현금',
    date: '2022-01-01',
    status: '완료'
  },
  {
    id: '447cdb4f-697d-4d26-aee0-41b5fe99f784',
    user_id: '5fe4cbee-8383-4634-9d1c-2e8416e20b28',
    product_id: 'f51c6942-80ab-4df5-89dd-f258ef4e8a55',
    payment_method: '카드',
    date: '2023-01-01',
    status: '완료'
  }
];

export interface PaymentHistoryItem {
  user_name: string;
  price: number;
  payment_method: string;
  date: string;
  status: string;
}
