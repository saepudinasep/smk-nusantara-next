export type StudentStatus = 'Aktif' | 'Nonaktif';

export interface Student {
  id: number;
  nim: string;
  prodiName: string;
  name: string;
  status: StudentStatus;
  angkatan: string;
}

export const CLASS_OPTIONS = [
  'Teknik Informatika',
  'Sistem Informasi',
  'Manajemen',
  'Akuntansi',
  'Ilmu Komunikasi',
  'Desain Komunikasi Visual',
  'Teknik Sipil',
  'Arsitektur',
  'Pendidikan Bahasa Inggris',
];

const FIRST_NAMES = [
  'Ahmad',
  'Budi',
  'Citra',
  'Dewi',
  'Eka',
  'Fajar',
  'Gita',
  'Hendra',
  'Indah',
  'Joko',
  'Kartika',
  'Lestari',
  'Maulana',
  'Nadia',
  'Oki',
  'Putri',
  'Rizky',
  'Sari',
  'Taufik',
  'Umar',
  'Vina',
  'Wahyu',
  'Yusuf',
  'Zahra',
  'Agus',
  'Bella',
  'Dani',
  'Erika',
  'Firman',
  'Galih',
];

const LAST_NAMES = [
  'Saputra',
  'Wijaya',
  'Pratama',
  'Santoso',
  'Ramadhan',
  'Anggraini',
  'Setiawan',
  'Kurniawan',
  'Puspita',
  'Nugroho',
  'Handayani',
  'Firmansyah',
  'Wulandari',
  'Permata',
  'Hidayat',
];

function buildDummyStudents(): Student[] {
  const students: Student[] = [];
  let idCounter = 1;

  for (let i = 0; i < 68; i++) {
    const firstName = FIRST_NAMES[i % FIRST_NAMES.length];
    const lastName = LAST_NAMES[(i * 3 + 1) % LAST_NAMES.length];
    const prodiName = CLASS_OPTIONS[i % CLASS_OPTIONS.length];
    const year = 2324 + (i % 3);

    students.push({
      id: idCounter,
      nim: `${year}${String(idCounter).padStart(4, '0')}`,
      prodiName,
      name: `${firstName} ${lastName}`,
      status: i % 11 === 0 ? 'Nonaktif' : 'Aktif',
      angkatan: `${String(10 + idCounter * 37).slice(0, 2)}`,
    });

    idCounter += 1;
  }

  return students;
}

export const INITIAL_STUDENTS: Student[] = buildDummyStudents();
