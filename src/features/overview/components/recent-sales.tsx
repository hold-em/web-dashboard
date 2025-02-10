'use client';

import {
  Card,
  CardHeader,
  CardContent,
  CardTitle,
  CardDescription
} from '@/components/ui/card';

interface ItemType {
  id: number | string;
  type: string;
  name: string;
  payment: string;
}

const MOCK_ITEMS: ItemType[] = [
  {
    id: 1,
    type: '현금',
    name: '김민준',
    payment: '₩1,500,000'
  },
  {
    id: 2,
    type: '식음료 이용권',
    name: '박준영',
    payment: '이용권 20개'
  },
  {
    id: 3,
    type: '식음료 이용권',
    name: '이도현',
    payment: '이용권 20개'
  },
  {
    id: 4,
    type: '식음료 이용권',
    name: '최우진',
    payment: '이용권 20개'
  },
  {
    id: 5,
    type: '식음료 이용권',
    name: '정승현',
    payment: '이용권 20개'
  }
];

export function RecentSales() {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='pb-2'>
        <CardTitle className='text-lg font-semibold'>최근 판매 내역</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>
          한 달간 123 건 판매
        </CardDescription>
      </CardHeader>

      <CardContent className='flex-1'>
        <div className='divide-y divide-border'>
          {MOCK_ITEMS.map((item) => (
            <div
              key={item.id}
              className='flex items-center gap-4 py-3 transition-colors hover:bg-muted'
            >
              <div className='flex flex-col'>
                <span className='text-sm font-medium'>{item.name} 님</span>
                <span className='text-xs text-muted-foreground'>
                  {item.type}
                </span>
              </div>
              <div className='ml-auto text-sm font-medium'>{item.payment}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
