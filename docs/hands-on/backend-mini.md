# Backend Mini dengan Express.js

!!! note "AI Generated"

    Alur latihan Express, contoh program, dan uji Postman disusun dengan bantuan AI.

API HTTP menerima permintaan lalu mengirim respons yang dapat dibaca oleh client. Dalam proyek perangkat lunak, endpoint kecil seperti `/health` membantu memeriksa server, sedangkan endpoint POST menerima data dari aplikasi lain.

Pada latihan AIoT ini, API menerima satu pembacaan sensor dan mengembalikan data yang lolos validasi. Penyimpanan ke PostgreSQL dilanjutkan di [Dashboard Hands-on](dashboard-hands-on.md).

## Endpoint

| Metode | Path | Hasil |
| --- | --- | --- |
| `GET` | `/health` | `200` dan `{"status":"ok"}`. |
| `POST` | `/sensors` | `201` dengan data yang diterima, atau `400` jika formatnya salah. |

## Buat proyek

1. Siapkan Node.js dan VS Code.
2. Buat folder `mini_backend`.
3. Buka folder tersebut di VS Code.
4. Buka terminal PowerShell di folder itu.
5. Inisialisasi proyek npm.

    ```powershell
    npm.cmd init -y
    ```

6. Pasang Express 5 dan middleware CORS.

    ```powershell
    npm.cmd install express@5 cors
    ```

7. Simpan [validate-sensor.cjs](../assets/demos/sensor-dashboard/validate-sensor.cjs) di folder proyek.
8. Buat berkas `main.js` di VS Code.
9. Isi `main.js` dengan kode berikut.

    ```js
    const express = require("express");
    const cors = require("cors");
    const validateSensor = require("./validate-sensor.cjs");

    const app = express();
    app.use(cors({ origin: "http://127.0.0.1:5500" }));
    app.use(express.json());

    app.get("/health", (req, res) => {
      res.json({ status: "ok" });
    });

    app.post("/sensors", validateSensor, (req, res) => {
      res.status(201).json({ message: "Data sensor diterima", data: req.sensor });
    });

    app.listen(8000, "127.0.0.1", () => {
      console.log("API berjalan di http://127.0.0.1:8000");
    });
    ```

10. Simpan perubahan dengan `Ctrl+S`.

`express.json()` membaca body JSON. `validateSensor` memeriksa input dan menyiapkan `req.sensor` sebelum handler mengirim balasan. [Validasi dan Middleware](../backend/validation-middleware.md)

## Jalankan server

Jalankan perintah berikut dari folder `mini_backend`. Biarkan server aktif saat melakukan pengujian dari Postman atau terminal lain.

```powershell
node main.js
```

## Uji API dengan Postman

Gunakan [Postman Desktop](https://www.postman.com/downloads/) agar request bisa menjangkau alamat lokal `127.0.0.1`. Panel respons menunjukkan status HTTP dan isi JSON setelah server membalas. [Mengirim request pertama](https://learning.postman.com/docs/getting-started/quick-start/)

### Periksa GET

1. Buka tab **HTTP Request**.
2. Pilih metode **GET**.
3. Masukkan `http://127.0.0.1:8000/health`.
4. Klik **Send**.

Respons yang diharapkan adalah `200 OK`. Nilai `ok` di body menunjukkan server bisa dijangkau sebelum kita mencoba mengirim data.

### Kirim POST dengan JSON

1. Buka tab **HTTP Request** baru.
2. Pilih metode **POST**.
3. Masukkan `http://127.0.0.1:8000/sensors`.
4. Buka tab **Body**.
5. Pilih **raw**.
6. Pilih **JSON** sebagai format.
7. Tempel payload berikut.

    ```json
    {
      "device_id": "esp32-01",
      "sensor_type": "temperature",
      "value": 28.5,
      "unit": "celsius"
    }
    ```

8. Klik **Send**.

Postman menambahkan header `Content-Type: application/json` saat format JSON dipilih. Pada respons `201 Created`, periksa bahwa `data.value` berisi `28.5` dan `data.unit` berisi `celsius`. [Body JSON di Postman](https://learning.postman.com/docs/use/send-requests/create-requests/parameters#raw-data)

### Uji input yang ditolak

1. Hapus properti `value` dari payload.
2. Kirim ulang request.

Pastikan tanda koma JSON tetap benar saat menghapus field. Respons `400 Bad Request` dengan pesan `Format data sensor tidak valid` menunjukkan bahwa middleware menolak kiriman sebelum handler menerima pembacaan.

### Uji lewat terminal

Jalankan perintah berikut dari terminal kedua jika ingin menggunakan PowerShell. Hasilnya dapat dibandingkan dengan kiriman valid di Postman.

```powershell
$body = @{ device_id = "esp32-01"; sensor_type = "temperature"; value = 28.5; unit = "celsius" } | ConvertTo-Json
Invoke-RestMethod -Method Post -Uri http://127.0.0.1:8000/sensors -ContentType application/json -Body $body
```

Kirim data otomatis lewat [IoT Simulator Mini](iot-simulator-mini.md) setelah request manual berhasil. Di [Dashboard Hands-on](dashboard-hands-on.md), hasil POST juga memuat ID baris yang disimpan.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-database:</span> **Siapkan tabel PostgreSQL** <span class="ai-practice-description">Buat tabel di database latihan yang akan dipakai Express.</span>](dashboard-hands-on.md#siapkan-tabel-latihan){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **IoT Simulator Mini** <span class="ai-practice-description">Ganti kiriman manual dengan data contoh dari Python.</span>](iot-simulator-mini.md)

</div>
