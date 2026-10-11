import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import type { InputScoreData, ScoreGroup } from '@/lib/score-types';
import { ONLY_FINALIZED } from '@/lib/schedule-visibility';

/**
 * Pelajaran + kelas yang diajar guru yang SEDANG LOGIN, beserta siswa dan nilainya.
 * Tanpa parameter: identitas dari sesi. Nilai disimpan pada satu sesi "kanonik" per
 * (kelas, pelajaran, guru), yaitu sesi pertama menurut urutan pembuatan (id naik).
 */
export async function getInputScoreData(): Promise<InputScoreData> {
  const user = await requireRole('teacher');

  const teacher = await prisma.teacher.findUnique({
    where: { userId: user.id },
    select: { id: true, teacherCode: true, name: true },
  });
  if (!teacher) {
    return { teacher: { teacherId: user.username, name: user.name ?? user.username }, groups: [] };
  }

  const sessions = await prisma.detailSchedule.findMany({
    where: { teacherId: teacher.id, ...(ONLY_FINALIZED ? { schedule: { finalized: true } } : {}) },
    orderBy: { id: 'asc' },
    select: {
      id: true,
      subject: {
        select: { code: true, name: true, assignment: true, midExam: true, finalExam: true },
      },
      schedule: { select: { classId: true, class: { select: { name: true } } } },
    },
  });

  // satu grup per (kelas, pelajaran); sesi pertama = kanonik
  const canonical = new Map<string, (typeof sessions)[number]>();
  for (const s of sessions) {
    const key = `${s.schedule.class.name}|${s.subject.code}`;
    if (!canonical.has(key)) canonical.set(key, s);
  }
  const picked = [...canonical.values()];
  if (picked.length === 0)
    return { teacher: { teacherId: teacher.teacherCode, name: teacher.name }, groups: [] };

  const [members, scores] = await Promise.all([
    prisma.detailClass.findMany({
      where: { classId: { in: [...new Set(picked.map((p) => p.schedule.classId))] } },
      select: { classId: true, student: { select: { id: true, studentCode: true, name: true } } },
    }),
    prisma.detailScore.findMany({
      where: { detailId: { in: picked.map((p) => p.id) } },
      select: { detailId: true, studentId: true, assignment: true, midExam: true, finalExam: true },
    }),
  ]);

  const scoreOf = new Map(scores.map((s) => [`${s.detailId}|${s.studentId}`, s]));

  const groups: ScoreGroup[] = picked.map((p) => ({
    subjectId: p.subject.code,
    subject: p.subject.name,
    className: p.schedule.class.name,
    weights: {
      assignment: p.subject.assignment,
      midExam: p.subject.midExam,
      finalExam: p.subject.finalExam,
    },
    students: members
      .filter((m) => m.classId === p.schedule.classId)
      .map((m) => {
        const sc = scoreOf.get(`${p.id}|${m.student.id}`);
        return {
          studentId: m.student.studentCode,
          name: m.student.name,
          assignment: sc?.assignment ?? null,
          midExam: sc?.midExam ?? null,
          finalExam: sc?.finalExam ?? null,
        };
      })
      .sort((a, b) => a.studentId.localeCompare(b.studentId)),
  }));
  groups.sort(
    (a, b) => a.className.localeCompare(b.className) || a.subjectId.localeCompare(b.subjectId),
  );

  return { teacher: { teacherId: teacher.teacherCode, name: teacher.name }, groups };
}
