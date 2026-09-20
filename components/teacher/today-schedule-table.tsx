'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { todaySchedule } from '@/lib/dummy-data/teacher';

export function TodayScheduleTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Jadwal Mengajar Hari Ini</CardTitle>
        <CardDescription>Senin, sesuai jadwal semester berjalan</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Jam</TableHead>
              <TableHead>Kelas</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead className='text-right'>Ruang</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {todaySchedule.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.time}</TableCell>
                <TableCell>{item.className}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell className='text-right text-muted-foreground'>{item.room}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
