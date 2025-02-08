export interface PaymentItem {
  id: number | string;
  name: string;
  price: number;
  created_at: string;
}

export const mockPaymentItems: PaymentItem[] = [
  {
    id: 1,
    name: '바이인',
    price: 50000,
    created_at: '2021-01-01'
  },
  {
    id: 2,
    name: '리엔트리',
    price: 30000,
    created_at: '2022-01-01'
  },
  {
    id: 3,
    name: '음료',
    price: 50000,
    created_at: '2023-01-01'
  }
];

export interface PaymentHistory {
  id: number | string;
  user_name: string;
  price: number;
  payment_method: string;
  date: string;
  status: string;
}

export const mockPaymentHistories: PaymentHistory[] = [
  {
    id: 1,
    user_name: '김철수',
    price: 75000,
    payment_method: '이용권',
    date: '2021-01-01',
    status: '대기'
  },
  {
    id: 2,
    user_name: 'John Doe',
    price: 10000,
    payment_method: '현금',
    date: '2022-01-01',
    status: '완료'
  },
  {
    id: 3,
    user_name: '홍길동',
    price: 50000,
    payment_method: '카드',
    date: '2023-01-01',
    status: '완료'
  }
];
