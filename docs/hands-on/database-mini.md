# Database Mini

!!! note "AI Generated"

    Pemeriksaan ID dari respons API dan penjelasan skema latihan disusun dengan bantuan AI.

Latihan ini memasukkan dua pembacaan lewat SQL dan membaca hasilnya. Jalankan di database latihan `aiot_learning` dari [SQL Basics](../database/sql-basics.md#membuat-database). Jika tabel sudah dibuat di sana, lanjutkan ke `INSERT`.

## Buat tabel

```sql
CREATE TABLE sensor_readings (
    id BIGSERIAL PRIMARY KEY,
    device_id TEXT NOT NULL,
    sensor_type TEXT NOT NULL,
    value DOUBLE PRECISION NOT NULL,
    unit TEXT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

## Simpan dan baca dua pembacaan

```sql
INSERT INTO sensor_readings (device_id, sensor_type, value, unit)
VALUES ('esp32-01', 'temperature', 28.5, 'celsius'),
       ('esp32-01', 'ph', 6.2, 'pH');

SELECT device_id, sensor_type, value, unit, recorded_at
FROM sensor_readings
WHERE device_id = 'esp32-01' AND sensor_type = 'ph'
ORDER BY recorded_at DESC, id DESC;
```

Cari baris `esp32-01` dengan nilai `6.2` dan satuan `pH`. Baris suhu tidak ikut hasil filter. Data di latihan ini dimasukkan lewat SQL. Untuk menyimpan pembacaan yang datang dari API, lanjutkan ke [Dashboard Hands-on](dashboard-hands-on.md).

## Cari baris dari respons API

Di [Dashboard Hands-on](dashboard-hands-on.md), respons POST yang berhasil punya `data.id`. ID itu berasal dari PostgreSQL dan dipakai untuk mencari satu baris, meskipun perangkat yang sama sudah mengirim beberapa pembacaan.

1. Buka `psql` pada database latihan `aiot_dashboard`.
2. Jalankan query berikut.
3. Masukkan `data.id` saat diminta.

```sql
\prompt 'ID pembacaan: ' reading_id
SELECT id, device_id, sensor_type, value, unit, recorded_at
FROM sensor_readings
WHERE id = :'reading_id'::bigint;
```

Hasilnya menampilkan kolom yang juga dikembalikan oleh API. Bandingkan nilai dan satuan dengan kiriman, lalu gunakan ID yang sama untuk menemukan baris di Vue.

Untuk menguji kiriman yang ditolak, jalankan `SELECT COUNT(*) FROM sensor_readings;` sebelum dan sesudah request tanpa `value`. Jika tidak ada pengirim lain yang aktif, jumlah baris harus sama setelah API menjawab 400.

## Waktu pengukuran dan waktu simpan

`recorded_at` diisi database saat baris dicatat. Jika perangkat menyimpan pembacaan ketika jaringan putus, kiriman bisa tiba jauh setelah pengukuran. Untuk skema yang menyimpan waktu ukur dan waktu penerimaan secara terpisah, lihat [Desain Data IoT](../database/data-modeling.md). Di sana `measured_at` menyimpan waktu pengukuran dan `ingested_at` menyimpan waktu penerimaan.

Jika aplikasi perlu membuat ID berbasis waktu dengan PostgreSQL 18, fungsi bawaannya adalah [`uuidv7()`](https://www.postgresql.org/docs/18/functions-uuid.html). Latihan ini memakai nomor urut dan kolom waktu.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Dashboard Hands-on** <span class="ai-practice-description">Hubungkan tabel ke API, lalu cocokkan ID baris dan tampilan Vue.</span>](dashboard-hands-on.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-layout-dashboard:</span> **Frontend Mini** <span class="ai-practice-description">Jika baru mulai di sisi browser, cek koneksi ke API lewat /health.</span>](frontend-mini.md)

</div>
