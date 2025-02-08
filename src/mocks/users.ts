export interface User {
  id: string | number;
  name: string;
  nickname?: string;
  phone: string;
  email?: string;
  member_status: string;
  created_at: string;
  league_points: number;
  gender: string;
}

export const mockUsers: User[] = [
  {
    id: 1,
    name: '김민서',
    phone: '010-1234-5678',
    email: 'minseo.kim@example.com',
    member_status: '정회원',
    created_at: '2023-05-10',
    league_points: 720,
    gender: '여성'
  },
  {
    id: 2,

    name: '박지수',
    phone: '010-8765-4321',
    email: 'jisoo.park@example.com',
    member_status: '임시회원',
    created_at: '2024-01-15',
    league_points: 999990,
    gender: '여성'
  },
  {
    id: 3,
    name: '이서준',
    phone: '010-1111-2222',
    email: 'seojun.lee@example.com',
    member_status: '정회원',
    created_at: '2022-12-30',
    league_points: 50360,
    gender: '남성'
  },
  {
    id: 4,
    name: '최하나',
    phone: '010-3333-4444',
    email: 'hana.choi@example.com',
    member_status: '임시회원',
    created_at: '2023-07-20',
    league_points: 8970,
    gender: '여성'
  },
  {
    id: 5,
    name: '정태민',
    phone: '010-5555-6666',
    email: 'taemin.jung@example.com',
    member_status: '정회원',
    created_at: '2021-09-12',
    league_points: 486570,
    gender: '남성'
  },
  {
    id: 6,
    name: '윤하루',
    phone: '010-7777-8888',
    email: 'haru.yoon@example.com',
    member_status: '정회원',
    created_at: '2024-02-01',
    league_points: 12040,
    gender: '여성'
  },
  {
    id: 7,
    name: '강예진',
    phone: '010-9999-0000',
    email: 'yejin.kang@example.com',
    member_status: '임시회원',
    created_at: '2023-10-11',
    league_points: 76830,
    gender: '여성'
  },
  {
    id: 8,
    name: '오지원',
    phone: '010-2222-3333',
    email: 'jiwon.oh@example.com',
    member_status: '정회원',
    created_at: '2022-11-05',
    league_points: 135670,
    gender: '여성'
  },
  {
    id: 9,
    name: '한민수',
    phone: '010-4444-5555',
    email: 'minsu.han@example.com',
    member_status: '정회원',
    created_at: '2021-06-25',
    league_points: 30210,
    gender: '남성'
  },
  {
    id: 10,
    name: '백수민',
    phone: '010-6666-7777',
    email: 'sumin.baek@example.com',
    member_status: '임시회원',
    created_at: '2020-08-19',
    league_points: 90890,
    gender: '여성'
  },
  {
    id: 11,
    name: '임하은',
    phone: '010-8888-9999',
    email: 'haeun.im@example.com',
    member_status: '정회원',
    created_at: '2023-12-02',
    league_points: 45670,
    gender: '여성'
  },
  {
    id: 12,
    name: '서준혁',
    phone: '010-0000-1111',
    email: 'junhyuk.seo@example.com',
    member_status: '임시회원',
    created_at: '2022-03-14',
    league_points: 78940,
    gender: '남성'
  },
  {
    id: 13,
    name: '김수영',
    phone: '010-1234-5678',
    email: 'sooyoung.kim@example.com',
    member_status: '정회원',
    created_at: '2023-05-10',
    league_points: 15320,
    gender: '남성'
  },
  {
    id: 14,
    name: '문지혜',
    phone: '010-8765-4321',
    email: 'jihye.moon@example.com',
    member_status: '임시회원',
    created_at: '2024-01-15',
    league_points: 905870,
    gender: '여성'
  },
  {
    id: 15,
    name: '조현우',
    phone: '010-1111-2222',
    email: 'hyunwoo.jo@example.com',
    member_status: '정회원',
    created_at: '2022-12-30',
    league_points: 63580,
    gender: '남성'
  },
  {
    id: 16,
    name: '류민지',
    phone: '010-3333-4444',
    email: 'minji.ryu@example.com',
    member_status: '정회원',
    created_at: '2023-07-20',
    league_points: 87090,
    gender: '여성'
  },
  {
    id: 17,
    name: '남지호',
    phone: '010-5555-6666',
    email: 'jiho.nam@example.com',
    member_status: '임시회원',
    created_at: '2021-09-12',
    league_points: 20760,
    gender: '남성'
  },
  {
    id: 18,
    name: '황은솔',
    phone: '010-7777-8888',
    email: 'eunsol.hwang@example.com',
    member_status: '정회원',
    created_at: '2024-02-01',
    league_points: 950120,
    gender: '여성'
  },
  {
    id: 19,
    name: '심지성',
    phone: '010-9999-0000',
    email: 'jisung.shim@example.com',
    member_status: '임시회원',
    created_at: '2023-10-11',
    league_points: 40890,
    gender: '남성'
  },
  {
    id: 20,
    name: '진서윤',
    phone: '010-2222-3333',
    email: 'seoyoon.jin@example.com',
    member_status: '정회원',
    created_at: '2022-11-05',
    league_points: 78340,
    gender: '여성'
  },
  {
    id: 21,
    name: '손대현',
    phone: '010-4444-5555',
    email: 'daehyun.son@example.com',
    member_status: '정회원',
    created_at: '2021-06-25',
    league_points: 999990,
    gender: '남성'
  },
  {
    id: 22,
    name: '공나리',
    phone: '010-6666-7777',
    email: 'nari.gong@example.com',
    member_status: '임시회원',
    created_at: '2020-08-19',
    league_points: 35460,
    gender: '여성'
  }
];

