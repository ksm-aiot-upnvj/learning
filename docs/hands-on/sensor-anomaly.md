# Praktik Deteksi Anomali Sensor pH

!!! note "AI Generated, need human review"

    Materi, data sintetis, dan script latihan menunggu tinjauan manusia.

Sensor pH dapat mengirim angka yang terlihat wajar saat pembacaannya sudah macet. Dalam latihan ini, kita membandingkan dua cara menentukan kapan data perlu diperiksa. Ambang yang digunakan adalah bagian dari skenario latihan dan dapat diubah saat bereksperimen.

## Siapkan data

1. Buat folder latihan kosong.
2. Simpan [sensor_data.py](../assets/ai-labs/sensor_data.py) ke folder latihan.
3. Simpan [sensor_anomalies.py](../assets/ai-labs/sensor_anomalies.py) ke folder latihan.
4. Buka terminal di folder latihan.
5. Inisialisasi proyek Python.

    ```console
    uv init --bare
    ```

6. Pasang pustaka untuk membuat grafik.

    ```console
    uv add matplotlib
    ```

7. Buat CSV yang berisi pembacaan dua perangkat.

    ```console
    uv run python sensor_data.py
    ```

8. Jalankan script deteksi.

    ```console
    uv run python sensor_anomalies.py
    ```

## Bandingkan dua detektor

Buka `alarm-sensor.png` untuk melihat pH perangkat `esp32-01`. Tabel `alarm-sensor.csv` mencatat nilai dan status alarm pada tiap waktu. Ambang tetap memberi alarm di luar 5,8–6,8.

Median bergerak mengambil lima sampel **sebelumnya**, lalu memberi alarm jika selisih terhadap pembacaan saat ini lebih dari 0,75. Lima baris awal belum punya median karena jendela pembanding belum penuh.

Kedua cara diharapkan menandai lonjakan pukul `00:25 UTC`. Ambang tetap juga memberi alarm pada `01:20 UTC` ketika pH mencapai 7,0. Amati garis median yang ikut naik dan cari enam sampel berurutan yang menunjukkan nilai sama.

## Buka label kejadian

Jalankan perintah berikut setelah menandai dugaan anomali. Script melaporkan waktu dari awal tiap kejadian hingga alarm pertama, atau status `terlewat` jika tidak ada alarm di jendela kejadian.

```console
uv run python sensor_anomalies.py --evaluate
```

| Kejadian | Ambang tetap | Median bergerak |
| --- | --- | --- |
| Lonjakan pukul 00:25 UTC | 0 menit | 0 menit |
| Enam sampel macet mulai 00:35 UTC | Terlewat | Terlewat |
| Perubahan bertahap mulai 01:05 UTC | 15 menit | Terlewat |

Turunkan batas selisih median, lalu hitung ulang titik alarm di luar jendela kejadian. Jika ingin mendeteksi pembacaan macet, coba aturan tambahan untuk enam nilai berurutan yang sama. Uji juga aturan itu pada kondisi air yang memang stabil, karena pembulatan sensor bisa menghasilkan nilai berulang.

CSV yang sama menjadi sumber data [praktik MCP](mcp-sensor.md). Ringkasan SQL di sana menunjukkan nilai maksimum dan rentang pembacaan, sedangkan grafik membantu melihat kapan lonjakan terjadi.
