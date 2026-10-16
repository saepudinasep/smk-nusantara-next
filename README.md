# Portal Akademik SMK Nusantara

Aplikasi portal akademik untuk mengelola data siswa dan guru, kelas, jadwal pelajaran, nilai, serta notifikasi. Hak akses dibagi menjadi tiga peran:

- **Admin**: dashboard, pengelolaan siswa/guru/kelas/jadwal, finalisasi jadwal, dan laporan nilai.
- **Guru**: melihat jadwal mengajar dan menginput nilai.
- **Siswa**: melihat jadwal kelas dan nilai.
- **Semua peran**: mengelola akun dan melihat notifikasi.

## Teknologi

- Next.js 16 dengan App Router, React 19, dan TypeScript
- MongoDB dengan Prisma ORM
- Auth.js (NextAuth) untuk autentikasi berbasis username dan password
- Tailwind CSS, shadcn/ui, dan Recharts
- Arcjet untuk proteksi bot, Pusher untuk notifikasi real-time, Web Push untuk notifikasi browser, dan Cloudinary untuk foto profil

## Persiapan

Pastikan sudah tersedia:

- Node.js yang kompatibel dengan Next.js 16
- npm
- MongoDB yang mendukung **replica set** (MongoDB Atlas sudah mendukungnya)

Pasang dependensi:

```bash
npm install
```

Buat file `.env` di root project. Contoh konfigurasi minimum untuk pengembangan:

```dotenv
DATABASE_URL="mongodb+srv://<username>:<password>@<cluster>/<database>?retryWrites=true&w=majority"
AUTH_SECRET="<secret-random>"
ARCJET_KEY="<arcjet-key>"
```

Gunakan connection string MongoDB Anda sendiri dan jangan commit file `.env`. Buat `AUTH_SECRET` acak, misalnya dengan `npx auth secret`. `ARCJET_KEY` dapat dibuat dari dashboard [Arcjet](https://console.arcjet.com). Arcjet wajib dikonfigurasi saat production: request akan menerima `503` jika key belum tersedia. Di development, aplikasi tetap berjalan dengan proteksi Arcjet dinonaktifkan.

Sinkronkan skema Prisma ke database:

```bash
npx prisma db push
```

Perintah ini perlu dijalankan setelah perubahan skema Prisma. Relasi yang membutuhkan transaksi mengharuskan MongoDB berjalan sebagai replica set.

Jalankan server development:

```bash
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000).

## Data awal untuk development

Seed mengisi database dengan data demo dan **menghapus data lama** pada koleksi yang dikelola seed. Jangan jalankan pada database yang berisi data penting atau database production.

1. Pastikan `DATABASE_URL` mengarah ke database development.
2. Tambahkan izin eksplisit ini ke `.env` lokal:

   ```dotenv
   SEED_ALLOW_WIPE="true"
   ```

3. Jalankan:

   ```bash
   npm run db:seed
   ```

Seed ditolak jika `NODE_ENV=production` atau `SEED_ALLOW_WIPE` bukan `true`. Akun demo bawaan:

| Peran | Username | Password default |
|---|---|---|
| Admin | `admin` | `admin1234` |
| Guru | `T0001` | `smk12345` |
| Siswa | `20160001` | `smk12345` |

Password admin seed dapat diubah dengan `SEED_ADMIN_PASSWORD`, sedangkan password awal guru dan siswa dapat diubah dengan `SEED_DEFAULT_PASSWORD`. Kredensial default hanya untuk demo lokal; ganti sebelum penggunaan nyata.
Untuk password awal akun guru/siswa yang dibuat lewat aplikasi (bukan lewat seed), gunakan `DEFAULT_USER_PASSWORD`.

Untuk membuat admin tanpa menghapus data, gunakan:

```bash
npm run db:create-admin
```

Untuk development, isi `ADMIN_USERNAME`, `ADMIN_PASSWORD`, dan opsional `ADMIN_EMAIL` di `.env` sebelum menjalankan perintah tersebut. Skrip menolak username yang sudah digunakan dan tidak mengubah data lain.

Password wajib memenuhi kebijakan aplikasi: minimal 8 karakter serta mengandung huruf besar, huruf kecil, angka, dan simbol. Untuk penggunaan di production, atur `ADMIN_USERNAME` dan `ADMIN_PASSWORD` sebagai environment variable pada environment tersebut, lalu jalankan `npx tsx prisma/create-admin.ts`. Jangan masukkan password production ke file yang di-commit.

## Layanan opsional

### Foto profil melalui Cloudinary

Fitur unggah foto profil memerlukan kredensial Cloudinary. Tanpa konfigurasi ini, fitur foto tidak tersedia.

```dotenv
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

`NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` juga dapat digunakan sebagai alternatif nama cloud. Jangan pernah mengekspos `CLOUDINARY_API_SECRET` ke browser.

### Notifikasi real-time

Notifikasi aplikasi disimpan di MongoDB. Untuk mengirim pembaruan real-time melalui Pusher, isi kredensial Channels berikut:

```dotenv
PUSHER_APP_ID=
PUSHER_KEY=
PUSHER_SECRET=
PUSHER_CLUSTER=
```

### Notifikasi push browser

Buat pasangan VAPID dengan `npx web-push generate-vapid-keys`, lalu tambahkan:

```dotenv
VAPID_PUBLIC_KEY=
VAPID_PRIVATE_KEY=
VAPID_SUBJECT=mailto:admin@example.com
```

Jaga `VAPID_PRIVATE_KEY` tetap rahasia. Pengguna dapat mengaktifkan notifikasi dari halaman Notifications setelah memberi izin browser. Push browser memerlukan HTTPS; `localhost` didukung untuk development.

Pusher dan VAPID dapat dikonfigurasi secara terpisah. Tanpa Pusher, notifikasi masih tersimpan di database tetapi tidak dikirim secara real-time. Tanpa VAPID, notifikasi push browser tidak dikirim.

## Perintah yang tersedia

| Perintah | Kegunaan |
|---|---|
| `npm run dev` | Menjalankan server development |
| `npm run build` | Membuat build production |
| `npm run start` | Menjalankan build production |
| `npm run lint` | Menjalankan ESLint |
| `npx prisma db push` | Menyinkronkan skema Prisma ke MongoDB |
| `npm run db:seed` | Menghapus data terkait lalu mengisi data demo (development saja) |
| `npm run db:create-admin` | Membuat admin tanpa menghapus data |

## Catatan deployment

Atur `DATABASE_URL`, `AUTH_SECRET`, dan `ARCJET_KEY` di environment deployment. Tambahkan kredensial Cloudinary, Pusher, dan/atau VAPID hanya jika fitur terkait digunakan. Jangan jalankan seed di production; buat akun admin dengan skrip `prisma/create-admin.ts`.
