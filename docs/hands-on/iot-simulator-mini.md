# IoT Simulator Mini

!!! note "AI Generated"

    Tautan pemeriksaan pembacaan yang tersimpan diperbarui dengan bantuan AI.

Di modul ini kamu akan menggunakan script Python untuk mengirim data sensor ke backend. Tujuan dari script ini menggantikan perangkat ESP32 selama latihan ketika kalian tidak memiliki perangkat fisik.

## Data yang Dikirim

Script yang mengirim data:

```text
device_id: esp32-01
sensor_type: temperature
value: suhu contoh antara 25 dan 32
unit: celsius
```

## Buat Script Python

Buat file:

```text
mini_iot/send_sensor.py
```

Isi:

```python
import random
import urllib.request
import json

payload = {
    "device_id": "esp32-01",
    "sensor_type": "temperature",
    "value": round(random.uniform(25, 32), 2),
    "unit": "celsius",
}

request = urllib.request.Request(
    "http://127.0.0.1:8000/sensors",
    data=json.dumps(payload).encode("utf-8"),
    headers={"Content-Type": "application/json"},
    method="POST",
)

with urllib.request.urlopen(request) as response:
    print(response.read().decode("utf-8"))
```

## Jalankan Script

Pastikan Backend Mini hidup, lalu jalankan:

```console
uv run python mini_iot/send_sensor.py
```

Sebelum API dihubungkan ke database, respons berisi pesan “Data sensor diterima”. Setelah [Dashboard Hands-on](dashboard-hands-on.md), pesannya menjadi “Data sensor disimpan”. Gunakan `data.id` dari respons untuk [mencari baris yang sama di PostgreSQL](database-mini.md#cari-baris-dari-respons-api) dan mencocokkannya dengan tabel Vue.

## Kirim Data pH

Ubah `sensor_type`:

```python
"temperature"
```

menjadi:

```python
"ph"
```

Lalu ubah rentang random menjadi:

```python
random.uniform(5.5, 7.5)
```

Ubah juga `unit` dari `"celsius"` menjadi `"pH"`. Periksa bahwa respons menampilkan jenis `ph`, satuan `pH`, dan nilai di rentang contoh.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Dashboard Hands-on** <span class="ai-practice-description">Simpan kiriman simulator dan lacak ID-nya sampai tabel Vue.</span>](dashboard-hands-on.md){ .ai-practice-start }

</div>
