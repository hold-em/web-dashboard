export interface GameTable {
  id: string;
  name: string;
  status: string;
  created_at: string;
  player_ids: string[];
}

export const mockTables: GameTable[] = [
  {
    id: 'ed6416c8-0aa2-4865-aac2-a9bf58f255e0',
    name: '테이블1',
    status: '진행 중',
    created_at: '2025-01-01',
    player_ids: [
      'a31d5465-0100-41fa-9c08-69f5c1478248',
      '57df757c-218d-4131-990a-31b5eace78a0',
      '5fe4cbee-8383-4634-9d1c-2e8416e20b28',
      'b31f0f95-9466-48fe-8322-dc543dcda24c',
      '5c6b0561-c412-4bad-a5f3-f95987d5bf42',
      '9b2846a5-b58f-43f8-bafc-494de638aeab'
    ]
  },
  {
    id: '250f0adf-39c8-4804-95ac-6d566100045a',
    name: '테이블2',
    status: '진행 중',
    created_at: '2025-01-01',
    player_ids: [
      'c3e78a38-fa00-4863-88f9-c5b79cbe2eef',
      '0be48e2d-0777-4156-a472-38b6fd5a5c3e',
      '1f793829-83c8-4301-aed5-31536c75f815',
      '12e1f2d1-a19c-43fc-9c96-de987c9ebffb'
    ]
  },
  {
    id: '654e6148-8959-45ab-bef5-716e3e1450e8',
    name: '테이블3',
    status: '대기 중',
    created_at: '2025-01-01',
    player_ids: [
      'cc0bd1db-8476-455e-b412-653899bca575',
      'ffc26e5a-4ea8-496b-a460-55fbc9faea16',
      '4729b6ac-355f-4704-acf0-c545363c4190',
      '9246e666-483f-48b5-a37e-f0204ac8620c'
    ]
  }
];
