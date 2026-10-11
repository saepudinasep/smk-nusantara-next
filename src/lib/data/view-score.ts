import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import type { ViewScoreData, ViewScoreRow } from '@/lib/score-types';
import { ONLY_FINALIZED } from '@/lib/schedule-visibility';

/**
 * Nilai milik siswa yang SEDANG LOGIN. Tanpa parameter: identitas dari sesi, jadi siswa tidak
 * bisa melihat nilai siswa lain. Menampilkan semua mata pelajaran kelasnya, termasuk yang
 * belum ada nilainya.
 */
export async function getViewScoreData(): Promise<ViewScoreData> {
  const user = await requireRole('student');

  const student = await prisma.student.findUnique({
    where: { userId: user.id },
    select: {
      id: true,
      studentCode: true,
      name: true,
      class: { select: { classId: true, class: { select: { name: true } } } },
    },
  });

  const who = {
    studentId: student?.studentCode ?? user.username,
    name: student?.name ?? user.name ?? user.username,
  };
  if (!student?.class) return { student: who, className: null, rows: [] };

  const sessions = await prisma.detailSchedule.findMany({
    where: {
      schedule: { classId: student.class.classId, ...(ONLY_FINALIZED ? { finalized: true } : {}) },
    },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      subject: {
        select: { code: true, name: true, assignment: true, midExam: true, finalExam: true },
      },
    },
  });

  const scores = sessions.length
    ? await prisma.detailScore.findMany({
        where: { studentId: student.id, detailId: { in: sessions.map((s) => s.id) } },
        select: { detailId: true, assignment: true, midExam: true, finalExam: true },
      })
    : [];

  // satu baris per mata pelajaran (sebuah pelajaran bisa punya beberapa sesi per minggu)
  const filled = (s: {
    assignment: number | null;
    midExam: number | null;
    finalExam: number | null;
  }) => [s.assignment, s.midExam, s.finalExam].filter((v) => v !== null).length;
  const bySubject = new Map<string, ViewScoreRow>();
  for (const s of sessions) {
    const sc = scores.filter((x) => x.detailId === s.id).sort((a, b) => filled(b) - filled(a))[0];
    const existing = bySubject.get(s.subject.code);
    const next: ViewScoreRow = {
      subjectId: s.subject.code,
      subject: s.subject.name,
      weights: {
        assignment: s.subject.assignment,
        midExam: s.subject.midExam,
        finalExam: s.subject.finalExam,
      },
      assignment: sc?.assignment ?? null,
      midExam: sc?.midExam ?? null,
      finalExam: sc?.finalExam ?? null,
    };
    if (!existing || filled(next) > filled(existing)) bySubject.set(s.subject.code, next);
  }

  const rows = [...bySubject.values()].sort((a, b) => a.subjectId.localeCompare(b.subjectId));
  return { student: who, className: student.class.class.name, rows };
}
