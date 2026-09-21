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
import { type Faculty } from '@/lib/dummy-data/facultys';

type EditableFields = Omit<Faculty, 'id'>;

export function EditFacultyDialog({
  faculty,
  open,
  onOpenChange,
  onSave,
}: {
  faculty: Faculty | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSave: (id: number, fields: EditableFields) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Data Fakultas</DialogTitle>
          <DialogDescription>Perbarui data fakultas di bawah ini.</DialogDescription>
        </DialogHeader>

        {/* key={faculty.id}: form remount otomatis dengan data terbaru setiap
            kali fakultas yang diedit berganti, tanpa perlu useEffect. */}
        {faculty && (
          <EditFacultyForm
            key={faculty.id}
            faculty={faculty}
            onSave={onSave}
            onDone={() => onOpenChange(false)}
          />
        )}
      </DialogContent>
    </Dialog>
  );
}

function EditFacultyForm({
  faculty,
  onSave,
  onDone,
}: {
  faculty: Faculty;
  onSave: (id: number, fields: EditableFields) => void;
  onDone: () => void;
}) {
  const formId = useId();
  const [form, setForm] = useState<EditableFields>({
    name: faculty.name,
    kode: faculty.kode,
  });
  const [error, setError] = useState<string | null>(null);

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (!form.name.trim() || !form.kode) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    onSave(faculty.id, {
      name: form.name.trim(),
      kode: form.kode,
    });

    toast.success('Data fakultas diperbarui', { description: `${form.name} · ${form.kode}` });
    onDone();
  }

  return (
    <>
      <form id={formId} onSubmit={handleSubmit}>
        <FieldGroup>
          <Field data-invalid={!!error}>
            <FieldLabel htmlFor='edit-name'>Nama Lengkap</FieldLabel>
            <Input
              id='edit-name'
              placeholder='Nama fakultas'
              value={form.name}
              onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
              aria-invalid={!!error}
              required
            />
          </Field>

          <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor='edit-kode'>Kode Fakultas</FieldLabel>
              <Input
                id='edit-kode'
                placeholder='2324010199'
                value={form.kode}
                onChange={(event) => setForm((prev) => ({ ...prev, kode: event.target.value }))}
                aria-invalid={!!error}
                required
              />
            </Field>
          </div>

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
