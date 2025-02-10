'use client';

import { Skeleton } from '@/components/ui/skeleton';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function BarGraphSkeleton() {
  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='px-4 pb-2 sm:px-6'>
        <div className='flex flex-col gap-1'>
          <Skeleton className='h-6 w-40' />
          <Skeleton className='h-4 w-56' />
        </div>
      </CardHeader>
      <CardContent className='flex flex-auto flex-col justify-end px-4 sm:px-6 sm:pb-6'>
        <div className='mb-4 text-center'>
          <Skeleton className='mx-auto h-8 w-32' />
        </div>
        <div className='mt-4 flex h-[220px] w-full items-end justify-around gap-2'>
          {Array.from({ length: 7 }).map((_, i) => (
            <Skeleton
              key={i}
              className='w-9'
              style={{
                height: `${Math.max(30, Math.random() * 100)}%`
              }}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
