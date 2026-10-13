import { GRADE_LABEL } from '@/lib/schedule-types';
import type { DashboardStudent, ReportClassStats, ReportScoreData } from '@/lib/report-types';
import type { Weights } from '@/lib/score-types';
import { PASSING_SCORE, average, finalScore } from '@/lib/scoring';

/** Satu baris nilai (DetailScore) lengkap dengan konteksnya. */
export type ScoreRecord = {
  studentId: string;
  className: string;
  subjectName: string;
  assignment: number | null;
  midExam: number | null;
  finalExam: number | null;
  weights: Weights;
};

const filled = (r: ScoreRecord) =>
  [r.assignment, r.midExam, r.finalExam].filter((v) => v !== null).length;

/**
 * Satu rekaman terbaik per (siswa, kelas, mata pelajaran). Sebuah pelajaran bisa punya beberapa sesi
 * per minggu, jadi tanpa ini siswa yang sama bisa terhitung ganda.
 */
export function dedupeScores(records: ScoreRecord[]): ScoreRecord[] {
  const best = new Map<string, ScoreRecord>();
  for (const r of records) {
    const key = `${r.className}|${r.subjectName}|${r.studentId}`;
    const current = best.get(key);
    if (!current || filled(r) > filled(current)) best.set(key, r);
  }
  return [...best.values()];
}

const numbers = (values: (number | null)[]) => values.filter((v): v is number => v !== null);

export function computeReport(args: {
  classes: { className: string; grade: number; students: number }[];
  subjects: { name: string; grade: number }[];
  scores: ScoreRecord[];
}): ReportScoreData {
  const names = [...new Set(args.subjects.map((s) => s.name))].sort();
  const deduped = dedupeScores(args.scores);

  const stats: Record<string, ReportClassStats[]> = {};
  for (const name of names) {
    const grades = new Set(args.subjects.filter((s) => s.name === name).map((s) => s.grade));
    stats[name] = args.classes
      .filter((c) => grades.has(c.grade))
      .sort((a, b) => a.grade - b.grade || a.className.localeCompare(b.className))
      .map((c) => {
        const rows = deduped.filter((r) => r.subjectName === name && r.className === c.className);
        const finals = numbers(rows.map((r) => finalScore(r, r.weights)));
        return {
          className: c.className,
          grade: c.grade,
          students: c.students,
          completed: finals.length,
          passed: finals.filter((v) => v >= PASSING_SCORE).length,
          assignment: average(numbers(rows.map((r) => r.assignment))),
          midExam: average(numbers(rows.map((r) => r.midExam))),
          finalExam: average(numbers(rows.map((r) => r.finalExam))),
          final: average(finals),
          finalSum: finals.reduce((a, b) => a + b, 0),
        };
      });
  }
  return { subjects: names, stats };
}

// ----- Bagan: nilai akhir rata-rata per tingkat, satu batang per "seri" (huruf akhir nama kelas) -----

const suffixOf = (className: string) =>
  /[A-Za-z]$/.test(className) ? className.slice(-1).toUpperCase() : className;

export const chartSeries = (stats: ReportClassStats[]) =>
  [...new Set(stats.map((s) => suffixOf(s.className)))].sort();

export function chartRows(stats: ReportClassStats[]): Record<string, string | number | null>[] {
  const series = chartSeries(stats);
  const grades = [...new Set(stats.map((s) => s.grade))].sort((a, b) => a - b);
  return grades.map((g) => ({
    grade: GRADE_LABEL[g] ?? String(g),
    ...Object.fromEntries(
      series.map((key) => [
        key,
        stats.find((s) => s.grade === g && suffixOf(s.className) === key)?.final ?? null,
      ]),
    ),
  }));
}

export function reportSummary(stats: ReportClassStats[]) {
  const withFinal = stats.filter((s) => s.final !== null);
  const completed = stats.reduce((a, s) => a + s.completed, 0);
  const passed = stats.reduce((a, s) => a + s.passed, 0);
  const best = [...withFinal].sort((a, b) => (b.final as number) - (a.final as number))[0] ?? null;
  return {
    average: average(withFinal.map((s) => s.final as number)),
    passedPercent: completed ? Math.round((passed / completed) * 100) : null,
    completed,
    best,
  };
}

/** Rata-rata nilai akhir dan persentase lulus gabungan semua pelajaran dan kelas (tiap siswa-pelajaran satu kali). */
export function overallStats(report: ReportScoreData) {
  const all = Object.values(report.stats).flat();
  const completed = all.reduce((a, s) => a + s.completed, 0);
  const passed = all.reduce((a, s) => a + s.passed, 0);
  const sum = all.reduce((a, s) => a + s.finalSum, 0);
  return {
    avgFinal: completed ? Math.round((sum / completed) * 10) / 10 : null,
    passRate: completed ? Math.round((passed / completed) * 100) : null,
  };
}

/** Ringkasan nilai per siswa untuk tabel dashboard (rata-rata antar mata pelajaran). */
export function summarizeStudents(
  students: { id: string; studentCode: string; name: string; className: string }[],
  scores: ScoreRecord[],
): DashboardStudent[] {
  const deduped = dedupeScores(scores);
  const rows = students.map((s) => {
    const mine = deduped.filter((r) => r.studentId === s.id);
    return {
      studentId: s.studentCode,
      name: s.name,
      className: s.className,
      assignment: average(numbers(mine.map((r) => r.assignment))),
      midExam: average(numbers(mine.map((r) => r.midExam))),
      finalExam: average(numbers(mine.map((r) => r.finalExam))),
      final: average(numbers(mine.map((r) => finalScore(r, r.weights)))),
    };
  });
  return rows.sort(
    (a, b) => (b.final ?? -1) - (a.final ?? -1) || a.studentId.localeCompare(b.studentId),
  );
}
