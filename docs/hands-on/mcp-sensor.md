# Praktik MCP dengan Data Sensor PostgreSQL

!!! note "AI Generated, need human review"

    Materi dan script latihan menunggu tinjauan manusia.

Dua perangkat mengirim pH dan suhu. Perangkat pertama masih aktif pada akhir periode, sedangkan perangkat kedua berhenti lebih awal. Tool MCP membaca data yang sama dengan query SQL sehingga hasilnya dapat diperiksa tanpa meminta model menebak kondisi perangkat.

Server latihan memakai `FastMCP` dari SDK MCP Python. Dua tool bacanya mengikuti pola pembacaan terakhir dan ringkasan pada Smart Hydroponic MCP, dengan data sintetis dan transport `stdio`. [Hubungan dengan Smart Hydroponic MCP](../ai/ai-systems/mcp.md#hubungan-dengan-smart-hydroponic-mcp)

## Siapkan proyek dan database

Script memakai tabel perangkat dan pembacaan dari materi [Desain Data IoT](../database/data-modeling.md). Data latihan masuk ke skema `mcp_lab` dengan ID yang tetap, sehingga seeding ulang mempertahankan jumlah baris.

1. Siapkan Docker, Node.js 24.22.1 atau versi 24.x yang lebih baru, dan `uv`.
2. Buat folder latihan kosong.
3. Simpan [sensor_data.py](../assets/ai-labs/sensor_data.py) ke folder latihan.
4. Simpan [seed_sensors.py](../assets/ai-labs/seed_sensors.py) ke folder latihan.
5. Simpan [sensor_mcp.py](../assets/ai-labs/sensor_mcp.py) ke folder latihan.
6. Buka PowerShell tanpa profil di folder latihan.
7. Inisialisasi proyek Python.

    ```powershell
    uv init --bare
    ```

8. Pasang SDK MCP dan driver PostgreSQL.

    ```powershell
    uv add "mcp>=1,<2" "psycopg[binary]>=3,<4"
    ```

9. Jalankan PostgreSQL khusus latihan.

    ```powershell
    $labPassword = [guid]::NewGuid().ToString('N')
    docker run --rm -d --name aiot-mcp-lab -p 127.0.0.1:55432:5432 -e "POSTGRES_PASSWORD=$labPassword" -e POSTGRES_DB=sensor_lab postgres:18
    ```

10. Jika database masih memulai, ulangi pemeriksaan hingga muncul `accepting connections`.

    ```powershell
    docker exec aiot-mcp-lab pg_isready -h 127.0.0.1 -U postgres -d sensor_lab
    ```

11. Simpan koneksi database ke `sensor-lab.env` di folder latihan.

    ```powershell
    "SENSOR_LAB_DSN=postgresql://postgres:${labPassword}@127.0.0.1:55432/sensor_lab" |
        Set-Content -LiteralPath sensor-lab.env -Encoding utf8NoBOM
    ```

12. Buat CSV data sensor.

    ```powershell
    uv run python sensor_data.py
    ```

13. Jalankan seeding.

    ```powershell
    uv run --env-file sensor-lab.env python seed_sensors.py
    ```

14. Ulangi seeding untuk memeriksa bahwa jumlahnya tetap 58.

    ```powershell
    uv run --env-file sensor-lab.env python seed_sensors.py
    ```

Container menerima sambungan dari mesin lokal. Script MCP membuka transaksi baca dan membatasi waktu query. Jika praktik diadaptasi ke deployment bersama, pisahkan akun seeding dari akun MCP yang hanya punya izin baca.

Berkas `sensor-lab.env` memuat kata sandi sesi latihan. Simpan di folder lokal agar `uv` dapat meneruskannya ke script ketika proses itu dimulai dari Inspector.

## Panggil tool dengan MCP Inspector

1. Jalankan [MCP Inspector](https://modelcontextprotocol.io/docs/tools/inspector) dari folder latihan.

    ```powershell
    npx.cmd @modelcontextprotocol/inspector@2.16.0 uv run --env-file sensor-lab.env python sensor_mcp.py
    ```

2. Buka alamat yang ditampilkan Inspector.
3. Hubungkan server dengan transport `stdio`.
4. Buka **Tools**.
5. Jalankan tool dengan parameter pada tabel.

| Pertanyaan | Tool dan parameter | Hasil yang diharapkan |
| --- | --- | --- |
| Berapa pH terakhir perangkat A? | `get_latest_reading` dengan `esp32-01` dan `ph` | `7.0 pH` pada `01:20 UTC`, status `ok` |
| Ringkas pH perangkat A dari pukul 00:00 sampai 01:25 UTC. | `summarize_readings` dengan `esp32-01`, `ph`, awal `2026-11-20T00:00:00Z` dan akhir `2026-11-20T01:25:00Z` | `count=17`, minimum `6.1`, maksimum `7.4`, rata-rata `6.388` |
| Apakah pembacaan terakhir perangkat B masih baru? | `get_latest_reading` dengan `esp32-02` dan `ph` | `6.2 pH` pada `00:55 UTC`, status `stale` |

Waktu acuan latihan adalah `01:25 UTC`. Tool memberi status `stale` jika pembacaan berumur lebih dari 15 menit, sehingga peserta bisa mengulang skenario di hari yang berbeda. Coba perangkat `esp32-99` untuk melihat penolakan argumen.

## Cocokkan hasil dengan SQL

Jalankan query berikut dari PowerShell lain ketika Inspector masih terbuka. Filter periode memakai batas awal inklusif dan batas akhir eksklusif, sehingga sampel pada batas akhir dapat masuk ke periode berikutnya tepat satu kali.

```powershell
@'
SET TIME ZONE 'UTC';
SELECT DISTINCT ON (d.name) d.name, r.value, r.unit, r.measured_at
FROM mcp_lab.sensor_readings AS r JOIN mcp_lab.devices AS d ON d.id = r.device_id
WHERE r.sensor_type = 'ph' AND r.measured_at <= '2026-11-20 01:25:00+00'
ORDER BY d.name, r.measured_at DESC, r.id DESC;

SELECT count(*), min(r.value), max(r.value), round(avg(r.value)::numeric, 3)
FROM mcp_lab.sensor_readings AS r JOIN mcp_lab.devices AS d ON d.id = r.device_id
WHERE d.name = 'esp32-01' AND r.sensor_type = 'ph'
  AND r.measured_at >= '2026-11-20 00:00:00+00'
  AND r.measured_at < '2026-11-20 01:25:00+00';
'@ | docker exec -i aiot-mcp-lab psql -v ON_ERROR_STOP=1 -U postgres -d sensor_lab
```

Jika nanti memakai aplikasi AI sebagai host, ajukan tiga pertanyaan yang sama dan bandingkan jawaban dengan hasil tool. Database menghitung angka, sedangkan model menjelaskan hasilnya. [SDK MCP Python 1.x](https://github.com/modelcontextprotocol/python-sdk/tree/v1.x) · [Parameter query Psycopg](https://www.psycopg.org/psycopg3/docs/basic/params.html)

## Akhiri latihan

1. Hentikan Inspector dengan `Ctrl+C`.
2. Hentikan container latihan.

    ```powershell
    docker stop aiot-mcp-lab
    ```

3. Hapus berkas koneksi latihan.

    ```powershell
    Remove-Item -LiteralPath sensor-lab.env
    ```
