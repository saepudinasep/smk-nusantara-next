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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CLASS_OPTIONS, type Student, type StudentStatus } from '@/lib/dummy-data/students';
import { PlusIcon } from 'lucide-react';

export type NewStudentInput = Omit<Student, 'id'>;

const EMPTY_FORM = {
  nim: '',
  prodiName: '',
  name: '',
  status: 'Aktif' as StudentStatus,
  angkatan: '',
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

    if (!form.nim.trim() || !form.name.trim() || !form.prodiName || !form.angkatan.trim()) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    onAdd({
      nim: form.nim.trim(),
      prodiName: form.prodiName,
      name: form.name.trim(),
      status: form.status,
      angkatan: form.angkatan.trim(),
    });

    toast.success('Mahasiswa berhasil ditambahkan', {
      description: `${form.name} · ${form.prodiName}`,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size='sm' />}>
        <PlusIcon />
        Tambah Mahasiswa
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Mahasiswa Baru</DialogTitle>
          <DialogDescription>
            Lengkapi data Mahasiswa di bawah ini. Data ini hanya tersimpan sementara di sesi ini.
          </DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={handleSubmit}>
          <FieldGroup>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor='nim'>NIM</FieldLabel>
                <Input
                  id='nim'
                  placeholder='2324010199'
                  value={form.nim}
                  onChange={(event) => setForm((prev) => ({ ...prev, nim: event.target.value }))}
                  aria-invalid={!!error}
                  required
                />
              </Field>
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor='angkatan'>Angkatan</FieldLabel>
                <Input
                  id='angkatan'
                  placeholder='2026'
                  value={form.angkatan}
                  onChange={(event) =>
                    setForm((prev) => ({ ...prev, angkatan: event.target.value }))
                  }
                  aria-invalid={!!error}
                  required
                />
              </Field>
            </div>

            <Field data-invalid={!!error}>
              <FieldLabel htmlFor='name'>Nama Lengkap</FieldLabel>
              <Input
                id='name'
                placeholder='Nama Mahasiswa'
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                aria-invalid={!!error}
                required
              />
            </Field>

            <div className='grid grid-cols-1 gap-4 sm:grid-cols-3'>
              <Field className='sm:col-span-2' data-invalid={!!error}>
                <FieldLabel htmlFor='prodiName'>Program Studi</FieldLabel>
                <Select
                  value={form.prodiName || undefined}
                  onValueChange={(value) =>
                    setForm((prev) => ({ ...prev, prodiName: value as string }))
                  }
                >
                  <SelectTrigger id='prodiName' className='w-full'>
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
