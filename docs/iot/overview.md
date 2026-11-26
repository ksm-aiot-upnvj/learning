# Internet of Things (IoT)

!!! note "AI Generated"

    Pengantar dan jalur belajar pada halaman ini disusun dengan bantuan AI.

Anggap sensor membaca suhu 26,7 °C di sekitar tanaman. Mikrokontroler membaca nilai itu dan bisa mengirimkannya ke backend. Backend dapat menyimpan riwayat, lalu dashboard menampilkan kapan suhu diukur dan berapa nilainya.

Perangkat juga bisa bereaksi terhadap pembacaan. Misalnya, ESP32 menyalakan buzzer ketika suhu melewati batas. Jika riwayatnya perlu diperiksa dari perangkat lain, kirim pembacaan ke jaringan agar backend dapat mengolahnya.

![Arsitektur IoT: device mengirim data ke backend, backend berhubungan dengan database dan dashboard](../assets/images/iot-architecture.svg)

## Pilih titik mulai

Jika tersedia ESP32 dan sensor, kenali pin board lalu periksa hasil pertama di Serial Monitor. Setelah angka dan satuannya jelas, [pilih protokol](../protocol/overview.md) untuk mengirim pembacaan.

Jika latihan dilakukan tanpa perangkat fisik, jalankan [Backend Mini](../hands-on/backend-mini.md#jalankan-server) terlebih dahulu. Setelah endpoint merespons, gunakan simulator untuk mengirim pembacaan sintetis melalui HTTP.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-cpu:</span> **Mulai dengan ESP32** <span class="ai-practice-description">Kenali pin pada board sebelum memasang sensor. Buka lab pin untuk melihat fungsi tiap pin.</span>](microcontrollers.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Mulai tanpa perangkat fisik** <span class="ai-practice-description">Siapkan Backend Mini, lalu kirim pembacaan suhu sintetis dan periksa respons API.</span>](../hands-on/iot-simulator-mini.md)

</div>
