'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { recentScores } from '@/lib/dummy-data/student';

export function RecentScoresTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Nilai Terbaru</CardTitle>
        <CardDescription>5 nilai terakhir yang diinput guru</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mata Pelajaran</TableHead>
              <TableHead>Jenis</TableHead>
              <TableHead>Tanggal</TableHead>
              <TableHead className='text-right'>Nilai</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentScores.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='font-medium'>{item.subject}</TableCell>
                <TableCell className='text-muted-foreground'>{item.type}</TableCell>
                <TableCell className='text-muted-foreground'>{item.date}</TableCell>
                <TableCell className='text-right'>
                  <Badge variant={item.score >= 85 ? 'default' : 'outline'}>{item.score}</Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
