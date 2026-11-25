# Backend dengan PostgreSQL dan MongoDB

Hands-on ini memakai dua demo Express untuk melihat perbedaan akses database. Demo PostgreSQL memakai `pg` dan query SQL. Demo MongoDB memakai Mongoose, schema, model, dan controller. Keduanya memakai Node.js dan Express.

Pastikan Node.js LTS dan database yang dipilih sudah tersedia. Jalankan satu demo pada satu waktu karena keduanya memakai port `3000`.

## Pilih demo

- [Unduh demo PostgreSQL](../assets/demos/backend-postgresql.zip){ .md-button } menyimpan dan membaca data `items` melalui query SQL.
- [Unduh demo MongoDB](../assets/demos/backend-mongodb.zip){ .md-button } menyediakan API CRUD perangkat dan script untuk mengirim data dummy.

Paket ini tidak menyertakan `.env` dari arsip sumber. Buat file lokal dari `.env.example` dan isi sesuai database milikmu. Jangan membagikan file `.env` atau mengunggahnya ke Git.

## Demo PostgreSQL

### Siapkan database dan project

Buat database PostgreSQL, misalnya `aiot_backend_demo`, memakai langkah di [SQL Basics](../database/sql-basics.md#membuat-database). Ekstrak ZIP, lalu jalankan perintah berikut dari PowerShell:

```powershell
Expand-Archive .\backend-postgresql.zip -DestinationPath .\backend-postgresql
Set-Location .\backend-postgresql\backend-postgresql
Copy-Item .env.example .env
npm ci
```

Ubah `DATABASE_URL` di `.env` agar sesuai username, password, host, port, dan nama database. Contoh formatnya:

```text
PORT=3000
DATABASE_URL=postgresql://USERNAME:PASSWORD@127.0.0.1:5432/aiot_backend_demo
```

Jalankan server:

```powershell
node index.js
```

Saat server mulai, demo membuat tabel `items` jika tabel itu belum ada. Demo tidak membuat database PostgreSQL; database harus sudah tersedia.

### Coba endpoint

Di PowerShell lain, baca daftar item:

```powershell
Invoke-RestMethod http://localhost:3000/api/items
```

Simpan satu item:

```powershell
$body = @{ name = "sensor lab"; value = 28.5 } | ConvertTo-Json
Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/items `
  -ContentType "application/json" `
  -Body $body
```

Panggil `GET /api/items` lagi. Periksa bahwa response `POST` mengembalikan baris yang baru dibuat dan daftar memuat nilai yang sama. Cari di `index.js` query `INSERT` untuk melihat placeholder `$1` dan `$2`.

## Demo MongoDB

### Siapkan project

Pastikan MongoDB lokal aktif atau siapkan URI MongoDB yang dapat kamu gunakan. Ekstrak ZIP dan pasang dependency:

```powershell
Expand-Archive .\backend-mongodb.zip -DestinationPath .\backend-mongodb
Set-Location .\backend-mongodb\backend-mongodb
Copy-Item .env.example .env
corepack pnpm install --frozen-lockfile
```

Isi `.env` dengan konfigurasi lokal. Untuk MongoDB lokal, bentuknya seperti berikut:

```text
PORT=3000
MONGO_HOST=mongodb://127.0.0.1:27017
DB_NAME=aiot_backend_demo
```

Sebelum menyalakan server, buka `index.js`. Hapus pemanggilan `connectDB()` dan blok `app.listen()` yang lama. Ganti dengan bootstrap yang menunggu koneksi database:

```js
const startServer = async () => {
  await connectDB();
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server berjalan di port ${PORT}`);
  });
};

startServer();
```

Jalankan server setelah perubahan disimpan:

```powershell
pnpm dev
```

### Baca dan buat device

Ambil semua device:

```powershell
Invoke-RestMethod http://localhost:3000/api/devices
```

Filter berdasarkan query parameter:

```powershell
Invoke-RestMethod "http://localhost:3000/api/devices?status=online"
```

Buat device dengan `POST /api/devices`:

```powershell
$device = @{
  name = "ESP32-Lab-01"
  location = "Lab AIoT"
  status = "online"
  sensorData = @{ temperature = 28.5; humidity = 70 }
} | ConvertTo-Json -Depth 5

$created = Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/devices `
  -ContentType "application/json" `
  -Body $device

$created.data._id
```

Gunakan ID dari hasil tersebut untuk mencoba `GET /api/devices/{id}`, `PUT /api/devices/{id}`, dan `DELETE /api/devices/{id}`. Router menghubungkan method dan path ke controller. Controller memakai model `Device` untuk membaca atau mengubah dokumen.

`seed-api.js` mengirim device dummy setiap 10 detik tanpa berhenti. Jalankan di terminal lain hanya saat ingin mencoba aliran data, lalu hentikan dengan `Ctrl+C`.

## Bandingkan alurnya

| Pertanyaan | PostgreSQL | MongoDB |
| --- | --- | --- |
| Apa yang disimpan? | Baris pada tabel `items` | Dokumen `Device` di collection |
| Bagaimana bentuk data dijaga? | Tipe dan constraint tabel | Aturan schema Mongoose pada aplikasi |
| Bagaimana query dibuat? | SQL dengan parameter | Method pada model, seperti `find()` dan `findById()` |
| Bagaimana hubungan layer terlihat? | Handler dan query masih di `index.js` | Route, controller, model, dan koneksi terpisah |

## Perbaikan yang bisa dicoba

1. Tambahkan validasi tipe dan rentang `value` pada endpoint PostgreSQL.
2. Batasi field yang dapat dibuat atau diperbarui pada controller MongoDB. Jangan teruskan seluruh `req.body` begitu saja.
3. Batasi origin `cors()` pada server MongoDB dan tambahkan pemeriksaan autentikasi jika API tidak boleh terbuka.
4. Ubah server agar tidak mengirim detail error database kepada client.

Untuk praktik Express tanpa database, mulai dari [Backend Mini](backend-mini.md). Untuk menyimpan pembacaan sensor PostgreSQL dan menghubungkannya ke frontend, lanjutkan ke [Dashboard Hands-on](dashboard-hands-on.md).