export interface GameWinHistory {
  id: number;
  userId: number;
  date: string;
  tournament: string;
  prize: number;
}

export const mockGameWinHistories: GameWinHistory[] = [
  {
    id: 1,
    userId: 1,
    date: '2020-03-15',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 75000
  },
  {
    id: 2,
    userId: 2,
    date: '2020-07-22',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 150000
  },
  {
    id: 3,
    userId: 3,
    date: '2021-01-10',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 300000
  },
  {
    id: 4,
    userId: 4,
    date: '2021-05-18',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 450000
  },
  {
    id: 5,
    userId: 5,
    date: '2021-09-07',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 2000000
  },
  {
    id: 6,
    userId: 6,
    date: '2022-02-25',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 800000
  },
  {
    id: 7,
    userId: 7,
    date: '2022-06-30',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1200000
  },
  {
    id: 8,
    userId: 8,
    date: '2022-10-11',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 500000
  },
  {
    id: 9,
    userId: 9,
    date: '2023-01-05',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 95000
  },
  {
    id: 10,
    userId: 10,
    date: '2023-03-12',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1750000
  },
  {
    id: 11,
    userId: 1,
    date: '2023-04-23',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 650000
  },
  {
    id: 12,
    userId: 2,
    date: '2023-06-07',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1100000
  },
  {
    id: 13,
    userId: 3,
    date: '2023-08-19',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 400000
  },
  {
    id: 14,
    userId: 4,
    date: '2023-10-03',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1300000
  },
  {
    id: 15,
    userId: 5,
    date: '2023-12-15',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 850000
  },
  {
    id: 16,
    userId: 6,
    date: '2024-01-20',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 175000
  },
  {
    id: 17,
    userId: 7,
    date: '2024-03-05',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 920000
  },
  {
    id: 18,
    userId: 8,
    date: '2024-05-17',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1150000
  },
  {
    id: 19,
    userId: 9,
    date: '2024-07-29',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 210000
  },
  {
    id: 20,
    userId: 10,
    date: '2024-09-11',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1650000
  },
  {
    id: 21,
    userId: 1,
    date: '2020-05-14',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 990000
  },
  {
    id: 22,
    userId: 2,
    date: '2020-08-28',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1250000
  },
  {
    id: 23,
    userId: 3,
    date: '2020-11-03',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 550000
  },
  {
    id: 24,
    userId: 4,
    date: '2021-02-17',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 780000
  },
  {
    id: 25,
    userId: 5,
    date: '2021-04-26',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1600000
  },
  {
    id: 26,
    userId: 6,
    date: '2021-07-09',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 430000
  },
  {
    id: 27,
    userId: 7,
    date: '2021-09-21',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 2000000
  },
  {
    id: 28,
    userId: 8,
    date: '2021-12-12',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 670000
  },
  {
    id: 29,
    userId: 9,
    date: '2022-03-03',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 850000
  },
  {
    id: 30,
    userId: 10,
    date: '2022-05-25',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1350000
  }
];

export interface PaymentHistory {
  id: number;
  userId: number;
  date: string;
  item: string;
  amount: number;
  method: string;
}

