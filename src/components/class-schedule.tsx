'use client';

import * as React from 'react';
import { CalendarCheckIcon, CalendarDaysIcon, UserRoundCheckIcon } from 'lucide-react';

import { SimpleDataTable, type Column } from '@/components/simple-data-table';
import { StatCards } from '@/components/stat-cards';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DAYS,
  GRADE_LABEL,
  type ClassScheduleData,
  type StudentSession,
} from '@/lib/schedule-types';

const ALL = 'all';

const columns: Column<StudentSession>[] = [
  { header: 'Subject ID', cell: (r) => r.subjectId },
  { header: 'Subject', cell: (r) => r.subject, className: 'font-medium' },
  { header: 'Day', cell: (r) => r.day },
  { header: 'Time', cell: (r) => r.time, className: 'tabular-nums' },
  { header: 'Teacher Name', cell: (r) => r.teacher },
];

export function ClassSchedule({
  student,
  className,
  grade,
  finalized,
  sessions,
}: ClassScheduleData) {
  const [day, setDay] = React.useState<string>(ALL);

  if (!className || grade === null) {
    return (
      <Card>
        <CardContent className='flex h-40 flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground'>
          <CalendarDaysIcon className='size-6' />
          You are not assigned to a class yet, so there is no schedule to show. Please contact the
          administrator.
        </CardContent>
      </Card>
    );
  }

  const rows = day === ALL ? sessions : sessions.filter((r) => r.day === day);
  const teachersCount = new Set(sessions.map((r) => r.teacher)).size;
  const dayItems = [
    { value: ALL, label: 'All days' },
    ...DAYS.map((d) => ({ value: d, label: d })),
  ];

  return (
    <div className='flex flex-col gap-4 md:gap-6'>
      <StatCards
        items={[
          {
            label: `Class ${className}`,
            value: sessions.length,
            icon: CalendarDaysIcon,
            badge: finalized ? 'Finalized' : 'Draft',
            title: 'Sessions this week',
            note: `Grade ${GRADE_LABEL[grade]}`,
          },
          {
            label: day === ALL ? 'Sessions Shown' : `Sessions on ${day}`,
            value: rows.length,
            icon: CalendarCheckIcon,
            badge: day === ALL ? 'All days' : day.slice(0, 3),
            title: 'Matching the day filter',
            note: `${sessions.length - rows.length} sessions on other days`,
          },
          {
            label: 'Teachers',
            value: teachersCount,
            icon: UserRoundCheckIcon,
            badge: className,
            title: 'Teachers teaching this class',
            note: 'Across all days of the week',
          },
        ]}
      />

      <div className='flex flex-wrap items-center gap-x-6 gap-y-3'>
        <p className='text-sm text-muted-foreground'>
          <span className='font-medium text-foreground'>{student.name}</span> · Class {className} ·
          Grade {GRADE_LABEL[grade]}
        </p>
        <div className='flex items-center gap-3'>
          <Label>Day</Label>
          <Select items={dayItems} value={day} onValueChange={(v) => v && setDay(v)}>
            <SelectTrigger className='w-40' aria-label='Day'>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {dayItems.map((i) => (
                <SelectItem key={i.value} value={i.value}>
                  {i.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        {!finalized && <Badge variant='outline'>Draft — this schedule may still change</Badge>}
      </div>

      <SimpleDataTable data={rows} columns={columns} getRowId={(r) => r.id} />
    </div>
  );
}
