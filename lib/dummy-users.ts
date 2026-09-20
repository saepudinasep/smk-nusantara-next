export type UserRole = 'admin' | 'teacher' | 'student';

export interface DummyUser {
  username: string;
  password: string;
  role: UserRole;
  name: string;
  email: string;
  /** Info tambahan yang relevan sesuai role, ditampilkan di dashboard */
  meta?: string;
}

/**
 * Akun dummy untuk keperluan demo/login.
 * Tidak terhubung ke backend/database sungguhan.
 */
export const DUMMY_USERS: DummyUser[] = [
  {
    username: 'admin',
    password: 'admin123',
    role: 'admin',
    name: 'Siti Rahayu',
    email: 'admin@smknusantara.sch.id',
    meta: 'Tata Usaha & Kurikulum',
  },
  {
    username: 'guru',
    password: 'guru123',
    role: 'teacher',
    name: 'Budi Santoso, S.Pd',
    email: 'budi.santoso@smknusantara.sch.id',
    meta: 'Guru Rekayasa Perangkat Lunak',
  },
  {
    username: 'siswa',
    password: 'siswa123',
    role: 'student',
    name: 'Ahmad Fauzan',
    email: 'ahmad.fauzan@siswa.smknusantara.sch.id',
    meta: 'Kelas XII RPL 1 · NIS 2324010123',
  },
];

export const ROLE_LABEL: Record<UserRole, string> = {
  admin: 'Admin',
  teacher: 'Guru',
  student: 'Siswa',
};

export const ROLE_HOME_PATH: Record<UserRole, string> = {
  admin: '/dashboard/admin',
  teacher: '/dashboard/teacher',
  student: '/dashboard/student',
};

export function findDummyUser(username: string, password: string): DummyUser | undefined {
  return DUMMY_USERS.find(
    (candidate) =>
      candidate.username.toLowerCase() === username.trim().toLowerCase() &&
      candidate.password === password,
  );
}