export const mockPaymentHistories: PaymentHistory[] = [
  {
    id: 1,
    userId: 3,
    date: '2020-02-15',
    item: '바이인',
    amount: 15000,
    method: '카드'
  },
  {
    id: 2,
    userId: 7,
    date: '2020-05-23',
    item: '식음료',
    amount: 50000,
    method: '외식 이용권'
  },
  {
    id: 3,
    userId: 12,
    date: '2020-08-07',
    item: '바이인',
    amount: 32000,
    method: '카드'
  },
  {
    id: 4,
    userId: 1,
    date: '2020-11-11',
    item: '식음료',
    amount: 87000,
    method: '외식 이용권'
  },
  {
    id: 5,
    userId: 15,
    date: '2021-01-20',
    item: '바이인',
    amount: 23000,
    method: '카드'
  },
  {
    id: 6,
    userId: 9,
    date: '2021-03-14',
    item: '식음료',
    amount: 110000,
    method: '외식 이용권'
  },
  {
    id: 7,
    userId: 4,
    date: '2021-05-29',
    item: '바이인',
    amount: 45000,
    method: '카드'
  },
  {
    id: 8,
    userId: 11,
    date: '2021-07-07',
    item: '식음료',
    amount: 99000,
    method: '외식 이용권'
  },
  {
    id: 9,
    userId: 6,
    date: '2021-09-16',
    item: '바이인',
    amount: 67000,
    method: '카드'
  },
  {
    id: 10,
    userId: 2,
    date: '2021-11-03',
    item: '식음료',
    amount: 200000,
    method: '외식 이용권'
  },
  {
    id: 11,
    userId: 10,
    date: '2022-01-25',
    item: '바이인',
    amount: 12000,
    method: '카드'
  },
  {
    id: 12,
    userId: 8,
    date: '2022-03-30',
    item: '식음료',
    amount: 175000,
    method: '외식 이용권'
  },
  {
    id: 13,
    userId: 14,
    date: '2022-05-12',
    item: '바이인',
    amount: 98000,
    method: '카드'
  },
  {
    id: 14,
    userId: 5,
    date: '2022-07-04',
    item: '식음료',
    amount: 54000,
    method: '외식 이용권'
  },
  {
    id: 15,
    userId: 20,
    date: '2022-09-19',
    item: '바이인',
    amount: 21000,
    method: '카드'
  },
  {
    id: 16,
    userId: 17,
    date: '2022-11-28',
    item: '식음료',
    amount: 135000,
    method: '외식 이용권'
  },
  {
    id: 17,
    userId: 13,
    date: '2023-01-06',
    item: '바이인',
    amount: 65000,
    method: '카드'
  },
  {
    id: 18,
    userId: 19,
    date: '2023-02-14',
    item: '식음료',
    amount: 155000,
    method: '외식 이용권'
  },
  {
    id: 19,
    userId: 22,
    date: '2023-04-01',
    item: '바이인',
    amount: 43000,
    method: '카드'
  },
  {
    id: 20,
    userId: 16,
    date: '2023-06-09',
    item: '식음료',
    amount: 87000,
    method: '외식 이용권'
  },
  {
    id: 21,
    userId: 3,
    date: '2023-08-15',
    item: '바이인',
    amount: 99000,
    method: '카드'
  },
  {
    id: 22,
    userId: 7,
    date: '2023-10-22',
    item: '식음료',
    amount: 76000,
    method: '외식 이용권'
  },
  {
    id: 23,
    userId: 12,
    date: '2023-12-05',
    item: '바이인',
    amount: 150000,
    method: '카드'
  },
  {
    id: 24,
    userId: 1,
    date: '2024-01-17',
    item: '식음료',
    amount: 84000,
    method: '외식 이용권'
  },
  {
    id: 25,
    userId: 15,
    date: '2024-03-10',
    item: '바이인',
    amount: 30000,
    method: '카드'
  },
  {
    id: 26,
    userId: 9,
    date: '2024-05-03',
    item: '식음료',
    amount: 200000,
    method: '외식 이용권'
  },
  {
    id: 27,
    userId: 4,
    date: '2024-06-21',
    item: '바이인',
    amount: 125000,
    method: '카드'
  },
  {
    id: 28,
    userId: 11,
    date: '2024-08-08',
    item: '식음료',
    amount: 94000,
    method: '외식 이용권'
  },
  {
    id: 29,
    userId: 6,
    date: '2024-09-30',
    item: '바이인',
    amount: 52000,
    method: '카드'
  },
  {
    id: 30,
    userId: 2,
    date: '2024-11-15',
    item: '식음료',
    amount: 168000,
    method: '외식 이용권'
  },
  {
    id: 31,
    userId: 10,
    date: '2020-04-10',
    item: '바이인',
    amount: 47000,
    method: '카드'
  },
  {
    id: 32,
    userId: 8,
    date: '2020-06-18',
    item: '식음료',
    amount: 83000,
    method: '외식 이용권'
  },
  {
    id: 33,
    userId: 14,
    date: '2020-09-02',
    item: '바이인',
    amount: 55000,
    method: '카드'
  },
  {
    id: 34,
    userId: 5,
    date: '2020-11-30',
    item: '식음료',
    amount: 129000,
    method: '외식 이용권'
  },
  {
    id: 35,
    userId: 20,
    date: '2021-02-08',
    item: '바이인',
    amount: 74000,
    method: '카드'
  },
  {
    id: 36,
    userId: 17,
    date: '2021-04-15',
    item: '식음료',
    amount: 92000,
    method: '외식 이용권'
  },
  {
    id: 37,
    userId: 13,
    date: '2021-07-01',
    item: '바이인',
    amount: 81000,
    method: '카드'
  },
  {
    id: 38,
    userId: 19,
    date: '2021-09-12',
    item: '식음료',
    amount: 157000,
    method: '외식 이용권'
  },
  {
    id: 39,
    userId: 22,
    date: '2021-11-20',
    item: '바이인',
    amount: 68000,
    method: '카드'
  },
  {
    id: 40,
    userId: 16,
    date: '2021-12-28',
    item: '식음료',
    amount: 113000,
    method: '외식 이용권'
  }
];
