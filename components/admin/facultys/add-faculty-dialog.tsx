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
import { type Faculty } from '@/lib/dummy-data/facultys';
import { PlusIcon } from 'lucide-react';

export type NewFacultyInput = Omit<Faculty, 'id'>;

const EMPTY_FORM = {
  name: '',
  kode: '',
};

export function AddFacultyDialog({ onAdd }: { onAdd: (faculty: NewFacultyInput) => void }) {
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

    if (!form.name.trim() || !form.kode) {
      setError('Semua kolom wajib diisi.');
      return;
    }

    onAdd({
      name: form.name.trim(),
      kode: form.kode,
    });

    toast.success('Fakultas berhasil ditambahkan', {
      description: `${form.name} · ${form.kode}`,
    });
    handleOpenChange(false);
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger render={<Button size='sm' />}>
        <PlusIcon />
        Tambah Fakultas
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Tambah Fakultas Baru</DialogTitle>
          <DialogDescription>
            Lengkapi data Fakultas di bawah ini. Data ini hanya tersimpan sementara di sesi ini.
          </DialogDescription>
        </DialogHeader>

        <form id={formId} onSubmit={handleSubmit}>
          <FieldGroup>
            <Field data-invalid={!!error}>
              <FieldLabel htmlFor='name'>Nama Lengkap</FieldLabel>
              <Input
                id='name'
                placeholder='Nama Fakultas'
                value={form.name}
                onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                aria-invalid={!!error}
                required
              />
            </Field>
            <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
              <Field data-invalid={!!error}>
                <FieldLabel htmlFor='kode'>Kode Fakultas</FieldLabel>
                <Input
                  id='kode'
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
            Simpan
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
