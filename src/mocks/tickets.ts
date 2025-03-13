export interface Ticket {
  id: string;
  name: string;
  gold_count: number;
  silver_count: number;
  bronze_count: number;
  remaining_count: number;
  created_at: string;
}

export const mockTickets: Ticket[] = [
  {
    id: '17f9aa59-c73b-4c66-881f-93ef3be65947',
    name: '기본 이용권',
    gold_count: 1,
    silver_count: 2,
    bronze_count: 3,
    remaining_count: 30,
    created_at: '2021-01-01'
  },
  {
    id: 'd7841d63-b978-4835-90ee-9db59944e89b',
    name: 'VIP 이용권',
    gold_count: 2,
    silver_count: 3,
    bronze_count: 5,
    remaining_count: 60,
    created_at: '2021-01-02'
  },
  {
    id: '757fd6b9-003e-49f5-abf5-e0b624b6338f',
    name: '프리미엄 이용권',
    gold_count: 3,
    silver_count: 5,
    bronze_count: 10,
    remaining_count: 100,
    created_at: '2021-01-03'
  }
];
