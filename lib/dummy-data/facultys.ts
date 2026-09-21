export interface Faculty {
  id: number;
  name: string;
  kode: string;
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

function buildDummyFacultys(): Faculty[] {
  const facultys: Faculty[] = [];
  let idCounter = 1;

  for (let i = 0; i < 68; i++) {
    const name = CLASS_OPTIONS[i % CLASS_OPTIONS.length];

    facultys.push({
      id: idCounter,
      name,
      kode: `${String(10 + idCounter * 37).slice(0, 2)}`,
    });

    idCounter += 1;
  }

  return facultys;
}

export const INITIAL_FACULTYS: Faculty[] = buildDummyFacultys();
