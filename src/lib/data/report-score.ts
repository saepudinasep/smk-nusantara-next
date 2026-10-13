import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { computeReport, type ScoreRecord } from '@/lib/report';
import type { ReportScoreData } from '@/lib/report-types';

/** Mengambil bahan laporan nilai. TIDAK memeriksa hak akses: pemanggil wajib memanggil requireRole. */
export async function fetchReportInputs() {
  const [classes, subjects, scores] = await Promise.all([
    prisma.class.findMany({
      select: { name: true, grade: true, _count: { select: { students: true } } },
    }),
    prisma.subject.findMany({ select: { name: true, grade: true } }),
    prisma.detailScore.findMany({
      select: {
        studentId: true,
        assignment: true,
        midExam: true,
        finalExam: true,
        detail: {
          select: {
            subject: { select: { name: true, assignment: true, midExam: true, finalExam: true } },
            schedule: { select: { class: { select: { name: true } } } },
          },
        },
      },
    }),
  ]);

  const records: ScoreRecord[] = scores.map((s) => ({
    studentId: s.studentId,
    className: s.detail.schedule.class.name,
    subjectName: s.detail.subject.name,
    assignment: s.assignment,
    midExam: s.midExam,
    finalExam: s.finalExam,
    weights: {
      assignment: s.detail.subject.assignment,
      midExam: s.detail.subject.midExam,
      finalExam: s.detail.subject.finalExam,
    },
  }));

  return {
    classes: classes.map((c) => ({
      className: c.name,
      grade: c.grade,
      students: c._count.students,
    })),
    subjects,
    scores: records,
  };
}

export async function getReportScoreData(): Promise<ReportScoreData> {
  await requireRole('admin');
  return computeReport(await fetchReportInputs());
}
