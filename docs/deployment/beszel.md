# Beszel

!!! note "AI Generated"

    Penjelasan Hub dan Agent serta latihan pemantauan disusun dengan bantuan AI.

Beszel memantau resource server dan menyimpan riwayatnya. *Agent* membaca metrik di mesin yang dipantau. *Hub* menerima data itu dan menampilkannya sebagai grafik. [Pengantar Beszel](https://beszel.dev/guide/what-is-beszel)

Pengelola aplikasi bisa menggunakan riwayat tersebut saat pengguna melaporkan layanan terasa lambat. Grafik CPU atau memori membantu melihat kondisi server pada waktu laporan.

Untuk latihan AIoT, amati server Linux yang menjalankan stack sensor. Buka grafik server dan cari statistik container Express. Jika stack sempat dihentikan, jalankan lagi dengan `docker compose up -d` dari folder deployment.

## Hubungkan Hub dan Agent

Gunakan contoh **Docker or Podman** pada [panduan awal Beszel](https://beszel.dev/guide/getting-started). Pilih konfigurasi lengkap yang menjalankan Hub dan Agent pada satu mesin. Contoh ini menghubungkan keduanya melalui *Unix socket*, yaitu alamat komunikasi lokal berupa path.

1. Simpan contoh Compose resmi di folder baru untuk Beszel di server.
2. Ubah pemetaan port Hub menjadi `127.0.0.1:8090:8090`.
3. Jalankan Hub dari folder Beszel.

    ```bash
    docker compose up -d beszel
    ```

4. Teruskan port 8090 dari laptop melalui SSH.

    ```bash
    ssh -N -o ExitOnForwardFailure=yes -L 127.0.0.1:8090:127.0.0.1:8090 ubuntu@203.0.113.10
    ```

5. Buka `http://127.0.0.1:8090/`.
6. Buat akun admin untuk Hub latihan.
7. Pilih **Add System**.
8. Isi alamat sistem dengan `/beszel_socket/beszel.sock`.
9. Salin `KEY` dan `TOKEN` dari Hub ke konfigurasi Agent.
10. Simpan sistem di Hub.
11. Jalankan Agent dari folder Beszel.

    ```bash
    docker compose up -d beszel-agent
    ```

Ikuti panduan resmi untuk nilai `KEY` dan `TOKEN` yang dihasilkan pada instalasi. Pada contoh satu mesin, pertahankan port 8090 di server karena Agent menghubungi Hub melalui port itu.

## Baca grafik resource

1. Tunggu hingga sistem terhubung.
2. Buka grafik CPU server.
3. Buka grafik memori server.
4. Cari container API pada daftar container.
5. Kirim pembacaan melalui halaman [uji dashboard](nginx-basics.md#uji-dashboard-dari-browser).
6. Bandingkan waktu pengiriman dengan rentang waktu pada grafik.

Satu request kecil mungkin tidak menimbulkan perubahan yang terlihat pada grafik resource. Gunakan latihan ini untuk mengenali apa yang diukur dan pada mesin mana data diambil. [Statistik container Beszel](https://beszel.dev/)

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-chart-line:</span> **Prometheus + Grafana** <span class="ai-practice-description">Pelajari cara metrik dikumpulkan dan dibuat menjadi grafik.</span>](prometheus-grafana.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-cloud:</span> **Cloud & Deployment** <span class="ai-practice-description">Kembali ke jalur utama dan pilihan pendalaman lain.</span>](overview.md)

</div>
