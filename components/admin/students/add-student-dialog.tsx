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
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Field, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CLASS_OPTIONS, type Student, type StudentGender, type StudentStatus } from '@/lib/dummy-data/students';
import { PlusIcon } from 'lucide-react';

export type NewStudentInput = Omit<Student, 'id'>;

const EMPTY_FORM = {
  nis: '',
  name: '',
  className: '',
  gender: 'L' as StudentGender,
  phone: '',
  status: 'Aktif' as StudentStatus,
};

export function AddStudentDialog({ onAdd }: { onAdd: (student: NewStudentInput) => void }) {
  const formId = useId();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  function resetForm() {
    setForm(EMPTY_FORM);
    setError(null);
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen);
    if (!nextOpen) {
      resetForm();
    }
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.nis.trim() || !form.name.trim() || !form.className || !form.phone.trim()) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    onAdd({
      nis: form.nis.trim(),
      name: form.name.trim(),
      className: form.className,
      gender: form.gender,
      phone: form.phone.trim(),
      status: form.status,
    });

    toast.success('Siswa berhasil ditambahkan', { description: `${form.name} · ${form.className}` });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size='sm' />}>
        <PlusIcon />
        Tambah Siswa
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Siswa Baru</DialogTitle>
          <DialogDescription>
            Lengkapi data siswa di bawah ini. Data ini hanya tersimpan sementara di sesi ini.
          </DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={handleSubmit}>
          <FieldGroup>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor='nis'>NIS</FieldLabel>
                <Input
                  id='nis'
                  placeholder='2324010199'
                  value={form.nis}
                  onChange={(event) => setForm((prev) => ({ ...prev, nis: event.target.value }))}
                  aria-invalid={!!error}
                  required
                />
              </Field>
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor='phone'>No. HP</FieldLabel>
                <Input
                  id='phone'
                  placeholder='0812xxxxxxx'
                  value={form.phone}
                  onChange={(event) => setForm((prev) => ({ ...prev, phone: event.target.value }))}
                  aria-invalid={!!error}
                  required
                />
              </Field>
            </div>

            <Field data-invalid={!!error}>
              <FieldLabel htmlFor='name'>Nama Lengkap</FieldLabel>
              <Input
                id='name'
                placeholder='Nama siswa'
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                aria-invalid={!!error}
                required
              />
            </Field>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <Field className='sm:col-span-2' data-invalid={!!error}>
                <FieldLabel htmlFor='className'>Kelas</FieldLabel>
                <Select
                  value={form.className || undefined}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, className: value as string }))}
                >
                  <SelectTrigger id='className' className='w-full'>
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

              <Field>
                <FieldLabel htmlFor='gender'>Jenis Kelamin</FieldLabel>
                <Select
                  value={form.gender}
                  onValueChange={(value) => setForm((prev) => ({ ...prev, gender: value as StudentGender }))}
                >
                  <SelectTrigger id='gender' className='w-full'>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value='L'>Laki-laki</SelectItem>
                    <SelectItem value='P'>Perempuan</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            </div>

            {error && <p className='text-sm text-destructive'>{error}</p>}
          </FieldGroup>
        </form>

        <DialogFooter>
          <DialogClose render={<Button variant='outline' type='button' />}>Batal</DialogClose>
          <Button type='submit' form={formId}>
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
