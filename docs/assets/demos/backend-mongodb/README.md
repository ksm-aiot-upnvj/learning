# Demo Express, MongoDB, dan frontend Vanilla

<!-- AI Generated -->

Contoh ini menyediakan API CRUD perangkat melalui `/api/devices` dan UI HTML, CSS, serta JavaScript Vanilla pada alamat root. UI memakai API pada server yang sama, sehingga tidak perlu mengatur alamat backend atau origin tambahan. Salin `.env.example` ke `.env`, lalu isi `MONGO_HOST` dan `DB_NAME` sesuai layanan MongoDB latihan.

Jalankan `npm install --global pnpm@10.18.0` untuk memasang pnpm. Setelah itu, jalankan `pnpm install --frozen-lockfile` dari folder ini. Jalankan `npm run dev` pada terminal yang sama setelah instalasi selesai. Server mulai menerima request setelah koneksi ke MongoDB siap.

Buka `http://localhost:3000` untuk mencoba tambah, baca, edit, dan hapus perangkat lewat UI. Konfigurasi contoh menggunakan port 3000. Jalankan `node seed-api.js` dari terminal lain untuk membuat satu dokumen perangkat per POST, dengan jeda sekitar 10 detik. Gunakan `Ctrl+C` untuk menghentikan script.
