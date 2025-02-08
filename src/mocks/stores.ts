export interface Store {
  id: number | string;
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
    id: 1,
    name: '매장A',
    phone: '010-1234-5678',
    address: '경기 수원시 영통구 대학로 56 201호',
    status: '영업중',
    league: '리그A',
    convenience_info: [],
    created_at: '2023-01-01'
  },
  {
    id: 2,
    name: '매장B',
    phone: '010-1234-5678',
    address: '경기 수원시 영통구 대학로 56 201호',
    status: '영업중',
    league: '리그B',
    convenience_info: [],
    created_at: '2023-02-01'
  },
  {
    id: 3,
    name: '매장C',
    phone: '010-1234-5678',
    address: '경기 수원시 영통구 대학로 56 201호',
    status: '영업중',
    league: '리그C',
    convenience_info: [],
    created_at: '2023-03-01'
  },
  {
    id: 4,
    name: '매장D',
    phone: '010-1234-5678',
    address: '경기 수원시 영통구 대학로 56 201호',
    status: '영업중',
    league: '리그A',
    convenience_info: [],
    created_at: '2023-04-01'
  }
];
