'use client';

import { useSelectedStore } from '@/hooks/use-selected-store';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Store } from 'lucide-react';

export function StoreContextExample() {
  const { selectedStore, hasSelectedStore } = useSelectedStore();

  if (!hasSelectedStore) {
    return (
      <Alert>
        <Store className='h-4 w-4' />
        <AlertTitle>매장이 선택되지 않았습니다</AlertTitle>
        <AlertDescription>
          상단의 매장 선택 드롭다운에서 매장을 선택해주세요.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>선택된 매장 정보</CardTitle>
        <CardDescription>현재 선택된 매장의 상세 정보입니다.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='space-y-2'>
          <div>
            <span className='font-medium'>매장명:</span> {selectedStore!.name}
          </div>
          {selectedStore!.phone_number && (
            <div>
              <span className='font-medium'>전화번호:</span>{' '}
              {selectedStore!.phone_number}
            </div>
          )}
          {selectedStore!.address && (
            <div>
              <span className='font-medium'>주소:</span>{' '}
              {selectedStore!.address}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
