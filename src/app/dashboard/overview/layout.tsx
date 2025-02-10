import PageContainer from '@/components/layout/page-container';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React from 'react';

export default function OverViewLayout({
  sales,
  bar_stats
}: {
  sales: React.ReactNode;
  bar_stats: React.ReactNode;
}) {
  return (
    <PageContainer>
      <div className='flex flex-1 flex-col space-y-3'>
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>총 매출</CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>₩ 11,600,000</div>
              <p className='mt-2 text-xs text-muted-foreground'>
                지난달 대비 20.1% 상승
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                총 예약 건수
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>30</div>
              <p className='mt-2 text-xs text-muted-foreground'>
                지난달 대비 15% 상승
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>
                현재 진행중인 게임
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-2xl font-bold'>3</div>
            </CardContent>
          </Card>
        </div>
        <div className='grid grid-cols-1 items-stretch gap-4 md:grid-cols-2'>
          <div className='flex h-full min-h-[300px] flex-col'>{bar_stats}</div>
          <div className='flex h-full min-h-[300px] flex-col'>{sales}</div>
        </div>
        <div>
          <Card>
            <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
              <CardTitle className='text-sm font-medium'>최근 알림</CardTitle>
            </CardHeader>
            <CardContent>
              <p>
                새로운 결제 - <strong>₩50,000 (야자수 홀덤펍 1)</strong>
              </p>
              <p>
                새 게임 추가 -{' '}
                <strong>5,000,000 PRIZE (야자수 홀덤펍 2)</strong>
              </p>
              <p>
                새로운 결제 - <strong>이용권 4개 (야자수 홀덤펍 3)</strong>
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </PageContainer>
  );
}
