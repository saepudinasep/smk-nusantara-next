'use client';

import { Badge } from '@/components/ui/badge';
import {
  Card,
  CardAction,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { adminStats } from '@/lib/dummy-data/admin';
import {
  GraduationCapIcon,
  UsersIcon,
  BookOpenIcon,
  ClockAlertIcon,
  TrendingUpIcon,
} from 'lucide-react';

export function AdminSectionCards() {
  return (
    <div className='grid grid-cols-1 gap-4 px-4 *:data-[slot=card]:bg-linear-to-t *:data-[slot=card]:from-primary/5 *:data-[slot=card]:to-card *:data-[slot=card]:shadow-xs lg:px-6 @xl/main:grid-cols-2 @5xl/main:grid-cols-4 dark:*:data-[slot=card]:bg-card'>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Jumlah Mahasiswa</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {adminStats.totalStudents}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingUpIcon />
              {adminStats.totalStudentsDelta}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex items-center gap-2 font-medium'>
            <GraduationCapIcon className='size-4' /> Terdaftar aktif tahun ajaran ini
          </div>
          <div className='text-muted-foreground'>Naik dibanding semester lalu</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Jumlah Dosen</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {adminStats.totalTeachers}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>
              <TrendingUpIcon />
              {adminStats.totalTeachersDelta}
            </Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex items-center gap-2 font-medium'>
            <UsersIcon className='size-4' /> Tenaga pengajar aktif
          </div>
          <div className='text-muted-foreground'>1 guru baru bulan ini</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Jumlah Prodi</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {adminStats.totalClasses}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>{adminStats.totalClassesDelta}</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex items-center gap-2 font-medium'>
            <BookOpenIcon className='size-4' /> Tersebar di 6 jurusan
          </div>
          <div className='text-muted-foreground'>Tidak ada perubahan</div>
        </CardFooter>
      </Card>
      <Card className='@container/card'>
        <CardHeader>
          <CardDescription>Jumlah Fakultas</CardDescription>
          <CardTitle className='text-2xl font-semibold tabular-nums @[250px]/card:text-3xl'>
            {adminStats.pendingSchedules}
          </CardTitle>
          <CardAction>
            <Badge variant='outline'>{adminStats.pendingSchedulesDelta}</Badge>
          </CardAction>
        </CardHeader>
        <CardFooter className='flex-col items-start gap-1.5 text-sm'>
          <div className='line-clamp-1 flex items-center gap-2 font-medium'>
            <ClockAlertIcon className='size-4' /> Perlu persetujuan admin
          </div>
          <div className='text-muted-foreground'>Turun dari minggu lalu</div>
        </CardFooter>
      </Card>
    </div>
  );
}
