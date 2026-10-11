'use client';

import * as React from 'react';
import { BookOpenCheckIcon, ClipboardCheckIcon, UsersIcon } from 'lucide-react';

import type { ActionResult } from '@/actions/result';
import { saveScore } from '@/actions/scores';
import { SimpleDataTable, type Column } from '@/components/simple-data-table';
import { StatCards } from '@/components/stat-cards';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Spinner } from '@/components/ui/spinner';
import type { InputScoreData, ScoreStudent, ScoreValues } from '@/lib/score-types';
import { PASSING_SCORE, average, finalScore } from '@/lib/scoring';

type Row = ScoreStudent & { final: number | null };

const show = (n: number | null) => (n === null ? '-' : n);

const columns: Column<Row>[] = [
  { header: 'Student ID', cell: (r) => r.studentId },
  { header: 'Student Name', cell: (r) => r.name, className: 'font-medium' },
  { header: 'Assignment', cell: (r) => show(r.assignment), className: 'text-right tabular-nums' },
  { header: 'Mid Exam', cell: (r) => show(r.midExam), className: 'text-right tabular-nums' },
  { header: 'Final Exam', cell: (r) => show(r.finalExam), className: 'text-right tabular-nums' },
  { header: 'Final', cell: (r) => show(r.final), className: 'text-right font-medium tabular-nums' },
];

