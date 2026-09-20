export type StudentGender = 'L' | 'P';
export type StudentStatus = 'Aktif' | 'Nonaktif';

export interface Student {
  id: number;
  nis: string;
  name: string;
  className: string;
  gender: StudentGender;
  phone: string;
  status: StudentStatus;
}

export const CLASS_OPTIONS = [
  'X RPL 1',
  'X RPL 2',
  'X TKJ 1',
  'XI RPL 1',
  'XI RPL 2',
  'XI TKJ 2',
  'XII RPL 1',
  'XII TKJ 1',
  'XII AKL 3',
];

const FIRST_NAMES = [
  'Ahmad', 'Budi', 'Citra', 'Dewi', 'Eka', 'Fajar', 'Gita', 'Hendra', 'Indah', 'Joko',
  'Kartika', 'Lestari', 'Maulana', 'Nadia', 'Oki', 'Putri', 'Rizky', 'Sari', 'Taufik', 'Umar',
  'Vina', 'Wahyu', 'Yusuf', 'Zahra', 'Agus', 'Bella', 'Dani', 'Erika', 'Firman', 'Galih',
];

const LAST_NAMES = [
  'Saputra', 'Wijaya', 'Pratama', 'Santoso', 'Ramadhan', 'Anggraini', 'Setiawan', 'Kurniawan',
  'Puspita', 'Nugroho', 'Handayani', 'Firmansyah', 'Wulandari', 'Permata', 'Hidayat',
];

function buildDummyStudents(): Student[] {
  const students: Student[] = [];
  let idCounter = 1;

  for (let i = 0; i < 68; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length];
    const className = CLASS_OPTIONS[i % CLASS_OPTIONS.length];
    const gender: StudentGender = i % 2 === 0 ? 'L' : 'P';
    const year = 2324 + (i % 3);

    students.push({
      id: idCounter,
      nis: `${year}${String(idCounter).padStart(4, '0')}`,
      name: `${firstName} ${lastName}`,
      className,
      gender,
      phone: `08${String(1000000000 + idCounter * 37).slice(0, 10)}`,
      status: i % 11 === 0 ? 'Nonaktif' : 'Aktif',
    });

    idCounter += 1;
  }

  return students;
}

export const INITIAL_STUDENTS: Student[] = buildDummyStudents();
