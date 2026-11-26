# JavaScript Fundamental untuk Backend

!!! note "AI Generated"

    Kartu What's next pada halaman ini disusun dengan bantuan AI.

Backend memakai JavaScript untuk membaca request, menjalankan aturan aplikasi, dan menyusun response. Contoh berikut memakai pembacaan sensor yang nanti dikirim ke API.

## Variabel dan tipe data

```js
const deviceId = "esp32-01";
let value = 28.5;
const isOnline = true;

console.log(deviceId, value, isOnline);
```

Gunakan `const` jika nama variabel tidak akan menunjuk ke nilai lain. Gunakan `let` jika nilainya akan diperbarui. Nilai dasarnya mencakup `string`, `number`, `boolean`, `null`, dan `undefined`.

## Object dan array

Object menyimpan satu pembacaan sebagai pasangan nama dan nilai. Array menyimpan banyak pembacaan.

```js
const reading = {
  device_id: "esp32-01",
  sensor_type: "temperature",
  value: 28.5,
  unit: "celsius",
};

const readings = [reading, { ...reading, value: 29.1 }];
console.log(readings[0].value); // 28.5
```

JSON dari device atau frontend biasanya menjadi object JavaScript setelah dibaca server.

## Kondisi dan perulangan

```js
if (reading.value > 30) {
  console.log("Suhu tinggi");
} else {
  console.log("Suhu normal");
}

for (const item of readings) {
  console.log(item.device_id, item.value);
}
```

## Fungsi

```js
function isHighTemperature(item) {
  return item.sensor_type === "temperature" && item.value > 30;
}

console.log(isHighTemperature(reading)); // false
```

Fungsi memberi nama pada satu proses agar dapat dipakai ulang. Express akan memanggil fungsi handler ketika route menerima request.

## Error dasar

```js
try {
  const payload = JSON.parse('{"value": 28.5}');
  console.log(payload.value);
} catch (error) {
  console.error("JSON tidak bisa dibaca:", error.message);
}
```

`try` menjalankan kode yang mungkin gagal. `catch` menangani kegagalan itu supaya proses dapat memberi respons yang sesuai.

Berikutnya, pelajari bagaimana JavaScript berjalan di server melalui [Node.js dan HTTP](nodejs-http.md).

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-server:</span> **Node.js dan HTTP** <span class="ai-practice-description">Jalankan JavaScript di server dan lihat bagaimana server membalas request.</span>](nodejs-http.md){ .ai-practice-start }

</div>
