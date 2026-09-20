'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { todaySchedule } from '@/lib/dummy-data/student';

export function StudentTodayScheduleTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jadwal Hari Ini</CardTitle>
        <CardDescription>Senin, sesuai jadwal kelas XII RPL 1</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jam</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Guru</TableHead>
              <TableHead className='text-right'>Ruang</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todaySchedule.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.time}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell className='text-muted-foreground'>{item.teacher}</TableCell>
                <TableCell className='text-right text-muted-foreground'>{item.room}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
