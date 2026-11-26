# Dashboard Hands-on

!!! note "AI Generated"

    Jalur dari API ke PostgreSQL dan Vue, serta pemeriksaan hasilnya disusun dengan bantuan AI.

Pada aplikasi yang menerima data, API memberikan tanda bahwa kiriman berhasil disimpan. Database mencatat baris itu, lalu antarmuka dapat menampilkannya dari respons API berikutnya. ID pembacaan membantu menemukan baris yang sama di ketiga tempat.

Pada latihan AIoT ini, gunakan `POST /sensors` dari [Backend Mini](backend-mini.md) sebagai titik awal. Siapkan PostgreSQL, Node.js, dan VS Code untuk mengikuti pembacaan dari Postman sampai tabel Vue. [Frontend Mini](frontend-mini.md) dapat dipakai untuk mencoba koneksi browser lewat `/health` lebih dulu.

## Siapkan tabel latihan

Buat database kosong bernama `aiot_dashboard` dengan langkah dari [SQL Basics](../database/sql-basics.md#membuat-database). Jalankan hanya [perintah membuat tabel sensor](database-mini.md#buat-tabel) di database itu. Biarkan tabel kosong agar kondisi awal dashboard dapat diamati.

## Jalankan Express dengan PostgreSQL

1. Hentikan server Backend Mini dengan `Ctrl+C`.
2. Buka folder `mini_backend` di VS Code.
3. Simpan [dashboard-backend.cjs](../assets/demos/sensor-dashboard/dashboard-backend.cjs) di folder itu.
4. Periksa bahwa [validate-sensor.cjs](../assets/demos/sensor-dashboard/validate-sensor.cjs) ada di folder yang sama.
5. Pasang driver PostgreSQL dari terminal proyek.

    ```console
    npm install pg
    ```

6. Atur URL PostgreSQL sesuai akun lokal.

    === "Windows"

        ```powershell
        $env:DATABASE_URL = 'postgresql://USERNAME:PASSWORD@127.0.0.1:5432/aiot_dashboard'
        ```

    === "macOS"

        ```sh
        export DATABASE_URL='postgresql://USERNAME:PASSWORD@127.0.0.1:5432/aiot_dashboard'
        ```

    === "Linux"

        ```sh
        export DATABASE_URL='postgresql://USERNAME:PASSWORD@127.0.0.1:5432/aiot_dashboard'
        ```

7. Jalankan server di terminal yang sama.

    ```console
    node dashboard-backend.cjs
    ```

Middleware validasi tetap memakai empat field dari Backend Mini. Jika valid, handler menjalankan `INSERT` dengan parameter terpisah, kemudian `RETURNING` mengembalikan ID dan data yang tersimpan. [Query di node-postgres](https://node-postgres.com/features/queries)

`GET /sensors` mengambil paling banyak sepuluh pembacaan terbaru. `recorded_at` menunjukkan waktu database mencatat pembacaan. Pada tabel kosong, GET mengembalikan array `[]` dengan status 200. [Waktu simpan dan waktu ukur](database-mini.md#waktu-pengukuran-dan-waktu-simpan)

## Jalankan dashboard Vue

Vue memperbarui elemen halaman ketika data atau status request berubah. Di sini, `App.vue` meminta `GET /sensors` saat halaman dibuka dan ketika tombol **Muat ulang** diklik. Nilai sensor tetap berasal dari API. [Integrasi API di Frontend](../frontend/api-integration.md)

1. Siapkan Node.js yang memenuhi [prasyarat Vue](https://vuejs.org/guide/quick-start.html#creating-a-vue-application).
2. Buka terminal lain di direktori tempat folder dashboard akan dibuat.
3. Buat proyek Vue dengan Vite.

    ```console
    npm create vite@latest dashboard-sensor -- --template vue
    ```

4. Buka folder `dashboard-sensor` di VS Code.
5. Ganti `src/App.vue` dengan [App.vue untuk dashboard sensor](../assets/demos/sensor-dashboard/App.vue).
6. Pasang dependensi dari terminal proyek.

    ```console
    npm install
    ```

7. Jalankan Vite pada origin yang diizinkan API.

    ```console
    npm run dev -- --host 127.0.0.1 --port 5500 --strictPort
    ```

8. Buka `http://127.0.0.1:5500/`.

Jika port 5500 masih dipakai Frontend Mini, hentikan server HTML itu sebelum menjalankan Vite. API mengizinkan origin `http://127.0.0.1:5500`, sehingga alamat itulah yang dipakai untuk membuka Vue.

## Ikuti satu ID dari API ke dashboard

1. Periksa pesan **Belum ada pembacaan.** sebelum mengirim data.
2. Kirim payload valid dari [latihan Postman](backend-mini.md#kirim-post-dengan-json).
3. Catat `data.id` dari respons `201 Created`.
4. Cari ID itu dengan [query Database Mini](database-mini.md#cari-baris-dari-respons-api).
5. Klik **Muat ulang** pada dashboard.
6. Cocokkan ID, nilai, dan satuan yang tampil dengan respons POST.

Kirim ulang request setelah menghapus `value`. Statusnya harus `400`. Gunakan pemeriksaan jumlah baris di Database Mini untuk memastikan request yang ditolak tidak menambah pembacaan. Untuk mengirim data otomatis, gunakan [IoT Simulator Mini](iot-simulator-mini.md#jalankan-script).

## Coba kondisi halaman

| Kondisi | Cara memeriksa | Hasil yang diharapkan |
| --- | --- | --- |
| Memuat | Perlambat jaringan lewat tab **Network** pada DevTools, lalu klik **Muat ulang**. | Pesan **Memuat pembacaan…** terlihat saat request berlangsung. |
| Kosong | Buka aplikasi sebelum mengirim pembacaan pertama ke database latihan. | Pesan **Belum ada pembacaan.** tampil. |
| Berhasil | Kirim pembacaan valid, lalu klik **Muat ulang**. | Tabel menampilkan ID pembacaan dan satuannya. |
| Gagal | Hentikan Express, lalu klik **Muat ulang**. | Pesan **Gagal mengambil pembacaan.** tampil. |

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-cloud:</span> **Cloud & Deployment** <span class="ai-practice-description">Gunakan aplikasi yang sudah berjalan lokal untuk mengenal alur deployment.</span>](../deployment/overview.md){ .ai-practice-start }

</div>
