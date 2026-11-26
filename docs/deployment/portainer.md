# Portainer

!!! note "AI Generated"

    Penjelasan dan latihan pengelolaan stack pada halaman ini disusun dengan bantuan AI.

Portainer menyediakan antarmuka web untuk mengelola lingkungan container. Antarmuka itu menampilkan status, log, image, jaringan, dan volume yang tersedia pada Docker. [Panduan container Portainer](https://docs.portainer.io/user/docker/containers)

Saat tim menjalankan beberapa aplikasi, pengelola sering perlu menemukan container yang gagal atau memeriksa log layanan tertentu. Portainer mengumpulkan pemeriksaan itu dalam satu tampilan.

Untuk latihan AIoT, buka stack sensor yang sudah dijalankan dengan [Docker Compose](docker-container.md). Cari container API dan cocokkan lognya dengan hasil `docker compose logs api`. Jika stack sempat dihentikan, jalankan lagi dengan `docker compose up -d` dari folder deployment.

## Buka Portainer Community Edition

Gunakan server Linux latihan yang boleh dikelola. Portainer terhubung ke Docker melalui socket, sehingga akun admin dapat mengendalikan container pada server itu. Jika tim sudah menyediakan Portainer, gunakan instalasi itu dan lanjutkan ke pemeriksaan log.

1. Jalankan container Portainer di server latihan.

    ```bash
    docker run -d --name portainer-aiot \
      -p 127.0.0.1:9443:9443 \
      -v /var/run/docker.sock:/var/run/docker.sock \
      -v portainer-aiot-data:/data \
      portainer/portainer-ce:lts
    ```

2. Buka tunnel ke port 9443 dari laptop.

    ```bash
    ssh -N -o ExitOnForwardFailure=yes -L 127.0.0.1:9443:127.0.0.1:9443 ubuntu@203.0.113.10
    ```

3. Buka `https://127.0.0.1:9443/`.
4. Buat akun admin untuk instalasi latihan.
5. Pilih lingkungan Docker lokal.

Ganti akun dan alamat SSH dengan nilai milik server latihan. Portainer memakai sertifikat bawaan saat baru dipasang, sehingga browser dapat meminta verifikasi sertifikat lokal. [HTTPS Portainer](https://docs.portainer.io/start/install-ce/server/docker/linux)

## Temukan API dan periksa log

1. Buka **Containers**.
2. Cari container milik layanan `api` pada stack sensor.
3. Buka **Logs** pada container itu.
4. Cari pesan yang menunjukkan Express mendengarkan di port 8000.
5. Bandingkan log dengan keluaran `docker compose logs api` dari terminal server.

Compose menentukan nama layanan dan konfigurasi aplikasi. Portainer menampilkan container yang dijalankan dari konfigurasi itu, sehingga pemeriksaan dapat dilakukan dari web tanpa menebak container mana yang menyimpan log API.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-activity:</span> **Beszel** <span class="ai-practice-description">Lihat riwayat pemakaian resource pada server yang sama.</span>](beszel.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-cloud:</span> **Cloud & Deployment** <span class="ai-practice-description">Kembali ke jalur utama dan pilihan pendalaman lain.</span>](overview.md)

</div>
