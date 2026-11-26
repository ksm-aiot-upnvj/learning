# Hands-on

!!! note "AI Generated"

    Pengelompokan latihan dan petunjuk memilih jalur pada halaman ini disusun dengan bantuan AI.

Pilih kelompok sesuai pekerjaan yang ingin dicoba. Setiap latihan punya hasil yang bisa diperiksa sebelum lanjut ke langkah berikutnya.

## Git

Mulai dari commit di repo sendiri untuk melihat bagaimana perubahan sampai ke GitHub. Setelah itu, gunakan fork dan pull request untuk mengusulkan perubahan ke repo organisasi.

| Latihan | Hasil yang perlu diperiksa |
| --- | --- |
| [Git Lokal dan Repositori Sendiri](git-local-remote.md) | Periksa hasil merge di laptop, lalu cocokkan commit setelah push ke repo GitHub sendiri. |
| [Fork dan Pull Request di GitHub](git-fork-pull-request.md) | Periksa cabang asal, cabang tujuan, dan berkas usulan pada pull request ke repo latihan KSM. |

## Software Engineer

Ikuti satu pembacaan dari API, ke PostgreSQL, lalu ke dashboard. Mulai dari Backend Mini dan Database Mini, kemudian gunakan Frontend Mini untuk mengecek koneksi browser sebelum membuka Dashboard Hands-on.

| Latihan | Hasil yang perlu diperiksa |
| --- | --- |
| [Backend Mini](backend-mini.md) | Uji `GET /health`, kiriman valid, dan kiriman yang ditolak lewat Postman. |
| [Database Mini](database-mini.md) | Cari baris sensor lewat SQL dan cocokkan ID-nya dengan respons API. |
| [Frontend Mini](frontend-mini.md) | Periksa status backend atau pesan gagal setelah menekan tombol. |
| [Dashboard Hands-on](dashboard-hands-on.md) | Cocokkan ID yang sama di respons POST, baris PostgreSQL, dan tabel Vue. |
| [Backend dengan PostgreSQL dan MongoDB](backend-database-demo.md) | Bandingkan query item di PostgreSQL dengan CRUD perangkat di MongoDB. |

## IoT

Gunakan simulator untuk mengirim data jika perangkat fisik belum tersedia. Jika memakai ESP32, coba membaca sensor di Serial Monitor sebelum mengikuti kirimannya lewat MQTT.

| Latihan | Hasil yang perlu diperiksa |
| --- | --- |
| [IoT Simulator Mini](iot-simulator-mini.md) | Kirim data sensor sintetis ke API dari Python. |
| [IoT Hands-on](iot-hands-on.md) | Baca data sensor di ESP32 dan periksa respons aktuator. |
| [MQTT Hands-on](mqtt-hands-on.md) | Cocokkan pesan jarak dari broker dengan angka di Serial Monitor. |

## AI

> **AI Generated, need human review**

Ikuti latihan RAG untuk melihat bagaimana jawaban memakai konteks dokumen. Pada praktik data sensor, gunakan dataset yang sama untuk memeriksa hasil deteksi anomali dan ringkasan dari MCP.

| Latihan | Hasil yang perlu diperiksa |
| --- | --- |
| [RAG sederhana](rag-simple.md) | Periksa potongan dokumen yang ditemukan dan jawaban yang dihasilkan dari konteks itu. |
| [RAG lanjutan dengan HyDE + Browse Tool](rag-advanced.md) | Bandingkan hasil retrieval dari beberapa teknik menggunakan Hit@5. |
| [MCP dengan Data Sensor PostgreSQL](mcp-sensor.md) | Cocokkan pembacaan terakhir dan ringkasan sensor dari tool MCP dengan hasil query SQL. |
| [Deteksi Anomali Sensor pH](sensor-anomaly.md) | Bandingkan waktu munculnya alarm dari dua metode pada satu deret waktu. |
