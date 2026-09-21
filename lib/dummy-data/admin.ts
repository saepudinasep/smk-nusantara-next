export const adminStats = {
  totalStudents: 842,
  totalStudentsDelta: '+3.2%',
  totalTeachers: 56,
  totalTeachersDelta: '+1',
  totalClasses: 24,
  totalClassesDelta: '0',
  pendingSchedules: 5,
  pendingSchedulesDelta: '-2',
};

export const enrollmentTrend = [
  { month: 'Apr', students: 780 },
  { month: 'Mei', students: 795 },
  { month: 'Jun', students: 802 },
  { month: 'Jul', students: 830 },
  { month: 'Agu', students: 838 },
  { month: 'Sep', students: 842 },
];

export const recentActivity = [
  {
    id: 1,
    activity: 'Menambahkan jadwal baru untuk kelas XII RPL 1',
    user: 'Siti Rahayu',
    role: 'Admin',
    time: '10 menit lalu',
    status: 'Selesai',
  },
  {
    id: 2,
    activity: 'Mengajukan finalisasi jadwal semester ganjil',
    user: 'Budi Santoso',
    role: 'Guru',
    time: '32 menit lalu',
    status: 'Menunggu',
  },
  {
    id: 3,
    activity: 'Memperbarui data mahasiswa pindahan',
    user: 'Siti Rahayu',
    role: 'Admin',
    time: '1 jam lalu',
    status: 'Selesai',
  },
  {
    id: 4,
    activity: 'Menginput nilai UTS Pemrograman Web',
    user: 'Dewi Anggraini',
    role: 'Guru',
    time: '2 jam lalu',
    status: 'Selesai',
  },
  {
    id: 5,
    activity: 'Mengajukan perubahan jadwal kelas XI TKJ 2',
    user: 'Rudi Hartono',
    role: 'Guru',
    time: '3 jam lalu',
    status: 'Menunggu',
  },
  {
    id: 6,
    activity: 'Menonaktifkan akun mahasiswa lulus',
    user: 'Siti Rahayu',
    role: 'Admin',
    time: 'Kemarin',
    status: 'Selesai',
  },
];

export const pendingScheduleApprovals = [
  { id: 1, className: 'XII RPL 1', teacher: 'Budi Santoso', subject: 'Pemrograman Web' },
  { id: 2, className: 'XI TKJ 2', teacher: 'Rudi Hartono', subject: 'Jaringan Dasar' },
  { id: 3, className: 'X MM 1', teacher: 'Dewi Anggraini', subject: 'Desain Grafis' },
  { id: 4, className: 'XII AKL 3', teacher: 'Farid Wijaya', subject: 'Akuntansi Keuangan' },
  { id: 5, className: 'XI RPL 2', teacher: 'Nina Marlina', subject: 'Basis Data' },
];
