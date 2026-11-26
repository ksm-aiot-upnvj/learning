# Docker dan Docker Compose

!!! note "AI Generated"

    Penjelasan Docker dan langkah menjalankan paket aplikasi sensor disusun dengan bantuan AI.

Docker menjalankan proses dalam *container*, yaitu lingkungan terisolasi yang dibuat dari *image*. Image menyediakan berkas dan dependensi yang dibutuhkan aplikasi. Dockerfile berisi instruksi untuk membangun image tersebut.

Aplikasi yang memiliki beberapa layanan, seperti situs katalog dengan API dan database, dapat dijalankan lewat Docker Compose. Berkas `compose.yaml` mencatat layanan, jaringan, volume, dan port yang dipakai, sehingga pengaturan bisa diulang dari berkas yang sama.

Latihan AIoT memakai tiga layanan bernama `db`, `api`, dan `web`. PostgreSQL menyimpan pembacaan, Express memproses request, dan NGINX menyajikan hasil build Vue sekaligus meneruskan request API.

## Siapkan paket

1. Siapkan [Docker Engine](https://docs.docker.com/engine/install/) di mesin Linux.
2. Periksa apakah `docker compose version` menampilkan versi Compose.
3. Unduh [paket deployment AIoT](../assets/demos/aiot-deployment.zip).
4. Salin ZIP ke server sesuai [langkah SSH](ssh-basics.md#menyalin-file-ke-server).
5. Ekstrak ZIP dari folder yang menyimpan paket.

    ```bash
    unzip aiot-deployment.zip -d ~/aiot-lab
    ```

6. Masuk ke folder Compose.

    ```bash
    cd ~/aiot-lab/sensor-deployment
    ```

Jika bekerja langsung di mesin Linux, simpan ZIP pada mesin itu dan lanjutkan ke ekstraksi. Siapkan `unzip` untuk mengekstrak berkas Compose dan sumber aplikasi. Siapkan `openssl` untuk membuat kata sandi database latihan.

## Bangun image dan jalankan layanan

1. Gunakan `umask 077` di terminal server sebelum membuat berkas konfigurasi lokal.
2. Jika `.env` belum ada, buat berkas itu dengan kata sandi database baru.

    ```bash
    printf 'POSTGRES_PASSWORD=%s\n' "$(openssl rand -hex 24)" > .env
    ```

3. Periksa berkas Compose dengan `docker compose config --quiet`.
4. Bangun image dan jalankan layanan.

    ```bash
    docker compose up -d --build
    ```

5. Periksa status dengan `docker compose ps`.
6. Periksa log API dengan `docker compose logs api`.

Saat build pertama, Docker mengambil base image dan memasang dependensi. Compose menunggu PostgreSQL sehat sebelum membuka API. PostgreSQL menjalankan `schema.sql` ketika volume masih kosong, sehingga tabel `sensor_readings` tersedia pada awal latihan. [Urutan startup Compose](https://docs.docker.com/compose/how-tos/startup-order/) · [Inisialisasi image PostgreSQL](https://hub.docker.com/_/postgres)

API menghubungi PostgreSQL lewat nama layanan `db`. NGINX memakai nama `api` untuk meneruskan request ke Express. Hanya port web 8080 yang dipetakan ke loopback server, sedangkan komunikasi API dan database berlangsung di jaringan Compose. [Jaringan Compose](https://docs.docker.com/compose/how-tos/networking/)

## Periksa container yang menjalankan API

Jalankan `docker compose ps` dan periksa apakah `db` serta `api` berstatus sehat. Jika layanan berhenti, gunakan `docker compose ps -a` untuk menemukannya, lalu baca `docker compose logs db api web` untuk melihat bagian yang gagal.

Dari server, jalankan `curl -i http://127.0.0.1:8080/api/health`. Status 200 dengan body `{"status":"ok"}` menunjukkan request sampai ke Express melalui NGINX. Lanjutkan ke [uji dashboard](nginx-basics.md#uji-dashboard-dari-browser) untuk memeriksa satu pembacaan.

Jika port 8080 sudah dipakai, tambahkan `DASHBOARD_PORT=8081` ke `.env` sebelum menjalankan ulang Compose. Gunakan port baru pada alamat server dan pada tujuan SSH tunnel.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-network:</span> **NGINX untuk Reverse Proxy** <span class="ai-practice-description">Uji halaman Vue dan endpoint API melalui satu alamat.</span>](nginx-basics.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-panels-top-left:</span> **Portainer** <span class="ai-practice-description">Jika penasaran pengelolaan lewat web, baca status dan log container pada dashboard admin.</span>](portainer.md)

</div>
