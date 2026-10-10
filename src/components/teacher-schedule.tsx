'use client';

import * as React from 'react';
import { CalendarDaysIcon, SchoolIcon, UsersIcon } from 'lucide-react';

import { SimpleDataTable, type Column } from '@/components/simple-data-table';
import { StatCards } from '@/components/stat-cards';
import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import type { ClassStudent, TeacherScheduleData } from '@/lib/schedule-types';

const studentColumns: Column<ClassStudent>[] = [
  { header: 'Student ID', cell: (s) => s.studentId },
  { header: 'Student Name', cell: (s) => s.name, className: 'font-medium' },
  { header: 'Gender', cell: (s) => s.gender },
];

export function TeacherSchedule({ teacher, sessions, studentsByClass }: TeacherScheduleData) {
  const [selectedId, setSelectedId] = React.useState<string | null>(null);

  // baris terpilih; kalau belum ada otomatis baris pertama
  const selected = sessions.find((r) => r.id === selectedId) ?? sessions[0];
  const classStudents = selected ? (studentsByClass[selected.className] ?? []) : [];

  const classNames = [...new Set(sessions.map((r) => r.className))];
  const taughtStudents = new Set(
    classNames.flatMap((c) => (studentsByClass[c] ?? []).map((s) => s.studentId)),
  ).size;
  const activeDays = new Set(sessions.map((r) => r.day)).size;
  const draftClasses = [...new Set(sessions.filter((r) => !r.finalized).map((r) => r.className))];

  return (
    <div className='flex flex-col gap-4 md:gap-6'>
      <StatCards
        items={[
          {
            label: 'Teaching Sessions',
            value: sessions.length,
            icon: CalendarDaysIcon,
            badge: `${activeDays} ${activeDays === 1 ? 'day' : 'days'}`,
            title: 'Sessions this week',
            note: 'Click a row to see the class students',
          },
          {
            label: 'Classes Taught',
            value: classNames.length,
            icon: SchoolIcon,
            badge: classNames.join(', ') || '-',
            title: 'Classes with a session',
            note: 'Across grade X, XI and XII',
          },
          {
            label: 'Students Taught',
            value: taughtStudents,
            icon: UsersIcon,
            badge: `${classNames.length} classes`,
            title: 'Students in those classes',
            note: 'Each student counted once',
          },
        ]}
      />

      <p className='text-sm text-muted-foreground'>
        Schedule for <span className='font-medium text-foreground'>{teacher.name}</span> (
        {teacher.teacherId})
        {draftClasses.length > 0 &&
          ` · Draft schedule for ${draftClasses.join(', ')} may still change`}
      </p>

      <Card>
        <CardHeader>
          <CardTitle>Teaching Schedule</CardTitle>
          <CardDescription>Select a row to show the student list of that class</CardDescription>
        </CardHeader>
        <CardContent>
          <div className='overflow-hidden rounded-lg border'>
            <Table>
              <TableHeader className='bg-muted'>
                <TableRow>
                  <TableHead>Subject ID</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Class Name</TableHead>
                  <TableHead>Day</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sessions.map((r) => {
                  const active = selected?.id === r.id;
                  return (
                    <TableRow
                      key={r.id}
                      tabIndex={0}
                      aria-selected={active}
                      data-state={active ? 'selected' : undefined}
                      className='cursor-pointer'
                      onClick={() => setSelectedId(r.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setSelectedId(r.id);
                        }
                      }}
                    >
                      <TableCell>{r.subjectId}</TableCell>
                      <TableCell className='font-medium'>{r.subject}</TableCell>
                      <TableCell>{r.className}</TableCell>
                      <TableCell>{r.day}</TableCell>
                      <TableCell className='tabular-nums'>{r.time}</TableCell>
                      <TableCell>
                        <Badge variant={r.finalized ? 'default' : 'outline'}>
                          {r.finalized ? 'Finalized' : 'Draft'}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
                {sessions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                      You have no teaching schedule yet.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Student List</CardTitle>
          <CardDescription>
            {selected
              ? `Class ${selected.className} · ${selected.subject}, ${selected.day} ${selected.time}`
              : 'No class selected'}
          </CardDescription>
          <CardAction>
            <Badge variant='outline'>{classStudents.length} students</Badge>
          </CardAction>
        </CardHeader>
        <CardContent>
          <SimpleDataTable
            key={selected?.className ?? 'none'}
            data={classStudents}
            columns={studentColumns}
            getRowId={(s) => s.studentId}
            searchText={(s) => `${s.studentId} ${s.name}`}
          />
        </CardContent>
      </Card>
    </div>
  );
}
