export type UserRole = 'admin' | 'teacher' | 'student';

export interface DummyUser {
  email: string;
  password: string;
  role: UserRole;
  name: string;
  /** Info tambahan yang relevan sesuai role, ditampilkan di dashboard */
  meta?: string;
}

/**
 * Akun dummy untuk keperluan demo/login.
 * Tidak terhubung ke backend/database sungguhan.
 */
export const DUMMY_USERS: DummyUser[] = [
  {
    email: 'admin@smknusantara.sch.id',
    password: 'admin123',
    role: 'admin',
    name: 'Siti Rahayu',
    meta: 'Tata Usaha & Kurikulum',
  },
  {
    email: 'budi.santoso@smknusantara.sch.id',
    password: 'guru123',
    role: 'teacher',
    name: 'Budi Santoso, S.Pd',
    meta: 'Guru Rekayasa Perangkat Lunak',
  },
  {
    email: 'ahmad.fauzan@siswa.smknusantara.sch.id',
    password: 'mahasiswa123',
    role: 'student',
    name: 'Ahmad Fauzan',
    meta: 'Program Studi Teknik Informatika · NIM 2324010123',
  },
];

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  teacher: 'Guru',
  student: 'Mahasiswa',
};

export const ROLE_HOME_PATH: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  teacher: '/dashboard/teacher',
  student: '/dashboard/student',
};

export function findDummyUser(email: string, password: string): DummyUser | undefined {
  return DUMMY_USERS.find(
    (candidate) =>
      candidate.email.toLowerCase() === email.trim().toLowerCase() &&
      candidate.password === password,
  );
}
