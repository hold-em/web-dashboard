'use client';

import * as React from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

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
    <Card>
      <CardHeader>
        <div className='flex flex-1 flex-col justify-center gap-1 px-6 py-5 sm:py-6'>
          <CardTitle>주간 매출 현황</CardTitle>
          <CardDescription>2025.01.16 ~ 2025.01.16</CardDescription>
        </div>
      </CardHeader>
      <CardContent className='px-2 sm:px-6 sm:pb-6'>
        <div className='text-center'>
          <strong className='text-2xl'>₩ {total}</strong>
        </div>
        <ChartContainer
          config={chartConfig}
          className='mt-6 aspect-auto h-[200px] w-full'
        >
          <BarChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 12,
              right: 12
            }}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey='date'
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              minTickGap={32}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString('ko-KR', { weekday: 'short' });
              }}
            />
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
            <Bar dataKey='price' fill='#000' />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
