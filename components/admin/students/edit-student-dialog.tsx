'use client';

import { useId, useState } from 'react';
import { toast } from 'sonner';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CLASS_OPTIONS, type Student, type StudentStatus } from '@/lib/dummy-data/students';

type EditableFields = Omit<Student, 'id'>;

export function EditStudentDialog({
  student,
  open,
  onOpenChange,
  onSave,
}: {
  student: Student | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, fields: EditableFields) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Data Mahasiswa</DialogTitle>
          <DialogDescription>Perbarui data mahasiswa di bawah ini.</DialogDescription>
        </DialogHeader>

        {/* key={student.id}: form remount otomatis dengan data terbaru setiap
            kali mahasiswa yang diedit berganti, tanpa perlu useEffect. */}
        {student && (
          <EditStudentForm
            key={student.id}
            student={student}
            onSave={onSave}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditStudentForm({
  student,
  onSave,
  onDone,
}: {
  student: Student;
  onSave: (id: number, fields: EditableFields) => void;
  onDone: () => void;
}) {
  const formId = useId();
  const [form, setForm] = useState<EditableFields>({
    nim: student.nim,
    prodiName: student.prodiName,
    name: student.name,
    status: student.status,
    angkatan: student.angkatan,
  });
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.nim.trim() || !form.name.trim() || !form.prodiName || !form.angkatan.trim()) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    onSave(student.id, {
      nim: form.nim.trim(),
      prodiName: form.prodiName,
      name: form.name.trim(),
      status: form.status,
      angkatan: form.angkatan.trim(),
    });

    toast.success('Data mahasiswa diperbarui', { description: `${form.name} · ${form.prodiName}` });
    onDone();
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <FieldGroup>
          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor='edit-nim'>NIM</FieldLabel>
              <Input
                id='edit-nim'
                placeholder='2324010199'
                value={form.nim}
                onChange={(event) => setForm((prev) => ({ ...prev, nim: event.target.value }))}
                aria-invalid={!!error}
                required
              />
            </Field>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor='edit-angkatan'>Angkatan</FieldLabel>
              <Input
                id='edit-angkatan'
                placeholder='2026'
                value={form.angkatan}
                onChange={(event) => setForm((prev) => ({ ...prev, angkatan: event.target.value }))}
                aria-invalid={!!error}
                required
              />
            </Field>
          </div>

          <Field data-invalid={!!error}>
            <FieldLabel htmlFor='edit-name'>Nama Lengkap</FieldLabel>
            <Input
              id='edit-name'
              placeholder='Nama mahasiswa'
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              aria-invalid={!!error}
              required
            />
          </Field>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
            <Field className='sm:col-span-2' data-invalid={!!error}>
              <FieldLabel htmlFor='edit-prodiName'>Program Studi</FieldLabel>
              <Select
                value={form.prodiName || undefined}
                onValueChange={(value) =>
                  setForm((prev) => ({ ...prev, prodiName: value as string }))
                }
              >
                <SelectTrigger id='edit-prodiName' className='w-full'>
                  <SelectValue placeholder='Pilih kelas' />
                </SelectTrigger>
                <SelectContent>
                  {CLASS_OPTIONS.map((option) => (
                    <SelectItem key={option} value={option}>
                      {option}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </Field>
          </div>

          <Field>
            <FieldLabel htmlFor='edit-status'>Status</FieldLabel>
            <Select
              value={form.status}
              onValueChange={(value) =>
                setForm((prev) => ({ ...prev, status: value as StudentStatus }))
              }
            >
              <SelectTrigger id='edit-status' className='w-full sm:w-48'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='Aktif'>Aktif</SelectItem>
                <SelectItem value='Nonaktif'>Nonaktif</SelectItem>
              </SelectContent>
            </Select>
          </Field>

          {error && <p className='text-sm text-destructive'>{error}</p>}
        </FieldGroup>
      </form>

      <DialogFooter>
        <DialogClose render={<Button variant='outline' type='button' />}>Batal</DialogClose>
        <Button type='submit' form={formId}>
          Simpan Perubahan
        </Button>
      </DialogFooter>
    </>
  );
}
