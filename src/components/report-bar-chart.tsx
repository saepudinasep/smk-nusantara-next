'use client';

import { Bar, BarChart, CartesianGrid, LabelList, XAxis, YAxis } from 'recharts';
import { cn } from 'cn';

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  type ChartConfig,
} from '@/components/ui/chart';
import { chartRows, chartSeries } from '@/lib/report';
import type { ReportClassStats } from '@/lib/report-types';

const PALETTE = ['var(--primary)', 'var(--chart-2)', 'var(--chart-3)', 'var(--chart-4)'];

/** Nilai akhir rata-rata per tingkat; satu batang per kelas A/B (huruf akhir nama kelas). */
export function ReportBarChart({
  stats,
  className,
}: {
  stats: ReportClassStats[];
  className?: string;
}) {
  const series = chartSeries(stats);
  const rows = chartRows(stats);
  const hasData = rows.some((r) => series.some((s) => r[s] !== null));

  if (!hasData) {
    return (
      <div
        className={cn(
          'flex w-full items-center justify-center text-sm text-muted-foreground',
          className,
        )}
      >
        No completed scores yet for this subject.
      </div>
    );
  }

  const config: ChartConfig = Object.fromEntries(
    series.map((s, i) => [s, { label: `Class ${s}`, color: PALETTE[i % PALETTE.length] }]),
  );

  return (
    <ChartContainer config={config} className={cn('aspect-auto w-full', className)}>
      <BarChart data={rows} margin={{ top: 20 }}>
        <CartesianGrid vertical={false} />
        <XAxis dataKey='grade' tickLine={false} axisLine={false} tickMargin={8} />
        <YAxis domain={[0, 100]} tickLine={false} axisLine={false} width={32} />
        <ChartTooltip cursor={false} content={<ChartTooltipContent indicator='dot' />} />
        {series.map((s) => (
          <Bar key={s} dataKey={s} fill={`var(--color-${s})`} radius={4}>
            <LabelList dataKey={s} position='top' className='fill-foreground text-xs' />
          </Bar>
        ))}
      </BarChart>
    </ChartContainer>
  );
}
