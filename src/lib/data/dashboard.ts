import { requireRole } from '@/lib/auth-guard';
import { genderToUi } from '@/lib/mappers';
import { prisma } from '@/lib/prisma';
import { computeReport, overallStats, summarizeStudents } from '@/lib/report';
import type { DashboardData, DayLoad } from '@/lib/report-types';
import { DAYS } from '@/lib/schedule-types';
import { fetchReportInputs } from '@/lib/data/report-score';
import { getScheduleBundle } from '@/lib/data/schedules';

export async function getDashboardData(): Promise<DashboardData> {
  await requireRole('admin');

  const [bundle, inputs, studentRows, maleCount, teacherRows] = await Promise.all([
    getScheduleBundle(),
    fetchReportInputs(),
    prisma.student.findMany({
      select: {
        id: true,
        studentCode: true,
        name: true,
        class: { select: { class: { select: { name: true } } } },
      },
    }),
    prisma.student.count({ where: { gender: 'male' } }),
    prisma.teacher.findMany({
      orderBy: { teacherCode: 'asc' },
      select: {
        teacherCode: true,
        name: true,
        gender: true,
        phoneNumber: true,
        expertise: { select: { subject: { select: { name: true } } } },
        _count: { select: { schedules: true } },
      },
    }),
  ]);

  const report = computeReport(inputs);
  const overall = overallStats(report);

  const finalizedClasses = new Set(
    bundle.classes.filter((c) => c.finalized).map((c) => c.className),
  );
  const load: DayLoad[] = DAYS.map((day) => {
    const list = bundle.sessions.filter((s) => s.day === day);
    const finalized = list.filter((s) => finalizedClasses.has(s.className)).length;
    return { day: day.slice(0, 3), finalized, draft: list.length - finalized };
  });

  const students = summarizeStudents(
    studentRows.flatMap((s) =>
      s.class
        ? [{ id: s.id, studentCode: s.studentCode, name: s.name, className: s.class.class.name }]
        : [],
    ),
    inputs.scores,
  );

  return {
    stats: {
      students: studentRows.length,
      male: maleCount,
      female: studentRows.length - maleCount,
      teachers: teacherRows.length,
      classes: bundle.classes.length,
      grades: new Set(bundle.classes.map((c) => c.grade)).size,
      subjects: bundle.subjects.length,
      finalized: finalizedClasses.size,
      schedules: bundle.classes.length,
      avgFinal: overall.avgFinal,
      passRate: overall.passRate,
    },
    report,
    load,
    schedule: bundle,
    students,
    teachers: teacherRows.map((t) => ({
      teacherId: t.teacherCode,
      name: t.name,
      gender: genderToUi(t.gender),
      phoneNumber: t.phoneNumber ?? '',
      subjects: [...new Set(t.expertise.map((e) => e.subject.name))].sort(),
      sessions: t._count.schedules,
    })),
  };
}
