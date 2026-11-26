# Protokol Komunikasi

!!! note "AI Generated"

    Penjelasan pembuka, peta protokol, dan jalur belajar pada halaman ini disusun dengan bantuan AI.

Protokol komunikasi adalah aturan yang disepakati agar dua aplikasi bisa bertukar pesan. Aturan ini memberi tahu pengirim cara menyusun pesan dan membantu penerima memahami apa yang perlu dilakukan setelah pesan tiba.

Dalam pengembangan perangkat lunak, aturan itu bergantung pada cara aplikasi berinteraksi. Browser yang membuka halaman web mengirim permintaan lalu menerima balasan. Aplikasi percakapan dapat membuka koneksi yang tetap siap menerima pesan baru dari server.

Di proyek AIoT, pilihan protokol juga bergantung pada cara data dipakai. Satu pembacaan suhu dapat dikirim ke API, diteruskan ke aplikasi yang berlangganan, atau ditampilkan di panel pemantauan yang terus terhubung. Tabel berikut memasangkan tiap protokol dengan tugas yang akan ditemui di modul.

## Pilih sesuai tugas

| Teknologi | Kapan dipakai pada contoh sensor |
| --- | --- |
| [HTTP (Hypertext Transfer Protocol)](http.md) | ESP32 mengirim satu pembacaan ke API dan memeriksa kode status respons. |
| [SSE (Server-Sent Events)](http.md#server-sent-events-sse) | Backend mengalirkan pembaruan suhu ke browser melalui satu respons HTTP. |
| [MQTT (Message Queuing Telemetry Transport)](mqtt.md) | Broker meneruskan pembacaan ke aplikasi yang berlangganan topik sensor. |
| [WebSocket](websocket.md) | Dashboard menerima beberapa pembaruan melalui koneksi yang tetap terbuka. |
| [CoAP (Constrained Application Protocol)](coap.md) | Perangkat atau gateway yang terbatas bertukar pesan dengan header ringkas melalui UDP pada contoh ini. |
| [BLE (Bluetooth Low Energy)](ble.md) | Ponsel di dekat sensor membaca suhu langsung dan menerima notifikasi dari perangkat. |
| [LoRaWAN](lorawan.md) | Sensor di lokasi jauh mengirim pembacaan melalui gateway radio yang terhubung ke jaringan LoRaWAN. |

Jika baru mulai, kirim satu request HTTP dan lihat responsnya. Saat data perlu diterima beberapa aplikasi sekaligus, coba MQTT untuk melihat peran broker dan topik.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-server:</span> **Kirim data dengan HTTP** <span class="ai-practice-description">Ikuti request dari sensor atau simulator sampai API mengembalikan status.</span>](http.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-network:</span> **Terima pesan dengan MQTT** <span class="ai-practice-description">Gunakan broker jika beberapa aplikasi perlu menerima pembacaan dari topik yang sama.</span>](mqtt.md)

</div>
