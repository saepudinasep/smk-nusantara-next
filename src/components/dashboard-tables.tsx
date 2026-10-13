'use client';

import * as React from 'react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { DashboardStudent, DashboardTeacher } from '@/lib/report-types';
import { DAYS, type ScheduleBundle } from '@/lib/schedule-types';
import { PASSING_SCORE } from '@/lib/scoring';

const show = (n: number | null) => (n === null ? '-' : n);

function ScheduleTable({ schedule }: { schedule: ScheduleBundle }) {
  const [picked, setPicked] = React.useState('');
  const className = schedule.classes.some((c) => c.className === picked)
    ? picked
    : (schedule.classes[0]?.className ?? '');
  const room = schedule.classes.find((c) => c.className === className);

  const rows = schedule.sessions
    .filter((s) => s.className === className)
    .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.shiftId - b.shiftId);
  const items = schedule.classes.map((c) => ({ value: c.className, label: c.className }));

  return (
    <div className='flex flex-col gap-3'>
      <div className='flex items-center gap-2'>
        <Select items={items} value={className} onValueChange={(v) => v && setPicked(v)}>
          <SelectTrigger size='sm' className='w-32' aria-label='Select class'>
            <SelectValue placeholder='Class' />
          </SelectTrigger>
          <SelectContent>
            {items.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {room && (
          <Badge variant={room.finalized ? 'default' : 'outline'}>
            {room.finalized ? 'Finalized' : 'Draft'}
          </Badge>
        )}
      </div>
      <div className='overflow-hidden rounded-lg border'>
        <Table>
          <TableHeader className='bg-muted'>
            <TableRow>
              <TableHead>Day</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Subject ID</TableHead>
              <TableHead>Subject</TableHead>
              <TableHead>Teacher</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {rows.map((r) => (
              <TableRow key={r.id}>
                <TableCell>{r.day}</TableCell>
                <TableCell className='tabular-nums'>
                  {schedule.shifts.find((s) => s.shiftId === r.shiftId)?.time ?? '-'}
                </TableCell>
                <TableCell>{r.subjectId}</TableCell>
                <TableCell>
                  {schedule.subjects.find((s) => s.subjectId === r.subjectId)?.name ?? r.subjectId}
                </TableCell>
                <TableCell>
                  {r.teacherId} - {schedule.teachers.find((t) => t.teacherId === r.teacherId)?.name}
                </TableCell>
              </TableRow>
            ))}
            {rows.length === 0 && (
              <TableRow>
                <TableCell colSpan={5} className='h-24 text-center text-muted-foreground'>
                  No sessions scheduled for this class.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function ScoreTable({ students }: { students: DashboardStudent[] }) {
  return (
    <div className='overflow-hidden rounded-lg border'>
      <Table>
        <TableHeader className='bg-muted'>
          <TableRow>
            <TableHead>Student ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Class</TableHead>
            <TableHead className='text-right'>Assignment</TableHead>
            <TableHead className='text-right'>Mid Exam</TableHead>
            <TableHead className='text-right'>Final Exam</TableHead>
            <TableHead className='text-right'>Final</TableHead>
            <TableHead>Status</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {students.map((r) => (
            <TableRow key={r.studentId}>
              <TableCell>{r.studentId}</TableCell>
              <TableCell className='font-medium'>{r.name}</TableCell>
              <TableCell>{r.className}</TableCell>
              <TableCell className='text-right tabular-nums'>{show(r.assignment)}</TableCell>
              <TableCell className='text-right tabular-nums'>{show(r.midExam)}</TableCell>
              <TableCell className='text-right tabular-nums'>{show(r.finalExam)}</TableCell>
              <TableCell className='text-right font-medium tabular-nums'>{show(r.final)}</TableCell>
              <TableCell>
                {r.final === null ? (
                  <Badge variant='outline'>No scores</Badge>
                ) : (
                  <Badge variant={r.final >= PASSING_SCORE ? 'default' : 'destructive'}>
                    {r.final >= PASSING_SCORE ? 'Passed' : 'Not passed'}
                  </Badge>
                )}
              </TableCell>
            </TableRow>
          ))}
          {students.length === 0 && (
            <TableRow>
              <TableCell colSpan={8} className='h-24 text-center text-muted-foreground'>
                No students are assigned to a class yet.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

function TeacherTable({ teachers }: { teachers: DashboardTeacher[] }) {
  return (
    <div className='overflow-hidden rounded-lg border'>
      <Table>
        <TableHeader className='bg-muted'>
          <TableRow>
            <TableHead>Teacher ID</TableHead>
            <TableHead>Name</TableHead>
            <TableHead>Gender</TableHead>
            <TableHead>Phone</TableHead>
            <TableHead>Expertise</TableHead>
            <TableHead className='text-right'>Sessions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {teachers.map((t) => (
            <TableRow key={t.teacherId}>
              <TableCell>{t.teacherId}</TableCell>
              <TableCell className='font-medium'>{t.name}</TableCell>
              <TableCell>{t.gender}</TableCell>
              <TableCell className='tabular-nums'>{t.phoneNumber}</TableCell>
              <TableCell>
                <div className='flex flex-wrap gap-1'>
                  {t.subjects.map((s) => (
                    <Badge key={s} variant='outline'>
                      {s}
                    </Badge>
                  ))}
                </div>
              </TableCell>
              <TableCell className='text-right tabular-nums'>{t.sessions}</TableCell>
            </TableRow>
          ))}
          {teachers.length === 0 && (
            <TableRow>
              <TableCell colSpan={6} className='h-24 text-center text-muted-foreground'>
                No teachers found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}

export function DashboardTables({
  schedule,
  students,
  teachers,
}: {
  schedule: ScheduleBundle;
  students: DashboardStudent[];
  teachers: DashboardTeacher[];
}) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>School Data</CardTitle>
        <CardDescription>Class schedule, student scores, and teachers</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue='schedule'>
          <TabsList>
            <TabsTrigger value='schedule'>Class Schedule</TabsTrigger>
            <TabsTrigger value='scores'>Student Scores</TabsTrigger>
            <TabsTrigger value='teachers'>Teachers</TabsTrigger>
          </TabsList>
          <TabsContent value='schedule'>
            <ScheduleTable schedule={schedule} />
          </TabsContent>
          <TabsContent value='scores'>
            <ScoreTable students={students} />
          </TabsContent>
          <TabsContent value='teachers'>
            <TeacherTable teachers={teachers} />
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
}
