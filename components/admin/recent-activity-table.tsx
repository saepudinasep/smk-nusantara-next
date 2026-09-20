'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { recentActivity } from '@/lib/dummy-data/admin';

export function RecentActivityTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Aktivitas Terbaru</CardTitle>
        <CardDescription>Ringkasan aksi terbaru dari admin dan guru</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Aktivitas</TableHead>
              <TableHead>Oleh</TableHead>
              <TableHead>Waktu</TableHead>
              <TableHead className='text-right'>Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentActivity.map((item) => (
              <TableRow key={item.id}>
                <TableCell className='max-w-[320px]'>{item.activity}</TableCell>
                <TableCell>
                  <span className='block font-medium'>{item.user}</span>
                  <span className='text-xs text-muted-foreground'>{item.role}</span>
                </TableCell>
                <TableCell className='text-muted-foreground'>{item.time}</TableCell>
                <TableCell className='text-right'>
                  <Badge variant={item.status === 'Selesai' ? 'default' : 'outline'}>
                    {item.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}
