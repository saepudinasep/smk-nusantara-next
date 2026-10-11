import type { ScoreValues, Weights } from '@/lib/score-types';

/** Nilai minimal lulus. Soal tidak menyebutkannya, jadi ini asumsi; ubah sesuai kebutuhan. */
export const PASSING_SCORE = 70;

/**
 * Nilai akhir = rata-rata berbobot tugas, UTS, dan UAS (dibulatkan 1 desimal).
 * Null bila salah satu nilai belum diisi. Dinormalisasi dengan total bobot, sehingga hasilnya
 * tetap benar walau bobot tidak persis berjumlah 100.
 */
export function finalScore(s: ScoreValues, w: Weights): number | null {
  if (s.assignment === null || s.midExam === null || s.finalExam === null) return null;
  const total = w.assignment + w.midExam + w.finalExam;
  if (total <= 0) return null;
  const value =
    (s.assignment * w.assignment + s.midExam * w.midExam + s.finalExam * w.finalExam) / total;
  return Math.round(value * 10) / 10;
}

export const average = (values: number[]): number | null =>
  values.length ? Math.round((values.reduce((a, b) => a + b, 0) / values.length) * 10) / 10 : null;
