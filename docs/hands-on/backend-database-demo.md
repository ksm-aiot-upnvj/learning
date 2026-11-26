# Backend dengan PostgreSQL dan MongoDB

!!! note "AI Generated"

    Petunjuk paket, cara mengecek hasil, dan penjelasan seeder diperbarui dengan bantuan AI.

Backend memakai driver atau pustaka database untuk menyimpan dan membaca data. Di aplikasi inventaris, satu API dapat menyimpan item sebagai baris SQL, sementara aplikasi lain dapat memakai dokumen untuk mengelompokkan data yang berkaitan.

Kedua demo berikut memakai Express untuk membandingkan pola akses tersebut. PostgreSQL menyimpan item melalui `/api/items`, sedangkan MongoDB menyimpan perangkat melalui `/api/devices`. Untuk latihan yang mengikuti pembacaan sensor sampai dashboard, gunakan jalur `/sensors` di [Dashboard Hands-on](dashboard-hands-on.md).

Pastikan Node.js LTS dan database yang dipilih sudah tersedia. Jalankan satu demo pada satu waktu karena keduanya memakai port `3000`.

## Pilih demo

- [Unduh demo PostgreSQL](../assets/demos/backend-postgresql.zip){ .md-button } menyimpan dan membaca data `items` melalui query SQL.
- [Unduh demo MongoDB](../assets/demos/backend-mongodb.zip){ .md-button } menyediakan API CRUD perangkat dan script untuk mengirim data dummy.

Paket unduhan menyertakan `.env.example` sebagai templat. Simpan salinannya sebagai `.env` di folder demo agar proses lokal dapat membaca setelan database.

## Demo PostgreSQL

### Siapkan database dan project

Buat database PostgreSQL, misalnya `aiot_backend_demo`, memakai langkah di [SQL Basics](../database/sql-basics.md#membuat-database). Ekstrak ZIP, lalu jalankan perintah berikut dari PowerShell:

```powershell
Expand-Archive .\backend-postgresql.zip -DestinationPath .\backend-postgresql
Set-Location .\backend-postgresql\backend-postgresql
Copy-Item .env.example .env
npm.cmd ci
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
$created = Invoke-RestMethod `
  -Method Post `
  -Uri http://localhost:3000/api/items `
  -ContentType "application/json" `
  -Body $body
$created.data.id
```

Gunakan ID dari respons POST untuk memilih baris yang sama dari respons GET. GET mengembalikan daftar item di properti `data`.

```powershell
$items = Invoke-RestMethod http://localhost:3000/api/items
$items.data | Where-Object { $_.id -eq $created.data.id }
```

Cocokkan nama dan nilai pada baris itu dengan kiriman. Buka `index.js` untuk melihat bagaimana parameter `$1` dan `$2` diteruskan ke query. Jika request tidak mengirim `value`, server menjawab 400.

## Demo MongoDB

### Siapkan project

Pastikan MongoDB lokal aktif atau siapkan URI MongoDB yang dapat kamu gunakan. Ekstrak ZIP dan pasang dependency:

```powershell
Expand-Archive .\backend-mongodb.zip -DestinationPath .\backend-mongodb
Set-Location .\backend-mongodb\backend-mongodb
Copy-Item .env.example .env
npx.cmd --yes pnpm@10.18.0 install --frozen-lockfile
```

Isi `.env` dengan konfigurasi lokal. Untuk MongoDB lokal, bentuknya seperti berikut:

```text
PORT=3000
MONGO_HOST=mongodb://127.0.0.1:27017
DB_NAME=aiot_backend_demo
```

Jalankan server dari folder demo. Paket unduhan sudah menunggu hasil `connectDB()` sebelum menjalankan `app.listen()`, sehingga API mulai menerima permintaan setelah koneksi MongoDB siap.

```powershell
npm.cmd run dev
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

Jalankan seeder dari terminal kedua di folder demo saat API aktif di port 3000. Script bergantian memakai dua nama perangkat dan mengirim satu POST dengan jeda sekitar sepuluh detik. Setiap POST yang berhasil membuat dokumen baru, sehingga daftar dapat memuat beberapa dokumen bernama sama.

```powershell
node seed-api.js
```

Gunakan `Ctrl+C` untuk menghentikan script setelah dua kiriman terlihat. Ambil daftar perangkat lagi dan cocokkan ID dokumennya dengan hasil POST.

## Bandingkan alurnya

| Pertanyaan | PostgreSQL | MongoDB |
| --- | --- | --- |
| Apa yang disimpan? | Baris pada tabel `items` | Dokumen `Device` di collection |
| Bagaimana bentuk data dijaga? | Tipe dan constraint tabel | Aturan schema Mongoose pada aplikasi |
| Bagaimana query dibuat? | SQL dengan parameter | Method pada model, seperti `find()` dan `findById()` |
| Bagaimana hubungan layer terlihat? | Handler dan query masih di `index.js` | Route, controller, model, dan koneksi terpisah |

## Perbaikan yang bisa dicoba

1. Tambahkan validasi tipe dan rentang `value` pada endpoint PostgreSQL. Uji angka dan nilai teks untuk membandingkan hasilnya.
2. Batasi field yang dapat dibuat atau diperbarui pada controller MongoDB. Jangan teruskan seluruh `req.body` begitu saja.
3. Batasi origin `cors()` pada server MongoDB dan tambahkan pemeriksaan autentikasi jika API tidak boleh terbuka.
4. Ubah server agar tidak mengirim detail error database kepada client.

Untuk praktik Express tanpa database, mulai dari [Backend Mini](backend-mini.md). Untuk menyimpan pembacaan sensor PostgreSQL dan menghubungkannya ke frontend, lanjutkan ke [Dashboard Hands-on](dashboard-hands-on.md).

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Dashboard Hands-on** <span class="ai-practice-description">Terapkan pola query PostgreSQL pada endpoint sensor yang dipakai frontend.</span>](dashboard-hands-on.md){ .ai-practice-start }

</div>
