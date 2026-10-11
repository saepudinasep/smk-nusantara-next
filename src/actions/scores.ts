'use server';

import { revalidatePath } from 'next/cache';

import type { ActionResult } from '@/actions/result';
import { requireRole } from '@/lib/auth-guard';
import { prisma } from '@/lib/prisma';
import { ONLY_FINALIZED } from '@/lib/schedule-visibility';
import { saveScoreSchema } from '@/lib/validations';

/**
 * Simpan (atau hapus bila ketiganya kosong) nilai satu siswa untuk satu pelajaran + kelas.
 * Guru hanya boleh mengisi pelajaran + kelas yang BENAR-BENAR ia ajar, untuk siswa yang ada di
 * kelas itu. Klien hanya mengirim kode (kelas, pelajaran, siswa); sesi tempat nilai disimpan
 * ditentukan di server.
 */
export async function saveScore(input: unknown): Promise<ActionResult> {
  const user = await requireRole('teacher');
  const parsed = saveScoreSchema.safeParse(input);
  if (!parsed.success) return { ok: false, error: parsed.error.issues[0].message };
  const { className, subjectId, studentId, assignment, midExam, finalExam } = parsed.data;

  try {
    const teacher = await prisma.teacher.findUnique({
      where: { userId: user.id },
      select: { id: true },
    });
    if (!teacher) return { ok: false, error: 'Teacher profile not found.' };

    // sesi kanonik = sesi pertama (id naik) untuk kombinasi kelas + pelajaran milik guru ini
    const detail = await prisma.detailSchedule.findFirst({
      where: {
        teacherId: teacher.id,
        subject: { code: subjectId },
        schedule: { class: { name: className }, ...(ONLY_FINALIZED ? { finalized: true } : {}) },
      },
      orderBy: { id: 'asc' },
      select: { id: true, schedule: { select: { classId: true } } },
    });
    if (!detail) return { ok: false, error: 'You do not teach this subject in this class.' };

    const student = await prisma.student.findUnique({
      where: { studentCode: studentId },
      select: { id: true, class: { select: { classId: true } } },
    });
    if (!student || student.class?.classId !== detail.schedule.classId) {
      return { ok: false, error: 'This student is not in the selected class.' };
    }

    if (assignment === null && midExam === null && finalExam === null) {
      await prisma.detailScore.deleteMany({
        where: { detailId: detail.id, studentId: student.id },
      });
    } else {
      await prisma.detailScore.upsert({
        where: { detailId_studentId: { detailId: detail.id, studentId: student.id } },
        create: { detailId: detail.id, studentId: student.id, assignment, midExam, finalExam },
        update: { assignment, midExam, finalExam },
      });
    }
  } catch (e) {
    console.error(e);
    return { ok: false, error: 'Something went wrong. Please try again.' };
  }

  revalidatePath('/input-score');
  revalidatePath('/view-score');
  revalidatePath('/view-report-score');
  revalidatePath('/dashboard');
  return { ok: true };
}
