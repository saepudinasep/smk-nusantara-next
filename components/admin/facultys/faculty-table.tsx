'use client';

import { useMemo, useState } from 'react';
import { toast } from 'sonner';

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { INITIAL_FACULTYS, type Faculty } from '@/lib/dummy-data/facultys';
import {
  AddFacultyDialog,
  type NewFacultyInput,
} from '@/components/admin/facultys/add-faculty-dialog';
import { EditFacultyDialog } from '@/components/admin/facultys/edit-faculty-dialog';
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  PencilIcon,
  SearchIcon,
  Trash2Icon,
} from 'lucide-react';

const PAGE_SIZE = 10;

function getPageNumbers(current: number, total: number): (number | 'ellipsis')[] {
  if (total <= 7) {
    return Array.from({ length: total }, (_, i) => i + 1);
  }

  const pages = new Set<number>([1, total, current, current - 1, current + 1]);
  const sorted = Array.from(pages)
    .filter((page) => page >= 1 && page <= total)
    .sort((a, b) => a - b);

  const result: (number | 'ellipsis')[] = [];
  sorted.forEach((page, index) => {
    if (index > 0 && page - sorted[index - 1] > 1) {
      result.push('ellipsis');
    }
    result.push(page);
  });

  return result;
}

export function FacultyTable() {
  const [facultys, setFacultys] = useState<Faculty[]>(INITIAL_FACULTYS);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [editingFaculty, setEditingFaculty] = useState<Faculty | null>(null);
  const [facultyToDelete, setFacultyToDelete] = useState<Faculty | null>(null);

  const filtered = useMemo(() => {
    const query = search.trim().toLowerCase();
    if (!query) return facultys;

    return facultys.filter(
      (faculty) =>
        faculty.name.toLowerCase().includes(query) || faculty.kode.toLowerCase().includes(query),
    );
  }, [facultys, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const paginated = filtered.slice(startIndex, startIndex + PAGE_SIZE);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(1);
  }

  function handleAddFaculty(newFaculty: NewFacultyInput) {
    setFacultys((prev) => {
      const nextId = prev.length > 0 ? Math.max(...prev.map((s) => s.id)) + 1 : 1;
      return [{ id: nextId, ...newFaculty }, ...prev];
    });
    setPage(1);
  }

  function confirmDeleteFaculty() {
    if (!facultyToDelete) return;
    setFacultys((prev) => prev.filter((s) => s.id !== facultyToDelete.id));
    toast.success('Fakultas dihapus', {
      description: `${facultyToDelete.name} · ${facultyToDelete.kode}`,
    });
    setFacultyToDelete(null);
  }

  function handleSaveEdit(id: number, fields: Omit<Faculty, 'id'>) {
    setFacultys((prev) => prev.map((s) => (s.id === id ? { id, ...fields } : s)));
  }

  return (
    <Card>
      <CardHeader className='flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between'>
        <div>
          <CardTitle>Data Fakultas</CardTitle>
          <CardDescription>Kelola data fakultas terdaftar di SMK Nusantara</CardDescription>
        </div>
        <div className='flex items-center gap-2'>
          <div className='relative'>
            <SearchIcon className='pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground' />
            <Input
              placeholder='Cari nama atau kofr...'
              value={search}
              onChange={(event) => handleSearchChange(event.target.value)}
              className='w-56 pl-8'
            />
          </div>
          <AddFacultyDialog onAdd={handleAddFaculty} />
        </div>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='w-10'>No</TableHead>
              <TableHead>Nama Fakultas</TableHead>
              <TableHead>Kode Fakultas</TableHead>
              <TableHead className='text-right'>Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginated.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className='py-8 text-center text-muted-foreground'>
                  Tidak ada fakultas yang cocok dengan pencarian.
                </TableCell>
              </TableRow>
            ) : (
              paginated.map((faculty, index) => (
                <TableRow key={faculty.id}>
                  <TableCell className='text-muted-foreground'>{startIndex + index + 1}</TableCell>
                  <TableCell className='font-medium'>{faculty.name}</TableCell>
                  <TableCell>{faculty.kode}</TableCell>
                  <TableCell className='text-right'>
                    <div className='flex justify-end gap-1'>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        aria-label={`Edit ${faculty.name}`}
                        onClick={() => setEditingFaculty(faculty)}
                      >
                        <PencilIcon />
                      </Button>
                      <Button
                        variant='ghost'
                        size='icon-sm'
                        aria-label={`Hapus ${faculty.name}`}
                        onClick={() => setFacultyToDelete(faculty)}
                        className='text-destructive hover:bg-destructive/10 hover:text-destructive'
                      >
                        <Trash2Icon />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <div className='mt-4 flex flex-col items-center justify-between gap-3 sm:flex-row'>
          <p className='text-sm text-muted-foreground'>
            {filtered.length === 0
              ? '0 fakultas'
              : `Menampilkan ${startIndex + 1}-${Math.min(startIndex + PAGE_SIZE, filtered.length)} dari ${filtered.length} fakultas`}
          </p>

          {totalPages > 1 && (
            <div className='flex items-center gap-1'>
              <Button
                variant='outline'
                size='icon-sm'
                disabled={currentPage === 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                aria-label='Halaman sebelumnya'
              >
                <ChevronLeftIcon />
              </Button>

              {getPageNumbers(currentPage, totalPages).map((item, index) =>
                item === 'ellipsis' ? (
                  <span key={`ellipsis-${index}`} className='px-1.5 text-sm text-muted-foreground'>
                    ...
                  </span>
                ) : (
                  <Button
                    key={item}
                    variant={item === currentPage ? 'default' : 'outline'}
                    size='icon-sm'
                    onClick={() => setPage(item)}
                  >
                    {item}
                  </Button>
                ),
              )}

              <Button
                variant='outline'
                size='icon-sm'
                disabled={currentPage === totalPages}
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                aria-label='Halaman berikutnya'
              >
                <ChevronRightIcon />
              </Button>
            </div>
          )}
        </div>
      </CardContent>

      <EditFacultyDialog
        faculty={editingFaculty}
        open={editingFaculty !== null}
        onOpenChange={(open) => {
          if (!open) setEditingFaculty(null);
        }}
        onSave={handleSaveEdit}
      />

      <AlertDialog
        open={facultyToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setFacultyToDelete(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus data fakultas?</AlertDialogTitle>
            <AlertDialogDescription>
              {facultyToDelete && (
                <>
                  Data <span className='font-medium text-foreground'>{facultyToDelete.name}</span>{' '}
                  (Kode {facultyToDelete.kode}) akan dihapus permanen. Tindakan ini tidak dapat
                  dibatalkan.
                </>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction variant='destructive' onClick={confirmDeleteFaculty}>
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
}
