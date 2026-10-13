'use client';

import * as React from 'react';

import { ReportBarChart } from '@/components/report-bar-chart';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { reportSummary } from '@/lib/report';
import type { ReportScoreData } from '@/lib/report-types';
import { PASSING_SCORE } from '@/lib/scoring';

export function ReportScoreChart({ subjects, stats }: ReportScoreData) {
  const [picked, setPicked] = React.useState('');
  const subject = subjects.includes(picked) ? picked : (subjects[0] ?? '');
  const classStats = stats[subject] ?? [];
  const { passedPercent } = reportSummary(classStats);
  const items = subjects.map((s) => ({ value: s, label: s }));

  return (
    <Card className='@container/card'>
      <CardHeader>
        <CardTitle>Report Score</CardTitle>
        <CardDescription>
          Average final score per grade · Passed percentage:{' '}
          {passedPercent === null ? '-' : `${passedPercent}%`} (min. {PASSING_SCORE})
        </CardDescription>
        {subjects.length > 0 && (
          <CardAction>
            <Select items={items} value={subject} onValueChange={(v) => v && setPicked(v)}>
              <SelectTrigger size='sm' className='w-40' aria-label='Select subject'>
                <SelectValue placeholder='Subject' />
              </SelectTrigger>
              <SelectContent className='rounded-xl'>
                {items.map((i) => (
                  <SelectItem key={i.value} value={i.value} className='rounded-lg'>
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardAction>
        )}
      </CardHeader>
      <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
        <ReportBarChart stats={classStats} className='h-[250px]' />
      </CardContent>
    </Card>
  );
}
