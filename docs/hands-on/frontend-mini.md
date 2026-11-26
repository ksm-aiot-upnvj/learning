# Frontend Mini

!!! note "AI Generated"

    Langkah menjalankan halaman lokal dan jalur menuju Vue diperbarui dengan bantuan AI.

Di latihan ini, buat tombol yang memeriksa apakah Backend Mini bisa dihubungi. Hasilnya tampil sebagai JSON atau pesan gagal. Daftar pembacaan sensor dibuat di [Dashboard Hands-on](dashboard-hands-on.md).

## Isi Halaman

Tombol **Refresh** menjalankan fungsi `loadHealth`. Elemen `<pre>` menampilkan status pengambilan data, hasil, atau kesalahan.

## Buat File HTML

Buat folder dan file. Jika folder sudah ada, cukup buat `index.html` di dalamnya.

```powershell
mkdir mini_frontend
Set-Location mini_frontend
New-Item index.html
```

Isi:

```html
<!doctype html>
<html lang="id">
  <head>
    <meta charset="UTF-8" />
    <title>Dashboard Sensor Mini</title>
  </head>
  <body>
    <h1>Dashboard Sensor Mini</h1>
    <button id="refresh">Refresh</button>
    <pre id="output">Belum ada data.</pre>

    <script>
      const output = document.querySelector("#output");
      const button = document.querySelector("#refresh");

      async function loadHealth() {
        output.textContent = "Mengambil data...";

        try {
          const response = await fetch("http://127.0.0.1:8000/health");
          if (!response.ok) throw new Error(`HTTP ${response.status}`);
          const data = await response.json();
          output.textContent = JSON.stringify(data, null, 2);
        } catch (error) {
          output.textContent = "Gagal mengambil data dari backend.";
        }
      }

      button.addEventListener("click", loadHealth);
    </script>
  </body>
</html>
```

## Jalankan Halaman

Jalankan Backend Mini dan siapkan [uv](https://docs.astral.sh/uv/getting-started/installation/). Di terminal lain, dari folder `mini_frontend`, jalankan `uv run --no-project python -m http.server 5500 --bind 127.0.0.1`. Buka `http://127.0.0.1:5500` di browser.

Klik tombol **Refresh**.

Kalau muncul:

```json
{
  "status": "ok"
}
```

frontend berhasil memeriksa backend. Matikan Backend Mini, lalu klik **Refresh** untuk melihat pesan gagal.

## Ubah Teks Tombol

Ubah teks tombol:

```html
Refresh
```

menjadi:

```html
Cek Backend
```

Perubahan ini mengubah teks yang dilihat pengguna.

## Menuju Vue

Pada halaman ini, tombol membaca status dari `/health`. Di [Dashboard Hands-on](dashboard-hands-on.md#jalankan-dashboard-vue), Vue memakai pola yang sama untuk mengambil daftar dari `/sensors` dan menampilkan satu baris per pembacaan.

Alur dasarnya tetap sama:

```text
tombol diklik -> frontend fetch API -> data tampil di layar
```

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Dashboard Hands-on** <span class="ai-practice-description">Setelah /health berhasil, tampilkan isi /sensors di Vue.</span>](dashboard-hands-on.md){ .ai-practice-start }

</div>
