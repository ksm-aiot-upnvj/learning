# Prometheus + Grafana

!!! note "AI Generated"

    Penjelasan, konfigurasi pemantauan, dan latihan membaca metrik disusun dengan bantuan AI.

Prometheus secara berkala meminta metrik dari sumber dan menyimpannya sebagai deret waktu. Grafana menjalankan query ke sumber data seperti Prometheus, lalu menampilkan hasilnya sebagai grafik. [Prometheus](https://prometheus.io/docs/introduction/overview/) · [Sumber data Grafana](https://grafana.com/docs/grafana/latest/datasources/prometheus/)

Sebagai contoh, tim operasi dapat memantau perubahan memori ketika beberapa layanan mulai berjalan. Riwayat metrik membantu membandingkan pemakaian resource dari menit ke menit.

Pada pendalaman AIoT ini, Node Exporter membaca statistik CPU dan memori mesin Linux. Prometheus mengambil statistik dari Node Exporter setiap 15 detik. Grafana menampilkan metrik itu saat peserta memeriksa server yang menjalankan stack sensor. [Node Exporter](https://prometheus.io/docs/guides/node-exporter/)

## Jalankan stack monitoring

Simpan tiga berkas berikut di folder baru pada server Linux. Konfigurasi membaca statistik CPU dan memori dari `/proc` milik host. Siapkan `openssl` untuk membuat kata sandi admin Grafana. Jalankan folder monitoring terpisah dari proyek aplikasi sensor.

- [compose.yaml](../assets/demos/resource-monitoring/compose.yaml)
- [prometheus.yml](../assets/demos/resource-monitoring/prometheus.yml)
- [datasource.yml](../assets/demos/resource-monitoring/datasource.yml)

1. Buka terminal di folder monitoring.
2. Jalankan `umask 077`.
3. Jika `.env` belum ada, buat berkas itu untuk akun admin Grafana.

    ```bash
    printf 'GRAFANA_PASSWORD=%s\n' "$(openssl rand -hex 24)" > .env
    ```

4. Jalankan `docker compose config --quiet`.
5. Jalankan `docker compose up -d`.
6. Periksa status layanan dengan `docker compose ps`.

Pada startup pertama, Grafana menyiapkan database lokalnya. Jika halaman belum terbuka, jalankan `docker compose logs -f grafana` dari folder monitoring dan tunggu sampai layanan HTTP mulai menerima koneksi.

## Periksa target dan buat grafik

1. Buka tunnel untuk Prometheus dan Grafana dari laptop.

    ```bash
    ssh -N -o ExitOnForwardFailure=yes \
      -L 127.0.0.1:19090:127.0.0.1:19090 \
      -L 127.0.0.1:13000:127.0.0.1:13000 \
      ubuntu@203.0.113.10
    ```

2. Buka `http://127.0.0.1:19090/targets`.
3. Periksa apakah target `node-exporter:9100` berstatus **UP**.
4. Buka `http://127.0.0.1:13000/`.
5. Masuk sebagai `admin` dengan kata sandi dari `.env`.
6. Buka **Explore** di Grafana.
7. Pilih sumber data **Prometheus**.

Konfigurasi sudah mendaftarkan sumber data pada Grafana. Jalankan query berikut di mode kode pada Explore untuk melihat persentase memori yang dipakai.

```promql
100 * (1 - node_memory_MemAvailable_bytes / node_memory_MemTotal_bytes)
```

Untuk melihat persentase CPU yang terpakai, jalankan query berikut. Tunggu setidaknya satu menit agar rentang `rate` memiliki beberapa sampel.

```promql
100 * (1 - avg by (instance) (rate(node_cpu_seconds_total{mode="idle"}[1m])))
```

Jika grafik kosong, cek apakah target sudah **UP**. Jika target sehat, periksa rentang waktu di Explore dan tunggu sampel tambahan. Metrik ini menggambarkan resource mesin yang dipantau. Nilai sensor tetap dapat dilihat di dashboard Vue. [Grafana Explore](https://grafana.com/docs/grafana/latest/explore/)

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-activity:</span> **Beszel** <span class="ai-practice-description">Coba tampilan ringkas untuk riwayat server dan container.</span>](beszel.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-cloud:</span> **Cloud & Deployment** <span class="ai-practice-description">Kembali ke jalur utama dan pilihan pendalaman lain.</span>](overview.md)

</div>
