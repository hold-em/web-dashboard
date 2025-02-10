export interface User {
  id: string;
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
    id: 'a31d5465-0100-41fa-9c08-69f5c1478248',
    name: '김민서',
    phone: '010-1234-5678',
    email: 'minseo.kim@example.com',
    member_status: '정회원',
    created_at: '2023-05-10',
    league_points: 720,
    gender: '여성'
  },
  {
    id: '57df757c-218d-4131-990a-31b5eace78a0',
    name: '박지수',
    phone: '010-8765-4321',
    email: 'jisoo.park@example.com',
    member_status: '임시회원',
    created_at: '2024-01-15',
    league_points: 999990,
    gender: '여성'
  },
  {
    id: '5fe4cbee-8383-4634-9d1c-2e8416e20b28',
    name: '이서준',
    phone: '010-1111-2222',
    email: 'seojun.lee@example.com',
    member_status: '정회원',
    created_at: '2022-12-30',
    league_points: 50360,
    gender: '남성'
  },
  {
    id: 'b31f0f95-9466-48fe-8322-dc543dcda24c',
    name: '최하나',
    phone: '010-3333-4444',
    email: 'hana.choi@example.com',
    member_status: '임시회원',
    created_at: '2023-07-20',
    league_points: 8970,
    gender: '여성'
  },
  {
    id: '5c6b0561-c412-4bad-a5f3-f95987d5bf42',
    name: '정태민',
    phone: '010-5555-6666',
    email: 'taemin.jung@example.com',
    member_status: '정회원',
    created_at: '2021-09-12',
    league_points: 486570,
    gender: '남성'
  },
  {
    id: '9b2846a5-b58f-43f8-bafc-494de638aeab',
    name: '윤하루',
    phone: '010-7777-8888',
    email: 'haru.yoon@example.com',
    member_status: '정회원',
    created_at: '2024-02-01',
    league_points: 12040,
    gender: '여성'
  },
  {
    id: 'c3e78a38-fa00-4863-88f9-c5b79cbe2eef',
    name: '강예진',
    phone: '010-9999-0000',
    email: 'yejin.kang@example.com',
    member_status: '임시회원',
    created_at: '2023-10-11',
    league_points: 76830,
    gender: '여성'
  },
  {
    id: '0be48e2d-0777-4156-a472-38b6fd5a5c3e',
    name: '오지원',
    phone: '010-2222-3333',
    email: 'jiwon.oh@example.com',
    member_status: '정회원',
    created_at: '2022-11-05',
    league_points: 135670,
    gender: '여성'
  },
  {
    id: '1f793829-83c8-4301-aed5-31536c75f815',
    name: '한민수',
    phone: '010-4444-5555',
    email: 'minsu.han@example.com',
    member_status: '정회원',
    created_at: '2021-06-25',
    league_points: 30210,
    gender: '남성'
  },
  {
    id: '12e1f2d1-a19c-43fc-9c96-de987c9ebffb',
    name: '백수민',
    phone: '010-6666-7777',
    email: 'sumin.baek@example.com',
    member_status: '임시회원',
    created_at: '2020-08-19',
    league_points: 90890,
    gender: '여성'
  },
  {
    id: 'cc0bd1db-8476-455e-b412-653899bca575',
    name: '임하은',
    phone: '010-8888-9999',
    email: 'haeun.im@example.com',
    member_status: '정회원',
    created_at: '2023-12-02',
    league_points: 45670,
    gender: '여성'
  },
  {
    id: 'ffc26e5a-4ea8-496b-a460-55fbc9faea16',
    name: '서준혁',
    phone: '010-0000-1111',
    email: 'junhyuk.seo@example.com',
    member_status: '임시회원',
    created_at: '2022-03-14',
    league_points: 78940,
    gender: '남성'
  },
  {
    id: '4729b6ac-355f-4704-acf0-c545363c4190',
    name: '김수영',
    phone: '010-1234-5678',
    email: 'sooyoung.kim@example.com',
    member_status: '정회원',
    created_at: '2023-05-10',
    league_points: 15320,
    gender: '남성'
  },
  {
    id: '9246e666-483f-48b5-a37e-f0204ac8620c',
    name: '문지혜',
    phone: '010-8765-4321',
    email: 'jihye.moon@example.com',
    member_status: '임시회원',
    created_at: '2024-01-15',
    league_points: 905870,
    gender: '여성'
  },
  {
    id: '49408b84-c95b-435f-b59f-c92b1cdd8ce9',
    name: '조현우',
    phone: '010-1111-2222',
    email: 'hyunwoo.jo@example.com',
    member_status: '정회원',
    created_at: '2022-12-30',
    league_points: 63580,
    gender: '남성'
  },
  {
    id: 'b35538ec-34ce-4f70-b3ac-70aaf0c6ec6c',
    name: '류민지',
    phone: '010-3333-4444',
    email: 'minji.ryu@example.com',
    member_status: '정회원',
    created_at: '2023-07-20',
    league_points: 87090,
    gender: '여성'
  },
  {
    id: '64748185-c1fb-4eab-8151-ec3dbdc1a99d',
    name: '남지호',
    phone: '010-5555-6666',
    email: 'jiho.nam@example.com',
    member_status: '임시회원',
    created_at: '2021-09-12',
    league_points: 20760,
    gender: '남성'
  },
  {
    id: '58d3ea81-34e6-41e9-99e5-58bed52b1d4f',
    name: '황은솔',
    phone: '010-7777-8888',
    email: 'eunsol.hwang@example.com',
    member_status: '정회원',
    created_at: '2024-02-01',
    league_points: 950120,
    gender: '여성'
  },
  {
    id: '12aafbf6-6b0a-4119-abfc-39c815cd2d4b',
    name: '심지성',
    phone: '010-9999-0000',
    email: 'jisung.shim@example.com',
    member_status: '임시회원',
    created_at: '2023-10-11',
    league_points: 40890,
    gender: '남성'
  },
  {
    id: '5ea2591a-ddf1-4dcd-9a9c-faadaad32c0f',
    name: '진서윤',
    phone: '010-2222-3333',
    email: 'seoyoon.jin@example.com',
    member_status: '정회원',
    created_at: '2022-11-05',
    league_points: 78340,
    gender: '여성'
  },
  {
    id: '3afa5a3f-c249-4b0f-9432-d6511f4e947e',
    name: '손대현',
    phone: '010-4444-5555',
    email: 'daehyun.son@example.com',
    member_status: '정회원',
    created_at: '2021-06-25',
    league_points: 999990,
    gender: '남성'
  },
  {
    id: '9d4ee24e-7163-4087-98b8-1e6ee87762ef',
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
  id: string;
  user_id: string;
  date: string;
  tournament: string;
  prize: number;
}

