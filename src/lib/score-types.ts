/** Bobot dalam persen (Subject.assignment / midExam / finalExam). */
export type Weights = { assignment: number; midExam: number; finalExam: number };
export type ScoreValues = {
  assignment: number | null;
  midExam: number | null;
  finalExam: number | null;
};

// ----- Input Score (guru) -----
export type ScoreStudent = ScoreValues & { studentId: string; name: string };
/** Satu kombinasi mata pelajaran + kelas yang diajar guru. */
export type ScoreGroup = {
  subjectId: string;
  subject: string;
  className: string;
  weights: Weights;
  students: ScoreStudent[];
};
export type InputScoreData = {
  teacher: { teacherId: string; name: string };
  groups: ScoreGroup[];
};

// ----- View Score (siswa) -----
export type ViewScoreRow = ScoreValues & { subjectId: string; subject: string; weights: Weights };
export type ViewScoreData = {
  student: { studentId: string; name: string };
  /** null = siswa belum ditempatkan di kelas mana pun */
  className: string | null;
  rows: ViewScoreRow[];
};
