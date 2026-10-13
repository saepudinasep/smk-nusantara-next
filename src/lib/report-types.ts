import type { ScheduleBundle } from '@/lib/schedule-types';

/** Ringkasan nilai satu kelas untuk satu mata pelajaran (diagregasi di server). */
export type ReportClassStats = {
  className: string;
  grade: number;
  /** jumlah siswa di kelas */
  students: number;
  /** siswa yang ketiga nilainya sudah lengkap (nilai akhir bisa dihitung) */
  completed: number;
  /** dari `completed`, yang nilai akhirnya >= nilai lulus */
  passed: number;
  /** rata-rata tiap komponen dari nilai yang sudah terisi; null bila belum ada */
  assignment: number | null;
  midExam: number | null;
  finalExam: number | null;
  /** rata-rata nilai akhir siswa yang lengkap; null bila belum ada */
  final: number | null;
  /** jumlah nilai akhir (untuk rata-rata gabungan lintas kelas) */
  finalSum: number;
};

export type ReportScoreData = {
  /** nama mata pelajaran (Agama, Matematika, ...) */
  subjects: string[];
  /** nama pelajaran -> statistik tiap kelas yang mempelajarinya */
  stats: Record<string, ReportClassStats[]>;
};

export type DayLoad = { day: string; finalized: number; draft: number };

export type DashboardStats = {
  students: number;
  male: number;
  female: number;
  teachers: number;
  classes: number;
  grades: number;
  subjects: number;
  finalized: number;
  schedules: number;
  avgFinal: number | null;
  passRate: number | null;
};

export type DashboardStudent = {
  studentId: string;
  name: string;
  className: string;
  assignment: number | null;
  midExam: number | null;
  finalExam: number | null;
  final: number | null;
};

export type DashboardTeacher = {
  teacherId: string;
  name: string;
  gender: 'Male' | 'Female';
  phoneNumber: string;
  subjects: string[];
  sessions: number;
};

export type DashboardData = {
  stats: DashboardStats;
  report: ReportScoreData;
  load: DayLoad[];
  schedule: ScheduleBundle;
  students: DashboardStudent[];
  teachers: DashboardTeacher[];
};
