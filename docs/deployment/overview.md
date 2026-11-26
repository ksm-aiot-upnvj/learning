# Cloud & Deployment

!!! note "AI Generated"

    Jalur deployment dan pilihan pendalaman pada halaman ini disusun dengan bantuan AI.

Di [Dashboard Hands-on](../hands-on/dashboard-hands-on.md), API sensor menerima pembacaan, PostgreSQL menyimpannya, lalu Vue menampilkannya. Di bagian ini, kita menjalankan alur aplikasi yang sama dengan Docker Compose agar semua layanan siap digunakan bersama.

Mulai dengan [Docker dan Compose](docker-container.md). Paket latihan menyalakan Express, PostgreSQL, dan dashboard Vue; setelah stack berjalan, kirim satu pembacaan lalu cocokkan ID pada respons dengan baris di dashboard.

Jalankan latihan di Windows atau macOS dengan Docker Desktop, atau di Linux dengan Docker Engine. Jika paket perlu dipindahkan ke server lain, gunakan [SSH](ssh-basics.md) untuk menyalin berkas dan membuka tunnel ke browser. Kalau dashboard tidak bisa mengambil data, [Linux Basics](linux-basics.md) membantu memeriksa proses dan port, lalu [NGINX](nginx-basics.md) membantu menelusuri request dari browser ke API.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-container:</span> **Kelola container lewat Portainer** <span class="ai-practice-description">Periksa status stack dan baca log layanan melalui web.</span>](portainer.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-activity:</span> **Pantau penggunaan server** <span class="ai-practice-description">Lihat riwayat CPU dan memori dengan Beszel.</span>](beszel.md)

[<span class="ai-practice-icon" aria-hidden="true">:lucide-chart-line:</span> **Buat grafik metrik** <span class="ai-practice-description">Kumpulkan metrik resource, lalu tampilkan dengan Prometheus dan Grafana.</span>](prometheus-grafana.md)

</div>
