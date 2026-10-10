import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { DAYS, type ClassScheduleData } from '@/lib/schedule-types';
import { ONLY_FINALIZED } from '@/lib/schedule-visibility';

/**
 * Jadwal kelas milik siswa yang SEDANG LOGIN. Tidak menerima parameter apa pun:
 * kelas ditentukan dari sesi, jadi siswa tidak bisa membuka jadwal kelas lain.
 */
export async function getClassScheduleData(): Promise<ClassScheduleData> {
  const user = await requireRole('student');

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: {
      studentCode: true,
      name: true,
      class: {
        select: {
          class: {
            select: {
              id: true,
              name: true,
              grade: true,
              schedule: { select: { finalized: true } },
            },
          },
        },
      },
    },
  });

  const who = {
    studentId: student?.studentCode ?? user.username,
    name: student?.name ?? user.name ?? user.username,
  };
  const cls = student?.class?.class;
  if (!cls) return { student: who, className: null, grade: null, finalized: false, sessions: [] };

  const finalized = cls.schedule?.finalized ?? false;
  const details =
    ONLY_FINALIZED && !finalized
      ? []
      : await prisma.detailSchedule.findMany({
          where: { schedule: { classId: cls.id } },
          select: {
            id: true,
            day: true,
            subject: { select: { code: true, name: true } },
            teacher: { select: { name: true } },
            shift: { select: { number: true, time: true } },
          },
        });

  const sessions = details
    .map((d) => ({
      id: d.id,
      subjectId: d.subject.code,
      subject: d.subject.name,
      teacher: d.teacher.name,
      day: d.day,
      shiftId: d.shift.number,
      time: d.shift.time,
    }))
    .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.shiftId - b.shiftId);

  return { student: who, className: cls.name, grade: cls.grade, finalized, sessions };
}
