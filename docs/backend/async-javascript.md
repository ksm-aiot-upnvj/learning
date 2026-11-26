# Asynchronous JavaScript

!!! note "AI Generated"

    Kartu What's next pada halaman ini disusun dengan bantuan AI.

Server sering menunggu operasi yang lebih lambat daripada perhitungan biasa, seperti query database atau request ke layanan AI. JavaScript memakai Promise dan `async`/`await` untuk menulis alur tunggu itu dengan jelas.

## Menunggu operasi

```js
async function loadSensors() {
  const response = await fetch("http://127.0.0.1:8000/sensors");
  if (!response.ok) {
    throw new Error(`HTTP ${response.status}`);
  }
  return response.json();
}
```

`await` menunggu Promise selesai sebelum memakai hasilnya. Selama operasi I/O menunggu, Node.js dapat menangani pekerjaan lain. Ini bukan berarti perhitungan CPU berat otomatis menjadi lebih cepat.

## Lab antrean dan event loop

Bandingkan dua request pada satu event loop dengan mengubah durasi operasi I/O. Buka [Lab Async vs Sync](../labs/async-vs-sync.md){ .md-button } untuk menjalankan simulasi dan membandingkan waktu selesai setiap request.

## Tangani kegagalan

```js
try {
  const sensors = await loadSensors();
  console.log(sensors);
} catch (error) {
  console.error("Gagal mengambil data:", error.message);
}
```

Di route Express, gunakan `try`/`catch` ketika handler menunggu database atau API lain, lalu teruskan error ke middleware error. Tambahkan handler terakhir seperti ini agar client menerima JSON saat server gagal:

```js
app.use((error, req, res, next) => {
  console.error(error);
  res.status(500).json({ error: "Terjadi kesalahan pada server" });
});
```

Daftarkan middleware error setelah semua route. Jangan mengirim detail internal error ke client.

Untuk query PostgreSQL, driver menyediakan operasi asinkron. Lihat penggunaan database pada [Dashboard Hands-on](../hands-on/dashboard-hands-on.md). Materi ini membahas pola async; ia tidak menggantikan pemahaman tentang query atau transaksi.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-folder-tree:</span> **Struktur Proyek Backend** <span class="ai-practice-description">Ikuti request dari route ke fungsi yang mengolah data.</span>](project-structure.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Lab Async vs Sync** <span class="ai-practice-description">Bandingkan waktu respons saat beberapa request datang bersamaan.</span>](../labs/async-vs-sync.md)

</div>
