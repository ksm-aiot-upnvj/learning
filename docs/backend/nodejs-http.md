# Node.js dan HTTP

!!! note "AI Generated"

    Kartu What's next pada halaman ini disusun dengan bantuan AI.

Browser menjalankan JavaScript untuk membuat halaman interaktif. **Node.js** menjalankan JavaScript di luar browser, termasuk untuk membuat server.

## Siapkan proyek

Pasang Node.js versi LTS dari [situs resmi Node.js](https://nodejs.org/). Periksa instalasi di terminal:

```console
node --version
npm --version
```

Buat folder dan package proyek:

```console
mkdir mini_backend
cd mini_backend
npm init -y
```

`npm` mengelola package JavaScript. Perintah `npm init -y` membuat `package.json`, yang mencatat identitas proyek dan dependensinya.

## Apa yang terjadi pada request HTTP?

Client mengirim **method**, **path**, header, dan kadang body. Server memilih tindakan berdasarkan method dan path, lalu mengirim status serta response.

| Bagian | Contoh | Arti |
| --- | --- | --- |
| Method | `GET` | meminta data |
| Method | `POST` | mengirim data baru |
| Path | `/sensors` | resource yang dituju |
| Header | `Content-Type: application/json` | format body |
| Status | `200`, `201`, `404` | hasil pemrosesan |
| Body | `{"value": 28.5}` | data yang dikirim atau dibalas |

HTTP adalah cara komunikasi antara device, frontend, dan API. Ringkasan method dan status ada di [HTTP Basics](../protocol/http.md).

## Dari Node.js ke Express

Node.js menyediakan runtime dan API server tingkat rendah. Express menambahkan cara ringkas untuk mendaftarkan route dan middleware. Pada materi ini, Express menjadi alat untuk menerapkan konsep HTTP yang sudah dipelajari.

Lanjutkan ke [API dengan Express.js](express-api.md).

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-server:</span> **API dengan Express.js** <span class="ai-practice-description">Daftarkan route berdasarkan metode dan alamat HTTP.</span>](express-api.md){ .ai-practice-start }

</div>
