'use client';

import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { enrollmentTrend } from '@/lib/dummy-data/admin';

const chartConfig = {
  students: {
    label: 'Siswa',
    color: 'var(--primary)',
  },
} satisfies ChartConfig;

export function EnrollmentChart() {
  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Tren Jumlah Siswa</CardTitle>
        <CardDescription>6 bulan terakhir</CardDescription>
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ChartContainer config={chartConfig} className='aspect-auto h-62.5 w-full'>
          <AreaChart data={enrollmentTrend}>
            <defs>
              <linearGradient id='fillStudents' x1='0' y1='0' x2='0' y2='1'>
                <stop offset='5%' stopColor='var(--color-students)' stopOpacity={0.8} />
                <stop offset='95%' stopColor='var(--color-students)' stopOpacity={0.1} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} />
            <XAxis dataKey='month' tickLine={false} axisLine={false} tickMargin={8} />
            <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
            <Area
              dataKey='students'
              type='monotone'
              fill='url(#fillStudents)'
              stroke='var(--color-students)'
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
