'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function RecentSalesSkeleton() {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='px-4 pb-2 sm:px-6'>
        <Skeleton className='h-6 w-40' />
        <Skeleton className='mt-1 h-4 w-56' />
      </CardHeader>
      <CardContent className='px-4 sm:px-6'>
        <div className='divide-y divide-border'>
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className='flex items-center gap-4 py-3'>
              <div className='flex flex-col space-y-1'>
                <Skeleton className='h-4 w-28' />
                <Skeleton className='h-3 w-20' />
              </div>
              <Skeleton className='ml-auto h-4 w-16' />
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
