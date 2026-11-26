# TypeScript untuk Frontend

Pada [latihan JavaScript](javascript.md), fungsi penampil berhenti saat mendapat teks di tempat yang seharusnya berisi angka. TypeScript memungkinkan kita menyatakan tipe setiap properti, sehingga pemeriksa tipe bisa menemukan ketidaksesuaian di kode sebelum fungsi dipanggil.

## Nyatakan bentuk respons sensor

`SensorResponse` menggambarkan respons `POST /sensors` dari [Backend Mini](../hands-on/backend-mini.md). Tipe ini mencatat bahwa respons memuat pesan dan satu pembacaan. ID perangkat tetap teks, sedangkan `data.value` harus berupa angka agar fungsi bisa memakai `toFixed()`.

1. Siapkan Node.js dan npm.
2. Buka terminal di folder latihan.
3. Simpan contoh berikut sebagai `sensor-response.ts`.

    ```ts
    type SensorResponse = {
      message: string;
      data: {
        device_id: string;
        sensor_type: string;
        value: number;
        unit: string;
      };
    };

    const response: SensorResponse = {
      message: "Data sensor diterima",
      data: {
        device_id: "esp32-01",
        sensor_type: "temperature",
        value: 28.5,
        unit: "celsius",
      },
    };

    function formatSensor({ data }: SensorResponse): string {
      return `${data.device_id}: ${data.value.toFixed(1)} ${data.unit}`;
    }

    console.log(formatSensor(response));
    ```

4. Periksa tipe tanpa menghasilkan berkas JavaScript.

    ```console
    npx --yes --package typescript tsc --strict --noEmit sensor-response.ts
    ```

Perintah selesai tanpa pesan jika seluruh tipe cocok. Ubah `value` menjadi `"28.5"`, lalu ulangi pemeriksaan. Compiler menolak teks pada properti bertipe `number` sebelum fungsi dijalankan. [Opsi compiler TypeScript](https://www.typescriptlang.org/docs/handbook/compiler-options.html)

## Periksa data dari API saat aplikasi berjalan

Tipe dalam contoh berlaku pada kode yang diperiksa compiler. Saat dashboard menerima JSON lewat jaringan, respons masih bisa berubah, misalnya server mengirim `value` sebagai teks. Periksa isi respons sebelum memformat angka atau menampilkannya.

Server juga perlu memeriksa kiriman sebelum menyimpannya. Backend Mini memakai `typeof` dan mengembalikan status `400` jika bentuk input salah. Di browser, pemeriksaan saat respons diterima memungkinkan dashboard menampilkan pesan gagal yang bisa dibaca. [Type Assertions di TypeScript](https://www.typescriptlang.org/docs/handbook/2/everyday-types.html#type-assertions)

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-layout-dashboard:</span> **Vue Basics** <span class="ai-practice-description">Pindahkan tampilan data sensor ke komponen Vue. Lihat bagaimana perubahan data memperbarui antarmuka.</span>](vue-basics.md){ .ai-practice-start }

</div>
