# API dengan Express.js

!!! note "AI Generated"

    Pembuka, penjelasan route, dan jalur uji Postman disusun dengan bantuan AI.

Express adalah pustaka Node.js untuk membuat aplikasi web dan API HTTP. Saat permintaan masuk, Express mencocokkan metode dan alamatnya dengan sebuah *route*. Fungsi yang menangani route itu membaca permintaan dan menentukan isi serta status respons.

Aplikasi web memakai pola ini untuk membaca atau mengirim data. Misalnya, layanan katalog dapat menjawab `GET /products` dengan daftar produk, sedangkan formulir dapat mengirim data ke server melalui POST.

Pada praktik AIoT, kita memakai `GET /health` untuk memeriksa server dan `POST /sensors` untuk menerima pembacaan. Keduanya ada di satu proyek [Backend Mini](../hands-on/backend-mini.md), sehingga proyek yang sama bisa dilanjutkan sampai PostgreSQL.

## Baca satu route

```js
app.get("/health", (req, res) => {
  res.json({ status: "ok" });
});
```

`app.get` memasangkan metode GET dan path `/health` dengan fungsi yang dipanggil saat permintaan cocok. Fungsi ini menerima `req` untuk membaca permintaan dan `res` untuk mengirim respons. `res.json()` mengirim objek sebagai JSON.

Route POST membaca data yang dikirim lewat body. `express.json()` memproses body sebelum handler dijalankan, sehingga data tersedia di `req.body`. Middleware validasi memeriksa bentuk data itu sebelum handler memakainya. [Validasi dan Middleware](validation-middleware.md)

## Uji API dengan Postman

Postman adalah client API yang bisa mengirim request dan menampilkan status, header, serta isi respons. Pengembang dapat memeriksa API secara langsung saat antarmuka web masih dibuat. Alat ini juga membantu membandingkan respons dari dua kiriman yang berbeda. [Pengantar Postman](https://learning.postman.com/docs/getting-started/quick-start/)

Di [Backend Mini](../hands-on/backend-mini.md#uji-api-dengan-postman), kirim GET untuk melihat apakah server merespons. Lalu kirim POST dengan JSON lengkap dan ulangi dengan satu field dihapus agar perbedaan hasil validasi terlihat.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-list-checks:</span> **Validasi dan Middleware** <span class="ai-practice-description">Periksa body JSON sebelum handler memakai datanya.</span>](validation-middleware.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Uji API dengan Postman** <span class="ai-practice-description">Bandingkan respons GET, POST valid, dan POST yang ditolak.</span>](../hands-on/backend-mini.md#uji-api-dengan-postman)

</div>