/** Form "Entry Score" (wireframe 15). Nilai kosong = belum diisi. */
function EntryScoreSheet({
  row,
  onSave,
  onClose,
}: {
  row: Row;
  onSave: (s: ScoreValues) => Promise<ActionResult>;
  onClose: () => void;
}) {
  const [form, setForm] = React.useState({
    assignment: row.assignment === null ? '' : String(row.assignment),
    midExam: row.midExam === null ? '' : String(row.midExam),
    finalExam: row.finalExam === null ? '' : String(row.finalExam),
  });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState('');

  const fields = [
    { key: 'assignment', label: 'Assignment' },
    { key: 'midExam', label: 'Mid Exam' },
    { key: 'finalExam', label: 'Final Exam' },
  ] as const;

  const outOfRange = (v: string) => v !== '' && Number(v) > 100;
  const valid = !fields.some((f) => outOfRange(form[f.key]));
  const unchanged =
    form.assignment === (row.assignment === null ? '' : String(row.assignment)) &&
    form.midExam === (row.midExam === null ? '' : String(row.midExam)) &&
    form.finalExam === (row.finalExam === null ? '' : String(row.finalExam));

  const submit = async () => {
    setSaving(true);
    setError('');
    try {
      const toNum = (v: string) => (v === '' ? null : Number(v));
      const result = await onSave({
        assignment: toNum(form.assignment),
        midExam: toNum(form.midExam),
        finalExam: toNum(form.finalExam),
      });
      if (result.ok) onClose();
      else setError(result.error);
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  return (
    <Sheet open onOpenChange={(open) => !open && !saving && onClose()}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Entry Score</SheetTitle>
          <SheetDescription>
            {row.studentId} - {row.name}
          </SheetDescription>
        </SheetHeader>
        <div className='flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto px-4'>
          {fields.map((f) => (
            <div key={f.key} className='flex flex-col gap-2'>
              <Label htmlFor={`score-${f.key}`}>{f.label}</Label>
              <Input
                id={`score-${f.key}`}
                inputMode='numeric'
                maxLength={3}
                placeholder='0 - 100'
                value={form[f.key]}
                aria-invalid={outOfRange(form[f.key])}
                onChange={(e) => {
                  setForm((s) => ({ ...s, [f.key]: e.target.value.replace(/\D/g, '') }));
                  setError('');
                }}
              />
              {outOfRange(form[f.key]) && (
                <p className='text-xs text-destructive'>Score must be between 0 and 100.</p>
              )}
            </div>
          ))}
          <p className='text-xs text-muted-foreground'>
            Leave a field empty if the score is not available yet. Clearing all three removes the
            scores of this student.
          </p>
          {error && (
            <p role='alert' className='text-sm text-destructive'>
              {error}
            </p>
          )}
        </div>
        <SheetFooter className='border-t'>
          <Button disabled={!valid || unchanged || saving} onClick={submit}>
            {saving && <Spinner />}
            {saving ? 'Saving...' : 'Save'}
          </Button>
          <Button variant='outline' disabled={saving} onClick={onClose}>
            Cancel
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export function InputScore({ groups }: InputScoreData) {
  const subjectIds = [...new Set(groups.map((g) => g.subjectId))];

  const [pickedSubject, setPickedSubject] = React.useState('');
  const [pickedClass, setPickedClass] = React.useState('');
  const [editing, setEditing] = React.useState<Row | null>(null);

  // pilihan yang tidak valid (mis. setelah ganti pelajaran) otomatis jatuh ke opsi pertama
  const subjectId = subjectIds.includes(pickedSubject) ? pickedSubject : (subjectIds[0] ?? '');
  const classNames = groups.filter((g) => g.subjectId === subjectId).map((g) => g.className);
  const className = classNames.includes(pickedClass) ? pickedClass : (classNames[0] ?? '');
  const group = groups.find((g) => g.subjectId === subjectId && g.className === className);

  if (!group) {
    return (
      <Card>
        <CardContent className='flex h-40 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground'>
          <ClipboardCheckIcon className='size-6' />
          You have no teaching sessions yet, so there are no scores to enter.
        </CardContent>
      </Card>
    );
  }

  const rows: Row[] = group.students.map((s) => ({ ...s, final: finalScore(s, group.weights) }));
  const completed = rows.filter((r) => r.final !== null);
  const classAverage = average(completed.map((r) => r.final as number));
  const passed = completed.filter((r) => (r.final as number) >= PASSING_SCORE).length;

  const subjectItems = subjectIds.map((id) => ({
    value: id,
    label: `${id} - ${groups.find((g) => g.subjectId === id)!.subject}`,
  }));
  const classItems = classNames.map((c) => ({ value: c, label: c }));

  return (
    <div className='flex flex-col gap-4 md:gap-6'>
      <StatCards
        items={[
          {
            label: `Class ${className}`,
            value: rows.length,
            icon: UsersIcon,
            badge: group.subject,
            title: 'Students in this class',
            note: `Subject ${subjectId}`,
          },
          {
            label: 'Scores Completed',
            value: `${completed.length}/${rows.length}`,
            icon: ClipboardCheckIcon,
            badge: rows.length ? `${Math.round((completed.length / rows.length) * 100)}%` : '0%',
            title: `${rows.length - completed.length} students still need scores`,
            note: 'All three scores must be filled',
          },
          {
            label: 'Class Average',
            value: classAverage ?? '-',
            icon: BookOpenCheckIcon,
            badge: `Pass ≥ ${PASSING_SCORE}`,
            title: `${passed} of ${completed.length} students passed`,
            note: 'Based on completed scores only',
          },
        ]}
      />

      <div className='flex flex-col gap-1'>
        <div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
          <div className='flex items-center gap-3'>
            <Label>Subject</Label>
            <Select
              items={subjectItems}
              value={subjectId}
              onValueChange={(v) => v && setPickedSubject(v)}
            >
              <SelectTrigger className='w-56' aria-label='Subject'>
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
          <div className='flex items-center gap-3'>
            <Label>Class Name</Label>
            <Select
              items={classItems}
              value={className}
              onValueChange={(v) => v && setPickedClass(v)}
            >
              <SelectTrigger className='w-36' aria-label='Class name'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {classItems.map((i) => (
                  <SelectItem key={i.value} value={i.value}>
                    {i.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <p className='text-sm text-muted-foreground'>
          Assignment: {group.weights.assignment}%, Mid Exam: {group.weights.midExam}%, Final Exam:{' '}
          {group.weights.finalExam}%
        </p>
      </div>

      <SimpleDataTable
        data={rows}
        columns={columns}
        getRowId={(r) => r.studentId}
        searchText={(r) => `${r.studentId} ${r.name}`}
        onEdit={setEditing}
        editLabel='Entry Score'
      />

      {editing && (
        <EntryScoreSheet
          key={`${className}|${subjectId}|${editing.studentId}`}
          row={editing}
          onClose={() => setEditing(null)}
          onSave={(s) => saveScore({ className, subjectId, studentId: editing.studentId, ...s })}
        />
      )}
    </div>
  );
}
