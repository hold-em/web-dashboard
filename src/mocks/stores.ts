export interface Store {
  id: string;
  name: string;
  phone: string;
  address: string;
  status: string;
  league: string;
  representative_image?: string;
  convenience_info: string[];
  created_at: string;
}

export const mockStores: Store[] = [
  {
    id: 'e9bfa6fc-e8e6-4364-b4e3-6aa9c1f48825',
    name: '매장A',
    phone: '010-1234-5678',
    address: '경기 수원시 영통구 대학로 56 201호',
    status: '영업중',
    league: '리그A',
    convenience_info: [],
    created_at: '2023-01-01'
  },
  {
    id: 'b386d778-40ae-4295-8bec-6f5a8474c9d8',
    name: '매장B',
    phone: '010-1234-5678',
    address: '경기 수원시 영통구 대학로 56 201호',
    status: '영업중',
    league: '리그B',
    convenience_info: [],
    created_at: '2023-02-01'
  },
  {
    id: '6fcf19aa-5345-4ff2-b7af-7815ab960c05',
    name: '매장C',
    phone: '010-1234-5678',
    address: '경기 수원시 영통구 대학로 56 201호',
    status: '영업중',
    league: '리그C',
    convenience_info: [],
    created_at: '2023-03-01'
  },
  {
    id: '7aedd63c-51a6-4b3b-8f68-b6d8c1c1e46a',
    name: '매장D',
    phone: '010-1234-5678',
    address: '경기 수원시 영통구 대학로 56 201호',
    status: '영업중',
    league: '리그A',
    convenience_info: [],
    created_at: '2023-04-01'
  }
];
