import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
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
  },
  {
    id: 6,
    type: '식음료 이용권',
    name: '오현우',
    payment: '이용권 20개'
  }
];

export function RecentSales() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>최근 판매 내역</CardTitle>
        <CardDescription>한 달간 123 건 판매</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-8'>
          {MOCK_ITEMS.map((item) => (
            <div key={item.id} className='flex items-center'>
              <div className='space-y-1'>
                <p className='text-sm text-muted-foreground'>{item.type}</p>
                <p className='text-sm font-medium leading-none'>
                  {item.name} 님
                </p>
              </div>
              <div className='ml-auto font-medium'>+ {item.payment}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