export const mockGameWinHistories: GameWinHistory[] = [
  {
    id: '536bba51-271f-431c-8a40-e1cdea939d72',
    user_id: 'a31d5465-0100-41fa-9c08-69f5c1478248',
    date: '2020-03-15',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 75000
  },
  {
    id: 'ce23b5b6-88f6-435b-80f4-e651ed7fbbcb',
    user_id: '57df757c-218d-4131-990a-31b5eace78a0',
    date: '2020-07-22',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 150000
  },
  {
    id: 'a0cca083-d490-4c98-b696-5eca661a0e47',
    user_id: '5fe4cbee-8383-4634-9d1c-2e8416e20b28',
    date: '2021-01-10',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 300000
  },
  {
    id: 'db1ee272-1de1-4610-83ba-48637286c65d',
    user_id: 'b31f0f95-9466-48fe-8322-dc543dcda24c',
    date: '2021-05-18',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 450000
  },
  {
    id: 'c1b71e04-c1fd-4521-829c-c322660e4ac4',
    user_id: '5c6b0561-c412-4bad-a5f3-f95987d5bf42',
    date: '2021-09-07',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 2000000
  },
  {
    id: 'ab81872c-4b5e-4cf4-a47a-345474a6e6fa',
    user_id: '9b2846a5-b58f-43f8-bafc-494de638aeab',
    date: '2022-02-25',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 800000
  },
  {
    id: 'f689f2f7-7a0f-4f91-b0fb-b24efdf301f4',
    user_id: 'c3e78a38-fa00-4863-88f9-c5b79cbe2eef',
    date: '2022-06-30',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1200000
  },
  {
    id: '80ec4c9c-219d-4029-9da0-d41bfb1dacb9',
    user_id: '0be48e2d-0777-4156-a472-38b6fd5a5c3e',
    date: '2022-10-11',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 500000
  },
  {
    id: '28699822-0eb1-47fb-97c0-ea40ea2d6559',
    user_id: '1f793829-83c8-4301-aed5-31536c75f815',
    date: '2023-01-05',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 95000
  },
  {
    id: '13565696-e4e4-4c42-92c3-d26c553169c6',
    user_id: '12e1f2d1-a19c-43fc-9c96-de987c9ebffb',
    date: '2023-03-12',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1750000
  },
  {
    id: 'f067bd27-9e02-4402-b651-2144a39cd345',
    user_id: 'a31d5465-0100-41fa-9c08-69f5c1478248',
    date: '2023-04-23',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 650000
  },
  {
    id: '6d2ab8ed-6250-4d6f-9195-8c6a149d04ba',
    user_id: '57df757c-218d-4131-990a-31b5eace78a0',
    date: '2023-06-07',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1100000
  },
  {
    id: '8012e815-57ae-4d59-9128-143086e82b69',
    user_id: '5fe4cbee-8383-4634-9d1c-2e8416e20b28',
    date: '2023-08-19',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 400000
  },
  {
    id: '2d617036-0909-46ad-9d98-966876c06526',
    user_id: 'b31f0f95-9466-48fe-8322-dc543dcda24c',
    date: '2023-10-03',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1300000
  },
  {
    id: '0c764b7e-cb83-40e6-8a68-d766a2f1300d',
    user_id: '5c6b0561-c412-4bad-a5f3-f95987d5bf42',
    date: '2023-12-15',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 850000
  },
  {
    id: 'a1b3e9e0-ceeb-4db4-b96f-bcc7d39f98f7',
    user_id: '9b2846a5-b58f-43f8-bafc-494de638aeab',
    date: '2024-01-20',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 175000
  },
  {
    id: '6eb30cab-ff0e-4fbe-85b7-9f4ac4497dcd',
    user_id: 'c3e78a38-fa00-4863-88f9-c5b79cbe2eef',
    date: '2024-01-20',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 920000
  },
  {
    id: 'ff45ce4d-ff4c-441f-a93f-b19c58f73349',
    user_id: '0be48e2d-0777-4156-a472-38b6fd5a5c3e',
    date: '2024-05-17',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1150000
  },
  {
    id: '075637da-fb53-47fd-8b74-4bc544c362f2',
    user_id: '1f793829-83c8-4301-aed5-31536c75f815',
    date: '2024-07-29',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 210000
  },
  {
    id: 'c308e07a-4353-49fc-a7a0-4acc87780487',
    user_id: '12e1f2d1-a19c-43fc-9c96-de987c9ebffb',
    date: '2024-09-11',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1650000
  },
  {
    id: '0041dcd4-b488-4cfb-875a-b7cd26023731',
    user_id: 'a31d5465-0100-41fa-9c08-69f5c1478248',
    date: '2020-05-14',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 990000
  },
  {
    id: 'f8883ce6-3eab-4fa9-9254-cb2c19874d09',
    user_id: '57df757c-218d-4131-990a-31b5eace78a0',
    date: '2020-08-28',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1250000
  },
  {
    id: '290dc2ae-49da-4223-ba18-0f52f5e43b0e',
    user_id: '5fe4cbee-8383-4634-9d1c-2e8416e20b28',
    date: '2020-11-03',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 550000
  },
  {
    id: 'f5544eca-1ce8-416d-b3b4-a585864a5894',
    user_id: 'b31f0f95-9466-48fe-8322-dc543dcda24c',
    date: '2021-02-17',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 780000
  },
  {
    id: '9deb4802-74ce-4f75-8af9-4ee5f12b0437',
    user_id: '5c6b0561-c412-4bad-a5f3-f95987d5bf42',
    date: '2021-04-26',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1600000
  },
  {
    id: '34e42198-9f17-4655-a5dd-be3d936df464',
    user_id: '9b2846a5-b58f-43f8-bafc-494de638aeab',
    date: '2021-07-09',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 430000
  },
  {
    id: '2a99c03d-7e7f-4805-9364-1501f6cfc829',
    user_id: 'c3e78a38-fa00-4863-88f9-c5b79cbe2eef',
    date: '2021-09-21',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 2000000
  },
  {
    id: '3f04a9f6-5217-4916-a683-2da165451dc9',
    user_id: '0be48e2d-0777-4156-a472-38b6fd5a5c3e',
    date: '2021-12-12',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 670000
  },
  {
    id: '55b28bfc-3ed5-420d-ac13-ca36832f7ed2',
    user_id: '1f793829-83c8-4301-aed5-31536c75f815',
    date: '2022-03-03',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 850000
  },
  {
    id: '155f2740-3f70-4623-bf63-d99681209b90',
    user_id: '12e1f2d1-a19c-43fc-9c96-de987c9ebffb',
    date: '2022-05-25',
    tournament: '텍사스 홀덤 토너먼트',
    prize: 1350000
  }
];

