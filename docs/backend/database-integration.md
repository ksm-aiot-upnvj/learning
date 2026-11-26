# Akses Database dari Express

!!! note "AI Generated"

    Jalur praktik dan penjelasan kedua paket demo diperbarui dengan bantuan AI.

Driver database membuat handler dapat mengirim query dan membaca hasilnya. Pada aplikasi inventaris, misalnya, handler bisa mengirim data item ke PostgreSQL lalu menggunakan baris hasil penyimpanan untuk membuat respons.

Untuk memahami jalur sensor, ikuti [Dashboard Hands-on](../hands-on/dashboard-hands-on.md). Dua demo di bawah memperlihatkan cara akses yang juga bisa dipakai dalam proyek AIoT, yaitu query PostgreSQL untuk data berbentuk tabel dan model Mongoose untuk dokumen perangkat.

## PostgreSQL dengan `pg`

Demo PostgreSQL memakai package `pg` dan `Pool` untuk mengelola koneksi ke server PostgreSQL. Kode menjalankan SQL secara langsung. Tabel `items` berisi kolom `id`, `name`, `value`, dan `created_at`; route `POST /api/items` menyimpan baris baru, sedangkan `GET /api/items` membaca daftar baris.

```js
const result = await db.query(
  "INSERT INTO items (name, value) VALUES ($1, $2) RETURNING *",
  [name, value],
);
```

Nilai dikirim sebagai parameter terpisah dari teks SQL. Pola ini membantu mencegah input pengguna ditafsirkan sebagai bagian dari query. Untuk operasi yang melibatkan beberapa perubahan yang harus berhasil bersama, gunakan transaksi database.

## MongoDB dengan Mongoose

Demo MongoDB memakai Mongoose sebagai ODM (*Object Document Mapper*). Schema `Device` menjelaskan bentuk dokumen perangkat, field wajib, nilai `status` yang diterima, dan nilai bawaan. Opsi `timestamps` menambahkan `createdAt` dan `updatedAt`.

Controller memakai operasi seperti `Device.find()`, `Device.findById()`, dan `Device.create()`. Route memasangkan operasi itu ke endpoint `GET`, `POST`, `PUT`, dan `DELETE` di bawah `/api/devices`. ID MongoDB berupa ObjectId; ID dengan format yang tidak sesuai perlu ditangani sebagai input tidak valid.

Schema Mongoose memeriksa sebagian aturan saat menulis dokumen. Tetap periksa request di batas API dan pilih field yang boleh diubah. Jangan meneruskan seluruh `req.body` untuk operasi update jika client hanya boleh mengubah beberapa field.

## Susunan kedua demo

| Tugas | Demo PostgreSQL | Demo MongoDB |
| --- | --- | --- |
| Menyalakan server | `index.js` membuat aplikasi Express dan membuka port | `index.js` memasang middleware, route, dan membuka port |
| Koneksi database | `db.js` membuat `Pool` dari `DATABASE_URL` | `src/config/db.js` memanggil `mongoose.connect()` |
| Membaca input | `express.json()` mengisi `req.body` | `express.json()` mengisi `req.body` |
| Memproses endpoint | Handler di `index.js` menjalankan query SQL | `src/routes/` memetakan endpoint ke `src/controllers/` |
| Membentuk data | Tabel dan kolom SQL | Schema dan model Mongoose |
| Menyimpan data | Query dengan parameter `$1`, `$2` | `Device.create()` dan operasi model lainnya |

Demo PostgreSQL sengaja menaruh handler dan query dalam satu file agar alur pertama mudah diikuti. Pada aplikasi yang bertambah besar, pisahkan route, controller, aturan aplikasi, dan akses database seperti pada [Struktur Proyek Backend](project-structure.md). Demo MongoDB sudah menunjukkan pemisahan route, controller, model, dan konfigurasi database.

## Koneksi dan penanganan error

Operasi database bersifat asynchronous. Tunggu koneksi siap sebelum menerima request yang memerlukan database. Pada paket unduhan MongoDB, `await connectDB()` dijalankan sebelum `app.listen()`. Jika koneksi gagal, fungsi mengakhiri proses sehingga log server dapat dipakai untuk mencari penyebabnya.

Contoh menangkap error database dan mengirim status HTTP yang sesuai. Jangan mengirim detail internal database ke client pada aplikasi produksi. Catat detail yang diperlukan di log server, lalu kembalikan pesan umum kepada client.

Simpan URL dan kredensial database di environment variable. Jangan masukkan file `.env` ke Git atau ke paket materi yang dibagikan. Batasi origin CORS sesuai kebutuhan aplikasi. CORS bukan pengganti autentikasi atau pemeriksaan izin.

## Memilih pola data

PostgreSQL cocok saat aplikasi banyak memakai relasi, constraint, transaksi, dan query SQL. MongoDB menyimpan dokumen yang dapat mengelompokkan field terkait dalam satu record. Keduanya dapat dipakai untuk API perangkat; pilih berdasarkan bentuk data, query, konsistensi, dan cara tim mengoperasikan database.

Lihat [Database](../database/overview.md) untuk pengantar database, lalu praktikkan dua pola tersebut di [Backend dengan PostgreSQL dan MongoDB](../hands-on/backend-database-demo.md).

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-database:</span> **Database** <span class="ai-practice-description">Pelajari tabel PostgreSQL sebelum menyimpan pembacaan dari API.</span>](../database/overview.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Demo PostgreSQL dan MongoDB** <span class="ai-practice-description">Bandingkan penyimpanan item dengan query dan perangkat dengan model.</span>](../hands-on/backend-database-demo.md)

[<span class="ai-practice-icon" aria-hidden="true">:lucide-server:</span> **Express.js dan FastAPI** <span class="ai-practice-description">Lihat padanan pola route dan validasi pada proyek Python.</span>](express-fastapi-bridge.md)

</div>
