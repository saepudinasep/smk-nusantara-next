'use client';

import * as React from 'react';
import { AwardIcon, BookOpenCheckIcon, PercentIcon } from 'lucide-react';

import { ReportBarChart } from '@/components/report-bar-chart';
import { SimpleDataTable, type Column } from '@/components/simple-data-table';
import { StatCards } from '@/components/stat-cards';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { reportSummary } from '@/lib/report';
import type { ReportClassStats, ReportScoreData } from '@/lib/report-types';
import { GRADE_LABEL } from '@/lib/schedule-types';
import { PASSING_SCORE } from '@/lib/scoring';

const show = (n: number | null) => (n === null ? '-' : n);
const percent = (s: ReportClassStats) =>
  s.completed ? Math.round((s.passed / s.completed) * 100) : null;

const columns: Column<ReportClassStats>[] = [
  { header: 'Class', cell: (r) => r.className, className: 'font-medium' },
  { header: 'Grade', cell: (r) => GRADE_LABEL[r.grade] ?? r.grade },
  {
    header: 'Scored',
    cell: (r) => `${r.completed}/${r.students}`,
    className: 'text-right tabular-nums',
  },
  { header: 'Assignment', cell: (r) => show(r.assignment), className: 'text-right tabular-nums' },
  { header: 'Mid Exam', cell: (r) => show(r.midExam), className: 'text-right tabular-nums' },
  { header: 'Final Exam', cell: (r) => show(r.finalExam), className: 'text-right tabular-nums' },
  {
    header: 'Final (avg)',
    cell: (r) => show(r.final),
    className: 'text-right font-medium tabular-nums',
  },
  {
    header: 'Passed',
    cell: (r) => {
      const p = percent(r);
      return p === null ? '-' : <Badge variant={p >= 75 ? 'default' : 'outline'}>{p}%</Badge>;
    },
  },
];

export function ReportScore({ subjects, stats }: ReportScoreData) {
  const [picked, setPicked] = React.useState('');
  const subject = subjects.includes(picked) ? picked : (subjects[0] ?? '');
  const classStats = stats[subject] ?? [];
  const summary = reportSummary(classStats);

  if (subjects.length === 0) {
    return (
      <Card>
        <CardContent className='flex h-32 items-center justify-center text-sm text-muted-foreground'>
          No subjects found in the database.
        </CardContent>
      </Card>
    );
  }

  const subjectItems = subjects.map((s) => ({ value: s, label: s }));

  return (
    <div className='flex flex-col gap-4 md:gap-6'>
      <StatCards
        items={[
          {
            label: `Average Final Score · ${subject}`,
            value: summary.average ?? '-',
            icon: BookOpenCheckIcon,
            badge: `Pass ≥ ${PASSING_SCORE}`,
            title: 'Mean of all class averages',
            note: 'Final = weighted average of assignment, mid and final exam',
          },
          {
            label: 'Passed Percentage',
            value: summary.passedPercent === null ? '-' : `${summary.passedPercent}%`,
            icon: PercentIcon,
            badge: subject,
            title: 'Students at or above the passing score',
            note: `Based on ${summary.completed} students with complete scores`,
          },
          {
            label: 'Best Class',
            value: summary.best?.className ?? '-',
            icon: AwardIcon,
            badge: summary.best ? `Grade ${GRADE_LABEL[summary.best.grade]}` : '-',
            title: summary.best ? `Average ${summary.best.final}` : 'No completed scores yet',
            note: summary.best
              ? `${percent(summary.best)}% of its scored students passed`
              : 'Scores appear after teachers enter them',
          },
        ]}
      />

      <div className='flex items-center gap-3'>
        <Label>Subject Name</Label>
        <Select items={subjectItems} value={subject} onValueChange={(v) => v && setPicked(v)}>
          <SelectTrigger className='w-48' aria-label='Subject name'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {subjectItems.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Average Score</CardTitle>
          <CardDescription>
            Average final score per grade, Class A vs Class B · Passed percentage:{' '}
            {summary.passedPercent === null ? '-' : `${summary.passedPercent}%`}
          </CardDescription>
        </CardHeader>
        <CardContent className='px-2 pt-4 sm:px-6 sm:pt-6'>
          <ReportBarChart stats={classStats} className='h-[300px]' />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Score per Class</CardTitle>
          <CardDescription>
            Component averages for {subject}. The Scored column counts students whose three scores
            are complete.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <SimpleDataTable
            data={classStats}
            columns={columns}
            getRowId={(r) => r.className}
            pageSizeOptions={[6, 12]}
          />
        </CardContent>
      </Card>
    </div>
  );
}
