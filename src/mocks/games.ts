export interface Game {
  id: string;
  name: string;
  start_at: string;
  status: string;
  store_id: string;
  game_type: string;
  game_mode: string;
  buy_in: number;
  reg_close_level: number;
  total_players: number;
  starting_chips: number;
  reentry_chips: number;
  average_stack: number;
  total_stack: number;
  break_time: number;
  structure_id: string;
  table_id: string;
  created_at: string;
}

export const mockGames: Game[] = [
  {
    id: 'b2396a2c-ffee-4114-8d7c-21c2b7fab198',
    store_id: 'e9bfa6fc-e8e6-4364-b4e3-6aa9c1f48825',
    structure_id: 'f54d6069-7878-47fc-b5c7-f272fc75dbe3',
    table_id: 'ed6416c8-0aa2-4865-aac2-a9bf58f255e0',
    name: '게임1',
    game_type: '게임타입1',
    game_mode: '게임모드1',
    buy_in: 50000,
    reg_close_level: 10,
    total_players: 6,
    starting_chips: 10000,
    reentry_chips: 10000,
    average_stack: 10000,
    total_stack: 100000,
    break_time: 30,
    created_at: '2025-02-01',
    start_at: '2025-02-01',
    status: '종료'
  },
  {
    id: '88a37bba-deb9-4b4a-a58a-f867081f65aa',
    store_id: 'b386d778-40ae-4295-8bec-6f5a8474c9d8',
    structure_id: 'b91facbd-4e8b-4b7c-805f-ce1eb2d902bd',
    table_id: '250f0adf-39c8-4804-95ac-6d566100045a',
    name: '게임2',
    game_type: '게임타입1',
    game_mode: '게임모드1',
    buy_in: 50000,
    reg_close_level: 10,
    total_players: 6,
    starting_chips: 10000,
    reentry_chips: 10000,
    average_stack: 10000,
    total_stack: 100000,
    break_time: 30,
    created_at: '2025-02-02',
    start_at: '2025-02-11',
    status: '예정'
  },
  {
    id: '5f375b6e-ff30-426a-826c-f18d0be6e2f8',
    store_id: '6fcf19aa-5345-4ff2-b7af-7815ab960c05',
    structure_id: 'a3870fb6-3d4f-4feb-a586-838c9075eebf',
    table_id: '654e6148-8959-45ab-bef5-716e3e1450e8',
    name: '게임3',
    game_type: '게임타입1',
    game_mode: '게임모드1',
    buy_in: 50000,
    reg_close_level: 10,
    total_players: 6,
    starting_chips: 10000,
    reentry_chips: 10000,
    average_stack: 10000,
    total_stack: 100000,
    break_time: 30,
    created_at: '2025-02-03',
    start_at: '2025-02-11',
    status: '예정'
  },
  {
    id: 'f8915c02-0a65-47cd-b00e-e84ef473a172',
    store_id: '7aedd63c-51a6-4b3b-8f68-b6d8c1c1e46a',
    structure_id: 'f54d6069-7878-47fc-b5c7-f272fc75dbe3',
    table_id: '654e6148-8959-45ab-bef5-716e3e1450e8',
    name: '게임4',
    game_type: '게임타입1',
    game_mode: '게임모드1',
    buy_in: 50000,
    reg_close_level: 10,
    total_players: 6,
    starting_chips: 10000,
    reentry_chips: 10000,
    average_stack: 10000,
    total_stack: 100000,
    break_time: 30,
    created_at: '2025-02-11',
    start_at: '2025-02-11',
    status: '진행 중'
  }
];

export interface Structure {
  id: string;
  name: string;
  level: string;
  ante: string;
  duration: string;
  created_at: string;
}

export const mockStructures: Structure[] = [
  {
    id: 'f54d6069-7878-47fc-b5c7-f272fc75dbe3',
    name: '스트럭처1',
    level: '10/20, 20/40, 30/60',
    ante: '5, 10, 15',
    duration: '20분, 30분, 40분',
    created_at: '2025-01-01'
  },
  {
    id: 'b91facbd-4e8b-4b7c-805f-ce1eb2d902bd',
    name: '스트럭처2',
    level: '10/20, 20/40, 30/60',
    ante: '5, 10, 15',
    duration: '20분, 30분, 40분',
    created_at: '2025-01-01'
  },
  {
    id: 'a3870fb6-3d4f-4feb-a586-838c9075eebf',
    name: '스트럭처3',
    level: '10/20, 20/40, 30/60',
    ante: '5, 10, 15',
    duration: '20분, 30분, 40분',
    created_at: '2025-01-01'
  }
];
