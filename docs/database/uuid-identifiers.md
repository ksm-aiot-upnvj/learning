# UUIDv4 dan UUIDv7

!!! note "AI Generated"

    Kartu What's next pada halaman ini disusun dengan bantuan AI.

UUID adalah ID 128-bit yang dapat dibuat tanpa meminta nomor dari satu server pusat. UUIDv4 mengisi ID dengan nilai acak. UUIDv7 menaruh timestamp Unix di bagian awal dan sisa bit untuk presisi tambahan serta nilai acak. Format dan versinya ditetapkan dalam [RFC 9562](https://www.rfc-editor.org/rfc/rfc9562.html).

## Perbandingan

| Pertimbangan | UUIDv4 | UUIDv7 |
| --- | --- | --- |
| Isi utama | Nilai acak | Timestamp pembuatan dan nilai acak |
| Urutan | Tidak menunjukkan urutan waktu | Umumnya dapat diurutkan menurut waktu pembuatan |
| Indeks B-tree | Insert tersebar pada banyak bagian indeks | Insert cenderung mengarah ke bagian indeks terbaru |
| Informasi waktu | Tidak menyimpan timestamp | Waktu pembuatan dapat diperkirakan atau diekstrak |
| Contoh penggunaan | ID yang perlu tetap acak dan tidak memperlihatkan urutan pembuatan | ID event atau data yang manfaatnya terbantu oleh urutan waktu |

Keduanya adalah ID, bukan pengganti aturan otorisasi. UUIDv7 juga bukan bukti waktu pengukuran yang akurat: jam pembuat ID bisa berbeda, dan ID dapat dibuat setelah peristiwa terjadi.

## Konvensi KSM AIoT untuk data time-series

KSM AIoT menggunakan UUIDv7 sebagai ID unik pada data time-series. PostgreSQL 18 menyediakan `uuidv7()` secara bawaan:

```sql
CREATE TABLE sensor_readings (
  id UUID PRIMARY KEY DEFAULT uuidv7(),
  device_id UUID NOT NULL,
  sensor_type TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT now()
);
```

`measured_at` mencatat waktu sensor mengukur. `ingested_at` mencatat waktu database menerima baris. Timestamp dalam UUIDv7 mengikuti waktu saat ID dibuat; PostgreSQL menyediakan `uuid_extract_timestamp(id)` untuk membacanya. Dokumentasi PostgreSQL mengingatkan bahwa nilai hasil ekstraksi tidak selalu persis sama dengan waktu pembuatan UUID. Karena itu, simpan `measured_at` untuk analisis sensor dan simpan `ingested_at` bila waktu penerimaan dibutuhkan. `created_at` bisa dihilangkan jika maknanya hanya waktu ID dibuat dan sumber waktu tersebut memang cukup untuk kebutuhan aplikasi.

`updated_at` tidak wajib pada setiap tabel. Pembacaan sensor umumnya append-only, jadi perubahan terakhir tidak perlu dicatat. Tambahkan `updated_at` pada data yang dapat diedit—misalnya nama atau konfigurasi device—jika aplikasi perlu mengetahui kapan perubahan terakhir terjadi.

## UUIDv7 dan query waktu

Nilai UUIDv7 tersusun menurut waktu pembuatan, sehingga dapat membantu pengurutan ID dan pencarian rentang berdasarkan waktu ID dibuat. PostgreSQL 18 dapat mengekstrak timestamp dari UUIDv7. Namun batas rentang UUID hanya perkiraan waktu pembuatan dan pemanggilan fungsi pembatas yang salah dapat membuat planner melewatkan indeks. Filter waktu utama sebaiknya tetap memakai kolom `TIMESTAMPTZ` seperti `measured_at`: semantiknya jelas, presisinya sesuai waktu pengukuran, dan indeks dapat dirancang untuk query rentang waktu. Salah satu [benchmark PostgreSQL 18](https://fabwaseem.com/blog/uuidv7-postgres) menunjukkan perbedaan rencana query ini.

TimescaleDB mendukung UUIDv7 sebagai kolom partisi waktu. Pilih ini hanya jika waktu pembentukan ID memang waktu yang ingin dipakai untuk membagi data. Untuk sensor yang dapat mengirim data terlambat, `measured_at` biasanya lebih tepat sebagai dimensi waktu.

## Aturan primary key pada hypertable

Pada hypertable yang dipartisi menurut `measured_at`, setiap unique index harus menyertakan kolom partisi. Maka primary key `(id, measured_at)` memenuhi aturan TimescaleDB, tetapi database hanya menegakkan keunikan pasangan itu; ia tidak menegakkan `id` unik secara global sendirian.

Jika sistem membutuhkan constraint global `UNIQUE(id)`, tentukan desain itu sebelum membuat hypertable. Pilih kolom UUIDv7 sebagai dimensi waktu jika maknanya sesuai, atau simpan ID pada tabel registry biasa yang menegakkan keunikan global dan hubungkan pembacaan ke ID tersebut. Jangan menganggap primary key `id` tunggal akan tetap berlaku setelah tabel dipartisi menurut kolom waktu lain.

## Memilih UUIDv4 atau UUIDv7

Gunakan UUIDv4 ketika ID acak lebih penting daripada urutan waktu, misalnya sebagai kunci nama objek berkas. Simpan nama asli berkas secara terpisah sebagai metadata. Untuk ID akun, UUIDv4 dapat dipilih agar ID tidak memperlihatkan perkiraan umur akun; UUIDv7 juga bisa dipakai jika urutan waktu berguna dan informasi itu boleh terlihat. Ini pilihan desain, bukan aturan universal.

PostgreSQL menyediakan `uuidv4()` dan `uuidv7()` mulai versi 18. Di versi lebih lama, `uuidv7()` bawaan tidak tersedia; generator perlu disediakan aplikasi atau extension yang sesuai. Periksa versi server sebelum memakai fungsi tersebut.

## Membaca perbandingan dan benchmark

RFC 9562 dan dokumentasi PostgreSQL menjelaskan format dan perilaku UUID; benchmark mengukur hasil pada perangkat, ukuran data, dan pola akses tertentu. Jangan memindahkan persentase dari satu benchmark menjadi janji umum.

- [RFC 9562: UUID](https://www.rfc-editor.org/rfc/rfc9562.html) — standar format, versi, sorting, dan pertimbangan privasi.
- [PostgreSQL 18: fungsi UUID](https://www.postgresql.org/docs/18/functions-uuid.html) — `uuidv4()`, `uuidv7()`, dan ekstraksi timestamp.
- [UUIDv4 vs UUIDv7 pada PostgreSQL 18, 10 juta baris](https://fabwaseem.com/blog/uuidv7-postgres) — mencatat versi PostgreSQL, ukuran data, WAL, ukuran indeks, dan hasil insert; angka hanya berlaku pada konfigurasi uji penulis.
- [UUIDv4 vs UUIDv7 pada beban insert PostgreSQL skala besar](https://postgres.ai/blog/20261105-uuidv4-vs-uuidv7) — membandingkan beberapa kunci pada ukuran data dan batas memori berbeda, serta menunjukkan bahwa jarak kinerja berubah ketika indeks melewati memori.
- [Aturan unique index TimescaleDB](https://github.com/timescale/docs/blob/latest/use-timescale/hypertables/hypertables-and-unique-indexes.md) — batasan indeks unik pada hypertable.

[Kembali ke Overview Database](overview.md)

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-database:</span> **Time-Series dan TimescaleDB** <span class="ai-practice-description">Pelajari bagaimana waktu pengukuran dipakai untuk membagi dan membaca data.</span>](timeseries.md){ .ai-practice-start }

</div>
