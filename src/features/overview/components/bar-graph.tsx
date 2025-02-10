'use client';
import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent
} from '@/components/ui/chart';

export const description = 'An interactive bar chart';

const chartData = [
  { date: '2025-02-02', price: 3160000 },
  { date: '2025-02-03', price: 2100000 },
  { date: '2025-02-04', price: 1050000 },
  { date: '2025-02-05', price: 2100000 },
  { date: '2025-02-06', price: 1050000 },
  { date: '2025-02-07', price: 1580000 },
  { date: '2025-02-08', price: 560000 }
];

const chartConfig = {
  prices: {
    label: '매출'
  }
} satisfies ChartConfig;

export function BarGraph() {
  const [isClient, setIsClient] = React.useState(false);

  React.useEffect(() => {
    setIsClient(true);
  }, []);

  const total = React.useMemo(
    () => chartData.reduce((acc, curr) => acc + curr.price, 0).toLocaleString(),
    []
  );

  if (!isClient) {
    return null;
  }

  return (
    <Card className='flex h-full flex-col'>
      <CardHeader className='pb-2'>
        <div className='flex flex-col gap-1'>
          <CardTitle className='text-lg font-semibold'>
            주간 매출 현황
          </CardTitle>
          <CardDescription className='text-sm text-muted-foreground'>
            2025.01.16 ~ 2025.01.22
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className='flex flex-auto flex-col justify-end px-4 sm:px-6 sm:pb-6'>
        <div className='mb-4 text-center'>
          <strong className='text-2xl'>₩ {total}</strong>
        </div>
        <ChartContainer config={chartConfig} className='mt-4 h-[220px] w-full'>
          <BarChart
            data={chartData}
            margin={{ top: 20, right: 20, bottom: 20, left: 20 }}
          >
            <CartesianGrid strokeDasharray='3 3' vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={10}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('ko-KR', { weekday: 'short' });
              }}
              style={{ fontSize: '0.8rem' }}
            />
            <YAxis hide />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className='w-[150px]'
                  nameKey='prices'
                  labelFormatter={(value) => {
                    return new Date(value).toLocaleDateString('ko-KR', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    });
                  }}
                />
              }
            />
            <Bar
              dataKey='price'
              fill='#1D4A2A'
              barSize={36}
              radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
