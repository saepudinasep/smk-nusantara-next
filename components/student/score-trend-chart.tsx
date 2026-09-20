'use client';

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent, type ChartConfig } from '@/components/ui/chart';
import { scoreTrend } from '@/lib/dummy-data/student';

const chartConfig = {
  score: {
    label: 'Rata-rata Nilai',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function ScoreTrendChart() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Tren Rata-rata Nilai</CardTitle>
        <CardDescription>6 bulan terakhir</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-[250px] w-full'>
          <AreaChart data={scoreTrend}>
            <defs>
              <linearGradient id='fillScore' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-score)' stopOpacity={0.8} />
                <stop offset='95%' stopColor='var(--color-score)' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
            <YAxis domain={[70, 100]} tickLine={false} axisLine={false} width={32} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
            <Area dataKey='score' type='monotone' fill='url(#fillScore)' stroke='var(--color-score)' />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
