'use client';

import { AwardIcon, BookOpenCheckIcon, CircleCheckIcon, ClipboardCheckIcon } from 'lucide-react';

import { SimpleDataTable, type Column } from '@/components/simple-data-table';
import { StatCards } from '@/components/stat-cards';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import type { ViewScoreData, ViewScoreRow } from '@/lib/score-types';
import { PASSING_SCORE, average, finalScore } from '@/lib/scoring';

type Row = ViewScoreRow & { final: number | null };

const show = (n: number | null) => (n === null ? '-' : n);

const columns: Column<Row>[] = [
  { header: 'Subject ID', cell: (r) => r.subjectId },
  { header: 'Subject Name', cell: (r) => r.subject, className: 'font-medium' },
  { header: 'Assignment', cell: (r) => show(r.assignment), className: 'text-right tabular-nums' },
  { header: 'Mid Exam', cell: (r) => show(r.midExam), className: 'text-right tabular-nums' },
  { header: 'Final Exam', cell: (r) => show(r.finalExam), className: 'text-right tabular-nums' },
  { header: 'Final', cell: (r) => show(r.final), className: 'text-right font-medium tabular-nums' },
  {
    header: 'Status',
    cell: (r) =>
      r.final === null ? (
        <Badge variant='outline'>Not complete</Badge>
      ) : (
        <Badge variant={r.final >= PASSING_SCORE ? 'default' : 'destructive'}>
          {r.final >= PASSING_SCORE ? 'Passed' : 'Not passed'}
        </Badge>
      ),
  },
];

export function ViewScore({ student, className, rows: scoreRows }: ViewScoreData) {
  if (!className) {
    return (
      <Card>
        <CardContent className='flex h-40 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground'>
          <ClipboardCheckIcon className='size-6' />
          You are not assigned to a class yet, so there are no scores to show. Please contact the
          administrator.
        </CardContent>
      </Card>
    );
  }

  const rows: Row[] = scoreRows.map((r) => ({ ...r, final: finalScore(r, r.weights) }));
  const completed = rows.filter((r) => r.final !== null);
  const passed = completed.filter((r) => (r.final as number) >= PASSING_SCORE).length;
  const best = [...completed].sort((a, b) => (b.final as number) - (a.final as number))[0];

  // bobot ditampilkan bila sama untuk semua pelajaran; kalau berbeda, dijelaskan per pelajaran
  const w = rows[0]?.weights;
  const uniform =
    w !== undefined &&
    rows.every(
      (r) =>
        r.weights.assignment === w.assignment &&
        r.weights.midExam === w.midExam &&
        r.weights.finalExam === w.finalExam,
    );

  return (
    <div className='flex flex-col gap-4 md:gap-6'>
      <StatCards
        items={[
          {
            label: 'Average Final Score',
            value: average(completed.map((r) => r.final as number)) ?? '-',
            icon: BookOpenCheckIcon,
            badge: `Class ${className}`,
            title: student.name,
            note: `${completed.length} of ${rows.length} subjects completed`,
          },
          {
            label: 'Subjects Passed',
            value: `${passed}/${completed.length}`,
            icon: CircleCheckIcon,
            badge: `Pass ≥ ${PASSING_SCORE}`,
            title: `${completed.length - passed} subjects below the passing score`,
            note: 'Based on the final score of each completed subject',
          },
          {
            label: 'Highest Score',
            value: best?.final ?? '-',
            icon: AwardIcon,
            badge: best?.subject ?? '-',
            title: 'Best subject this semester',
            note: best ? `${best.subjectId} · ${best.subject}` : 'No completed scores yet',
          },
        ]}
      />

      <p className='text-sm text-muted-foreground'>
        <span className='font-medium text-foreground'>{student.name}</span> ({student.studentId}) ·
        Class {className}
        {w && uniform && (
          <>
            {' '}
            · Assignment: {w.assignment}%, Mid Exam: {w.midExam}%, Final Exam: {w.finalExam}%
          </>
        )}
        {w && !uniform && ' · Score weights differ per subject'}
      </p>

      <SimpleDataTable data={rows} columns={columns} getRowId={(r) => r.subjectId} />
    </div>
  );
}
