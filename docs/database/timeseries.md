# Time-Series dan TimescaleDB

!!! note "AI Generated"

    Kartu What's next pada halaman ini disusun dengan bantuan AI.

Time-series adalah catatan yang memiliki urutan waktu, seperti suhu setiap menit. Kolom waktu harus menyatakan peristiwa yang ingin dianalisis. Pada data sensor, biasanya itu waktu pengukuran (`measured_at`), bukan waktu ID dibuat.

## Apa itu TimescaleDB?

TimescaleDB adalah ekstensi PostgreSQL untuk data time-series dan analitik. Aplikasi tetap memakai SQL dan tabel PostgreSQL. TimescaleDB menambahkan hypertable, pengelolaan chunk, columnstore, dan kebijakan otomatis untuk data yang menua. Mulailah dengan PostgreSQL biasa; tambahkan TimescaleDB saat pola data atau query memang membutuhkannya. [Pengenalan hypertable](https://docs.timescale.com/use-timescale/latest/hypertables/)

## Instalasi TimescaleDB

Pasang TimescaleDB sebagai langkah terpisah dari PostgreSQL. Pilih installer yang cocok dengan versi PostgreSQL atau jalankan image Docker resmi yang menyertakan TimescaleDB. Panduan resmi menyediakan jalur Windows dan Docker; untuk Docker, gunakan tag yang mencocokkan major version PostgreSQL. [Panduan instalasi self-hosted](https://www.tigerdata.com/docs/get-started/choose-your-path/install-timescaledb)

Setelah ekstensi tersedia di server dan kamu sudah masuk ke database yang dipakai, aktifkan ekstensi pada database tersebut:

```sql
CREATE EXTENSION IF NOT EXISTS timescaledb;
```

Periksa instalasi dari `psql` dengan `\dx`. `CREATE EXTENSION` tidak mengunduh atau memasang file ekstensi; file TimescaleDB harus sudah cocok dengan server PostgreSQL yang berjalan.

## Hypertable dan chunk

Hypertable tampak seperti tabel biasa, tetapi TimescaleDB membaginya menjadi chunk berdasarkan rentang waktu. Query dengan filter waktu dapat melewati chunk yang tidak relevan. Ukuran interval chunk perlu disesuaikan dengan volume data, indeks, dan rentang query; chunk terlalu kecil menambah pekerjaan perencanaan query.

![Pembagian data hypertable ke chunk waktu serta peran rowstore, columnstore, retensi, dan aggregate](../assets/images/timescale-chunks.svg)

TimescaleDB juga mendukung UUIDv7 sebagai kolom partisi waktu. Namun, untuk pembacaan sensor yang bisa datang terlambat, partisi menurut `measured_at` biasanya lebih sesuai karena chunk mengikuti waktu kejadian, bukan waktu ID dibuat. [Tipe kolom partisi hypertable](https://github.com/timescale/docs/blob/latest/use-timescale/hypertables/index.md)

Contoh berikut membuat hypertable baru berdasarkan waktu pengukuran. Tabel ini terpisah dari contoh PostgreSQL biasa di [Desain Data IoT](data-modeling.md): primary key menyertakan `measured_at` karena kolom itu menjadi partisi.

```sql
CREATE TABLE sensor_readings_ts (
  id UUID NOT NULL DEFAULT uuidv7(),
  device_id UUID NOT NULL,
  sensor_type TEXT NOT NULL,
  value DOUBLE PRECISION NOT NULL,
  measured_at TIMESTAMPTZ NOT NULL,
  ingested_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (id, measured_at)
) WITH (
  tsdb.hypertable,
  tsdb.partition_column = 'measured_at',
  tsdb.chunk_interval = '7 days',
  tsdb.columnstore = true,
  tsdb.segmentby = 'device_id',
  tsdb.orderby = 'measured_at DESC'
);
```

Sintaks `CREATE TABLE ... WITH (...)` tersedia pada TimescaleDB 2.20+. Pada versi yang lebih lama, cara membuat hypertable berbeda; ikuti dokumentasi yang sesuai dengan versi terpasang. [Referensi CREATE TABLE TimescaleDB](https://docs.timescale.com/api/latest/hypertable/create_table/)

## Columnstore dan kompresi

Data baru masuk ke rowstore, yang cocok untuk insert dan update. Data yang lebih lama dapat dipindahkan ke columnstore melalui kebijakan. Susunan kolom per segmen dan urutan data memengaruhi rasio kompresi serta query; pilih berdasarkan filter yang sering dipakai, misalnya `device_id` dan waktu.

Dokumentasi terbaru menyebut mesin row-columnar ini **Hypercore**. Hypertable yang dibuat dengan sintaks baru mengaktifkan columnstore dan membuat kebijakan bawaan. Pada contoh di atas, `device_id` menjadi `segmentby` karena query sering memilih satu perangkat; `measured_at DESC` mengatur urutan data di columnstore.

Untuk mengubah umur perpindahan dari nilai bawaan, hapus kebijakan yang ada lalu buat kebijakan baru. Contoh ini menunggu 30 hari:

```sql
CALL remove_columnstore_policy('sensor_readings_ts', if_exists => true);
CALL add_columnstore_policy('sensor_readings_ts', after => INTERVAL '30 days');
```

Tiga puluh hari hanya contoh. Atur umur perpindahan setelah melihat apakah data masih sering diperbarui atau dibaca sebagai baris individual. Periksa versi TimescaleDB karena kebijakan otomatis dan sintaksnya berubah antarversi. Lihat [cara kerja Hypercore](https://www.tigerdata.com/docs/learn/columnar-storage/understand-hypercore) dan [kebijakan columnstore](https://github.com/timescale/Tiger-Data-Docs/blob/main/src/content/docs/reference/timescaledb/hypercore/add_columnstore_policy.mdx).

## Retention policy

Retensi menentukan berapa lama data mentah disimpan. TimescaleDB menghapus chunk yang seluruh rentang waktunya sudah melewati batas; ia tidak menghapus baris satu per satu. Jika batas umur memotong chunk di tengah, chunk itu tetap dipertahankan. Akibatnya, beberapa baris yang lebih tua dari batas bisa tinggal sampai seluruh chunk melewati batas.

Contoh berikut menghapus chunk yang sepenuhnya lebih tua dari 90 hari:

```sql
SELECT add_retention_policy(
  'sensor_readings_ts',
  drop_after => INTERVAL '90 days'
);
```

Jangan salin angka 90 hari tanpa memeriksa kebutuhan analisis, aturan penyimpanan, dan backup. Penghapusan ini menghilangkan data mentah dari hypertable. Jika ringkasan perlu disimpan lebih lama, rancang continuous aggregate dan kebijakannya agar refresh tidak bergantung pada data mentah yang sudah dihapus. [Cara kerja retensi](https://www.tigerdata.com/docs/learn/data-lifecycle/data-retention/about-data-retention)

## Aturan unik dan primary key

Unique index pada hypertable harus menyertakan semua kolom partisi. Jika tabel dipartisi berdasarkan `measured_at`, primary key berikut memenuhi aturan partisi:

```sql
PRIMARY KEY (id, measured_at)
```

Tetapi pasangan itu hanya menjamin keunikan gabungan `id` dan `measured_at`, bukan keunikan `id` sendirian. Jika database harus menegakkan ID unik secara global, desain tabel dan strategi partisinya perlu diputuskan sebelum konversi. Lihat [aturan indeks unik TimescaleDB](https://docs.timescale.com/use-timescale/latest/hypertables/hypertables-and-unique-indexes/) dan [UUIDv4 dan UUIDv7](uuid-identifiers.md#aturan-primary-key-pada-hypertable).

## Continuous aggregate

Continuous aggregate menyimpan hasil ringkasan per interval. Contoh query biasa untuk rata-rata suhu per lima menit:

```sql
SELECT time_bucket('5 minutes', measured_at) AS interval_start,
       device_id,
       AVG(value) AS average_value
FROM sensor_readings_ts
WHERE sensor_type = 'temperature'
GROUP BY interval_start, device_id
ORDER BY interval_start;
```

Untuk contoh nilai `28.5`, `29.0`, dan `29.5 °C` dalam satu interval, rata-ratanya `29.0 °C`. Continuous aggregate dapat memperbarui ringkasan berkala sehingga dashboard tidak selalu menghitung ulang seluruh data mentah. Data mentah dan ringkasan memiliki masa simpan yang dapat berbeda.

## Kapan PostgreSQL biasa cukup?

Gunakan PostgreSQL biasa untuk mulai belajar, menguji skema, dan menyimpan data sensor dalam skala awal. Pertimbangkan TimescaleDB saat volume data, query rentang waktu, ringkasan berkala, atau pengelolaan masa simpan membuat partisi manual sulit. Ukur query pada pola data sendiri; TimescaleDB bukan kewajiban untuk setiap tabel yang memiliki kolom waktu.

[Kembali ke Overview Database](overview.md)

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-layout-dashboard:</span> **Frontend** <span class="ai-practice-description">Lanjutkan ke tampilan yang menyajikan pembacaan dari API.</span>](../frontend/overview.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Dashboard Hands-on** <span class="ai-practice-description">Coba alur dengan PostgreSQL biasa sebelum memperluas skema time-series.</span>](../hands-on/dashboard-hands-on.md)

</div>
