'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { studentStats } from '@/lib/dummy-data/student';
import { TrendingUpIcon, TrendingDownIcon, CalendarCheckIcon, LayersIcon } from 'lucide-react';

export function StudentSectionCards() {
  return (
    <div className='grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Rata-rata Nilai</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {studentStats.averageScore}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingUpIcon />
              {studentStats.averageScoreDelta}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex items-center gap-2 font-medium'>
            Naik dibanding bulan lalu <TrendingUpIcon className='size-4' />
          </div>
          <div className='text-muted-foreground'>Semester ganjil 2026/2027</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Kehadiran</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {studentStats.attendanceRate}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingDownIcon />
              {studentStats.attendanceDelta}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex items-center gap-2 font-medium'>
            Sedikit menurun bulan ini <TrendingDownIcon className='size-4' />
          </div>
          <div className='text-muted-foreground'>1 hari izin, 0 alpa</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Kelas</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {studentStats.className}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <LayersIcon />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 font-medium'>Rekayasa Perangkat Lunak</div>
          <div className='text-muted-foreground'>Wali kelas: Budi Santoso, S.Pd</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Jadwal Hari Ini</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {studentStats.todayClasses} mapel
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <CalendarCheckIcon />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 font-medium'>Mulai 07.00</div>
          <div className='text-muted-foreground'>Lihat detail di jadwal kelas</div>
        </CardFooter>
      </Card>
    </div>
  );
}
