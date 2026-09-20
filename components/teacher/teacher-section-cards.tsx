'use client';

import { Badge } from '@/components/ui/badge';
import { Card, CardAction, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { teacherStats } from '@/lib/dummy-data/teacher';
import { BookOpenIcon, UsersIcon, CalendarClockIcon, ClipboardListIcon } from 'lucide-react';

export function TeacherSectionCards() {
  return (
    <div className='grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Kelas Diampu</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {teacherStats.classesTaught}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <BookOpenIcon />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 font-medium'>Semester ganjil 2026/2027</div>
          <div className='text-muted-foreground'>Jurusan Rekayasa Perangkat Lunak</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Total Siswa Diajar</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {teacherStats.totalStudents}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <UsersIcon />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 font-medium'>Dari 4 kelas berbeda</div>
          <div className='text-muted-foreground'>Rata-rata 32 siswa/kelas</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Jadwal Mengajar Hari Ini</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {teacherStats.todayClasses}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <CalendarClockIcon />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 font-medium'>Mulai 07.00</div>
          <div className='text-muted-foreground'>Lihat detail di jadwal mengajar</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Nilai Belum Diinput</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {teacherStats.pendingScores}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <ClipboardListIcon />
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 font-medium'>Perlu segera dilengkapi</div>
          <div className='text-muted-foreground'>Tersebar di 2 kelas</div>
        </CardFooter>
      </Card>
    </div>
  );
}
