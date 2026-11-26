# Cloud & Deployment

!!! note "AI Generated"

    Jalur deployment dan pilihan pendalaman pada halaman ini disusun dengan bantuan AI.

Deployment adalah proses menyiapkan dan menjalankan aplikasi di lingkungan tempat aplikasi akan digunakan. Kita memindahkan kode atau hasil build, menyiapkan konfigurasi, lalu memeriksa apakah layanan dapat menerima permintaan.

Situs katalog, misalnya, bisa berjalan di laptop saat dibuat. Setelah dipasang di server, situs perlu menyajikan halaman dan meneruskan permintaan data secara konsisten. Pemeriksaan setelah deployment membantu menemukan bagian yang belum siap.

Di modul AIoT, kita memakai lagi aplikasi Express, PostgreSQL, dan Vue dari [Dashboard Hands-on](../hands-on/dashboard-hands-on.md). Setelah aplikasi berjalan di server Linux, kirim satu pembacaan melalui NGINX dan cocokkan ID respons dengan baris di dashboard.

## Jalur utama

1. [Linux Basics](linux-basics.md) untuk memeriksa folder, proses, dan port di server.
2. [SSH Basics](ssh-basics.md) untuk masuk ke server dan memindahkan paket latihan dari laptop.
3. [Docker dan Compose](docker-container.md) untuk membangun dan menjalankan layanan aplikasi.
4. [NGINX](nginx-basics.md) untuk membuka dashboard dan memeriksa jalur request API.

Latihan bisa memakai mesin Linux atau VM yang sudah memiliki Docker Engine dan plugin Compose. Pada server jarak jauh, browser mengakses port latihan lewat SSH tunnel. Dengan begitu, peserta bisa memeriksa aplikasi sebelum membuat pengaturan akses publik.

## Pilihan setelah deployment

| Minat | Halaman |
| --- | --- |
| Mengelola container dan membaca log lewat web | [Portainer](portainer.md) |
| Melihat riwayat CPU dan memori server atau container | [Beszel](beszel.md) |
| Mengambil, menyimpan, dan membuat grafik metrik resource | [Prometheus + Grafana](prometheus-grafana.md) |

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-terminal:</span> **Linux Basics** <span class="ai-practice-description">Kenali folder, proses, dan port yang akan dipakai selama deployment.</span>](linux-basics.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-container:</span> **Docker dan Compose** <span class="ai-practice-description">Jika akses server sudah siap, jalankan paket aplikasi sensor.</span>](docker-container.md)

</div>
