# JavaScript untuk Frontend

Nilai suhu sudah tersedia, tetapi tampilan dashboard belum berubah. JavaScript membaca nilai itu dan memperbarui teks di halaman ketika tombol ditekan. Browser menjalankan fungsi yang kita daftarkan untuk menangani klik tersebut.

## Simpan pembacaan sebagai object

Pembacaan sensor punya beberapa bagian yang saling terkait. Simpan ID perangkat, nilai, dan satuan sebagai properti dalam satu *object*, yaitu kumpulan nilai bernama. Dengan begitu, fungsi penampil dapat mengambil `value` dan `unit` dari pembacaan yang sama.

Nama properti pada contoh mengikuti [respons Backend Mini](../hands-on/backend-mini.md). Saat backend mengirim data lewat HTTP, bentuk teksnya disebut JSON. Setelah diurai di browser, data dapat diakses sebagai object JavaScript.

## Tampilkan pembacaan saat tombol ditekan

1. Buat berkas `sensor.html` di folder latihan.
2. Salin contoh berikut ke berkas tersebut.

    ```html
    <!doctype html>
    <html lang="id">
      <meta charset="utf-8">
      <title>Pembacaan sensor</title>
      <button id="tampilkan">Tampilkan suhu</button>
      <p id="hasil" aria-live="polite">Belum ada pembacaan.</p>

      <script>
        const sensor = {
          device_id: "esp32-01",
          sensor_type: "temperature",
          value: 28.5,
          unit: "celsius",
        };

        function formatSensor(reading) {
          return `${reading.device_id}: ${reading.value.toFixed(1)} ${reading.unit}`;
        }

        const tombol = document.querySelector("#tampilkan");
        const hasil = document.querySelector("#hasil");
        tombol.addEventListener("click", () => {
          hasil.textContent = formatSensor(sensor);
        });
      </script>
    </html>
    ```

3. Buka `sensor.html` di browser.
4. Klik **Tampilkan suhu**.
5. Periksa bahwa teks berubah menjadi `esp32-01: 28.5 celsius`.

`querySelector` memilih elemen sesuai ID. `addEventListener` menunggu klik, lalu `textContent` mengganti pesan dengan hasil dari `formatSensor`. Data latihan ada di dalam halaman, sehingga contoh dapat dijalankan tanpa menyiapkan server API.

## Periksa nilai yang salah tipe

Ubah `value` dari `28.5` menjadi `"28.5"`, lalu muat ulang halaman. Saat tombol ditekan, konsol browser melaporkan error karena `toFixed()` tersedia untuk angka. Kesalahan baru muncul saat fungsi dipanggil, sehingga perubahan tipe bisa terlewat ketika halaman baru dibuka.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-code-xml:</span> **TypeScript untuk Frontend** <span class="ai-practice-description">Nyatakan bahwa nilai sensor harus berupa angka. Periksa kesalahan tipe sebelum membuka dashboard.</span>](typescript.md){ .ai-practice-start }

</div>
