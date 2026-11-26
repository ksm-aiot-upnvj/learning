# Struktur Proyek Backend

Saat latihan pertama, satu file `main.js` cukup untuk melihat route dan response bersama-sama. Ketika aplikasi bertambah, pisahkan tugas agar aturan API, validasi, dan query database mudah ditemukan.

## Contoh susunan folder

```text
mini_backend/
├── src/
│   ├── app.js
│   ├── server.js
│   ├── routes/
│   │   └── sensor-routes.js
│   ├── controllers/
│   │   └── sensor-controller.js
│   ├── services/
│   │   └── sensor-service.js
│   └── repositories/
│       └── sensor-repository.js
├── .env
├── .gitignore
└── package.json
```

Nama dan jumlah folder dapat berbeda antarproyek. Ini peta untuk membantu membaca kode, bukan aturan yang wajib diikuti.

| Bagian | Tugas |
| --- | --- |
| `server.js` | menyalakan server dan memilih port |
| `app.js` | membuat aplikasi Express dan memasang middleware |
| `routes/` | memetakan method dan path ke handler |
| `controllers/` | membaca request dan membentuk response |
| `services/` | menjalankan aturan aplikasi |
| `repositories/` | membaca atau menulis database |
| `.env` | menyimpan konfigurasi lokal yang tidak dikomit |

## Contoh susunan pada demo

Demo MongoDB memakai pembagian yang mirip dengan peta di atas:

| File | Peran dalam demo |
| --- | --- |
| `index.js` | memasang middleware, memasang router `/api/devices`, dan menyalakan server |
| `src/config/db.js` | membuat koneksi Mongoose menggunakan `MONGO_HOST` dan `DB_NAME` |
| `src/middlewares/logger.js` | mencatat method dan URL request |
| `src/routes/deviceRoutes.js` | memasangkan method dan path ke fungsi controller |
| `src/controllers/deviceController.js` | membaca request, memanggil model `Device`, dan menyusun response |
| `src/models/device.js` | menetapkan schema dokumen device dan aturan field |

Demo PostgreSQL lebih ringkas: `db.js` membuat `Pool`, sementara `index.js` menyiapkan tabel dan menjalankan query untuk route. Ini memudahkan melihat request sampai query pertama. Saat fitur bertambah, pindahkan query dari handler ke service atau repository agar pengujian dan perubahan database lebih mudah dikelola.

## Ikuti satu request

!!! note "AI Generated"

    Penelusuran berkas pada jalur latihan sensor diperbarui dengan bantuan AI.

```mermaid
flowchart LR
    A[POST /sensors] --> B[Route]
    B --> C[Validasi]
    C --> D[Controller]
    D --> E[Service]
    E --> F[Repository]
    F --> G[(PostgreSQL)]
    G --> H[Response JSON]
```

Diagram di atas menunjukkan pembagian lapisan yang bisa dipakai saat aplikasi bertambah besar. Pada [Backend Mini](../hands-on/backend-mini.md), route ada di `main.js` dan pemeriksaan input ada di `validate-sensor.cjs`. Pada [Dashboard Hands-on](../hands-on/dashboard-hands-on.md), `dashboard-backend.cjs` memanggil validator yang sama sebelum menjalankan query.

Untuk melihat contoh dengan beberapa folder, ikuti `POST /api/devices` pada [demo MongoDB](../hands-on/backend-database-demo.md) dari route ke controller, lalu ke model. Setiap perpindahan dapat dilihat dari fungsi yang diimpor dan dipanggil.

Pemisahan ini juga berlaku pada FastAPI, meskipun nama file dan cara validasinya berbeda. Lihat [padanan Express.js dan FastAPI](express-fastapi-bridge.md).

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-database:</span> **Akses Database dari Express** <span class="ai-practice-description">Ikuti handler hingga query PostgreSQL atau pemanggilan model Mongoose.</span>](database-integration.md){ .ai-practice-start }

</div>
