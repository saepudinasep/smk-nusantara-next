'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { myClasses } from '@/lib/dummy-data/teacher';
import { cn } from 'cn';

export function MyClassesTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Kelas yang Diampu</CardTitle>
        <CardDescription>Progres input nilai per kelas</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Kelas</TableHead>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Mahasiswa</TableHead>
              <TableHead className='text-right'>Progres Nilai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {myClasses.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.className}</TableCell>
                <TableCell>{item.subject}</TableCell>
                <TableCell>{item.students}</TableCell>
                <TableCell>
                  <div className='ml-auto flex w-full max-w-32 items-center gap-2'>
                    <div className='h-2 flex-1 overflow-hidden rounded-full bg-muted'>
                      <div
                        className={cn(
                          'h-full rounded-full',
                          item.scoreInputProgress === 100 ? 'bg-emerald-500' : 'bg-primary',
                        )}
                        style={{ width: `${item.scoreInputProgress}%` }}
                      />
                    </div>
                    <span className='w-9 text-right text-xs text-muted-foreground tabular-nums'>
                      {item.scoreInputProgress}%
                    </span>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