export interface PaymentHistory {
  id: string;
  user_id: string;
  date: string;
  item: string;
  amount: number;
  method: string;
}

export const mockPaymentHistories: PaymentHistory[] = [
  {
    id: '717716eb-2966-42fc-abc1-b2d1bb8b736b',
    user_id: '5fe4cbee-8383-4634-9d1c-2e8416e20b28',
    date: '2020-02-15',
    item: '바이인',
    amount: 15000,
    method: '카드'
  },
  {
    id: '0e008aec-18b2-4595-a01a-79a108eabecc',
    user_id: 'c3e78a38-fa00-4863-88f9-c5b79cbe2eef',
    date: '2020-05-23',
    item: '식음료',
    amount: 50000,
    method: '외식 이용권'
  },
  {
    id: '8f041fec-8701-4af7-882e-e4155f38ec7c',
    user_id: 'ffc26e5a-4ea8-496b-a460-55fbc9faea16',
    date: '2020-08-07',
    item: '바이인',
    amount: 32000,
    method: '카드'
  },
  {
    id: '8bb01b80-9adc-46ce-90d5-6dbace5d847e',
    user_id: 'a31d5465-0100-41fa-9c08-69f5c1478248',
    date: '2020-11-11',
    item: '식음료',
    amount: 87000,
    method: '외식 이용권'
  },
  {
    id: '7b4679f8-22f7-4fa3-9ab1-ee09e6ff8ad8',
    user_id: '49408b84-c95b-435f-b59f-c92b1cdd8ce9',
    date: '2021-01-20',
    item: '바이인',
    amount: 23000,
    method: '카드'
  },
  {
    id: '7c19a380-0a6c-4588-b8a2-da3c41cfd643',
    user_id: '1f793829-83c8-4301-aed5-31536c75f815',
    date: '2021-03-14',
    item: '식음료',
    amount: 110000,
    method: '외식 이용권'
  },
  {
    id: 'f9074ae9-ddda-42f0-b5bb-6c2810ac2550',
    user_id: 'b31f0f95-9466-48fe-8322-dc543dcda24c',
    date: '2021-05-29',
    item: '바이인',
    amount: 45000,
    method: '카드'
  },
  {
    id: '92ea423c-f6b5-4eb0-ae79-2727a7e6bc12',
    user_id: 'cc0bd1db-8476-455e-b412-653899bca575',
    date: '2021-07-07',
    item: '식음료',
    amount: 99000,
    method: '외식 이용권'
  },
  {
    id: '618d20ad-3fc0-4c17-9600-d2323476395d',
    user_id: '9b2846a5-b58f-43f8-bafc-494de638aeab',
    date: '2021-09-16',
    item: '바이인',
    amount: 67000,
    method: '카드'
  },
  {
    id: 'd037067b-811e-483a-954e-c810467e6e37',
    user_id: '57df757c-218d-4131-990a-31b5eace78a0',
    date: '2021-11-03',
    item: '식음료',
    amount: 200000,
    method: '외식 이용권'
  },
  {
    id: 'f9b0bc17-ddf8-4e0d-a049-0a335178430e',
    user_id: '12e1f2d1-a19c-43fc-9c96-de987c9ebffb',
    date: '2022-01-25',
    item: '바이인',
    amount: 12000,
    method: '카드'
  },
  {
    id: 'be4461a5-def6-43a4-af04-1be93e339e5c',
    user_id: '0be48e2d-0777-4156-a472-38b6fd5a5c3e',
    date: '2022-03-30',
    item: '식음료',
    amount: 175000,
    method: '외식 이용권'
  },
  {
    id: '091ba1ef-3626-471c-bb09-4827b48c583e',
    user_id: '9246e666-483f-48b5-a37e-f0204ac8620c',
    date: '2022-05-12',
    item: '바이인',
    amount: 98000,
    method: '카드'
  },
  {
    id: '35001d39-6cb4-41ea-9d01-5538f9e7f03c',
    user_id: '5c6b0561-c412-4bad-a5f3-f95987d5bf42',
    date: '2022-07-04',
    item: '식음료',
    amount: 54000,
    method: '외식 이용권'
  },
  {
    id: 'a8030971-b33f-4fd5-a3df-76a627e88819',
    user_id: '5ea2591a-ddf1-4dcd-9a9c-faadaad32c0f',
    date: '2022-09-19',
    item: '바이인',
    amount: 21000,
    method: '카드'
  },
  {
    id: '767f4a3f-73b2-4c93-beda-6750c94784ac',
    user_id: '64748185-c1fb-4eab-8151-ec3dbdc1a99d',
    date: '2022-11-28',
    item: '식음료',
    amount: 135000,
    method: '외식 이용권'
  },
  {
    id: 'ae67c38f-f4c0-40a5-aa6e-d389e7ec9b0a',
    user_id: '4729b6ac-355f-4704-acf0-c545363c4190',
    date: '2023-01-06',
    item: '바이인',
    amount: 65000,
    method: '카드'
  },
  {
    id: '8a7eca20-a259-4a77-b441-e8594cbb26b3',
    user_id: '12aafbf6-6b0a-4119-abfc-39c815cd2d4b',
    date: '2023-02-14',
    item: '식음료',
    amount: 155000,
    method: '외식 이용권'
  },
  {
    id: '66525c7e-0fcd-4c43-a5d5-886ce3b22220',
    user_id: '9d4ee24e-7163-4087-98b8-1e6ee87762ef',
    date: '2023-04-01',
    item: '바이인',
    amount: 43000,
    method: '카드'
  },
  {
    id: 'aec21f2b-b632-4dc6-889b-78f93c55c5db',
    user_id: 'b35538ec-34ce-4f70-b3ac-70aaf0c6ec6c',
    date: '2023-06-09',
    item: '식음료',
    amount: 87000,
    method: '외식 이용권'
  }
];
