# Validasi dan Middleware

!!! note "AI Generated"

    Penjelasan alur middleware dan uji validasi disusun dengan bantuan AI.

Middleware adalah fungsi yang berjalan di antara request masuk dan respons keluar. Fungsi itu bisa meneruskan request lewat `next()` atau langsung mengirim respons. Dengan cara ini, kita dapat memakai satu pemeriksaan pada beberapa handler.

Contohnya, API pendaftaran memeriksa field yang wajib diisi sebelum menyimpan akun. Jika satu field tidak valid, middleware dapat mengembalikan status 400 sehingga fungsi penyimpanan tidak dipanggil.

Di proyek AIoT, pemeriksaan yang sama melindungi handler `POST /sensors`. Pembacaan yang lolos dapat dibaca dari `req.sensor`, sehingga handler menerima empat field yang sudah diperiksa.

## Validasi input sensor

Buka [validate-sensor.cjs](../assets/demos/sensor-dashboard/validate-sensor.cjs) dari proyek [Backend Mini](../hands-on/backend-mini.md). Di `main.js`, route POST memasang `validateSensor` sebelum handler. Itu satu-satunya route POST untuk alamat `/sensors`.

Middleware menerima `device_id`, `sensor_type`, dan `unit` berupa teks yang tidak kosong, serta `value` berupa angka berhingga. Jika semua syarat terpenuhi, fungsi menyiapkan `req.sensor` dan memanggil `next()`. Jika syarat gagal, status 400 langsung dikirim.

Pemeriksaan ini menjaga bentuk data. Aturan seperti rentang pH dan kecocokan jenis sensor dengan satuan dapat ditambahkan saat kontrak aplikasinya membutuhkan aturan tersebut.

## CORS

Browser membedakan origin berdasarkan skema, host, dan port. Jika antarmuka berjalan di `http://127.0.0.1:5500` dan API di port `8000`, backend perlu mengizinkan origin antarmuka agar browser dapat membaca respons. Pemeriksaan akses berdasarkan akun tetap dilakukan di server sesuai kebutuhan aplikasi.

## Status yang dipakai

| Status | Kapan terlihat pada jalur latihan |
| --- | --- |
| `200` | GET berhasil. |
| `201` | POST valid menerima dan mengembalikan pembacaan. Pada Dashboard Hands-on, status diberikan setelah baris tersimpan. |
| `400` | Format pembacaan ditolak oleh middleware. |
| `404` | Alamat yang dipanggil tidak memiliki route yang cocok. |
| `500` | Terjadi kesalahan saat server menjalankan operasi. |

Uji payload lengkap dan payload tanpa `value` di [Backend Mini](../hands-on/backend-mini.md#uji-api-dengan-postman). Saat melanjutkan ke [Dashboard Hands-on](../hands-on/dashboard-hands-on.md), server memakai middleware yang sama sebelum menyimpan data.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-server:</span> **Asynchronous JavaScript** <span class="ai-practice-description">Lihat bagaimana handler menunggu query tanpa menahan request lain.</span>](async-javascript.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Backend Mini** <span class="ai-practice-description">Jalankan API untuk melihat perbedaan respons 201 dan 400.</span>](../hands-on/backend-mini.md)

</div>
