import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { DAYS, type ClassStudent, type TeacherScheduleData } from '@/lib/schedule-types';
import { ONLY_FINALIZED } from '@/lib/schedule-visibility';
import { genderToUi } from '@/lib/mappers';

/**
 * Jadwal mengajar milik guru yang SEDANG LOGIN. Tidak menerima parameter apa pun:
 * identitas diambil dari sesi, jadi guru tidak bisa melihat jadwal guru lain.
 */
export async function getTeacherScheduleData(): Promise<TeacherScheduleData> {
  const user = await requireRole('teacher');

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    select: { id: true, teacherCode: true, name: true },
  });
  if (!teacher) {
    return {
      teacher: { teacherId: user.username, name: user.name ?? user.username },
      sessions: [],
      studentsByClass: {},
    };
  }

  const details = await prisma.detailSchedule.findMany({
    where: { teacherId: teacher.id, ...(ONLY_FINALIZED ? { schedule: { finalized: true } } : {}) },
    select: {
      id: true,
      day: true,
      subject: { select: { code: true, name: true } },
      shift: { select: { number: true, time: true } },
      schedule: { select: { finalized: true, class: { select: { name: true } } } },
    },
  });

  const sessions = details
    .map((d) => ({
      id: d.id,
      subjectId: d.subject.code,
      subject: d.subject.name,
      className: d.schedule.class.name,
      day: d.day,
      shiftId: d.shift.number,
      time: d.shift.time,
      finalized: d.schedule.finalized,
    }))
    .sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.shiftId - b.shiftId);

  // daftar siswa HANYA untuk kelas yang diajar guru ini, dan hanya kode, nama, dan jenis kelamin
  const classNames = [...new Set(sessions.map((s) => s.className))];
  const members = classNames.length
    ? await prisma.detailClass.findMany({
        where: { class: { name: { in: classNames } } },
        select: {
          class: { select: { name: true } },
          student: { select: { studentCode: true, name: true, gender: true } },
        },
      })
    : [];

  const studentsByClass: Record<string, ClassStudent[]> = Object.fromEntries(
    classNames.map((n) => [n, []]),
  );
  for (const m of members) {
    studentsByClass[m.class.name]?.push({
      studentId: m.student.studentCode,
      name: m.student.name,
      gender: genderToUi(m.student.gender),
    });
  }
  for (const list of Object.values(studentsByClass)) {
    list.sort((a, b) => a.studentId.localeCompare(b.studentId));
  }

  return {
    teacher: { teacherId: teacher.teacherCode, name: teacher.name },
    sessions,
    studentsByClass,
  };
}
