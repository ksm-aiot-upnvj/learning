# Microcontrollers

!!! note "AI Generated"

    Kartu navigasi di akhir halaman ini disusun dengan bantuan AI.

Microcontroller menggabungkan CPU, memori, dan periferal dalam satu chip. Dalam sistem IoT, microcontroller membaca sensor, mengolah data, lalu mengirim hasil atau mengendalikan aktuator.

[Buka Lab Pin →](../labs/iot-pin.md){ .md-button .md-button--primary }

Di lab kamu bisa memilih board, membuka detail tiap pin, dan menguji rancangan sambungan sebelum merangkai rangkaian.

## ESP32 (DevKit V1)

ESP32 klasik memiliki Wi-Fi 2,4 GHz, Bluetooth, GPIO 3,3 V, ADC 12-bit, dan dua kanal DAC. Lab mencakup susunan umum DevKit V1 30-pin dan DevKitC V4 38-pin dengan modul WROOM. Cocokkan label header dengan board yang dipakai, karena DevKit V1 memiliki beberapa varian.

- **ADC dan Wi-Fi.** Gunakan ADC1 untuk pengukuran saat Wi-Fi aktif. GPIO34, 35, 36, dan 39 yang tersedia pada kedua layout hanya bisa menjadi input dan memerlukan resistor eksternal jika butuh pull-up atau pull-down.
- **Boot dan flash.** Level GPIO0, 2, 5, 12, dan 15 dibaca saat reset. Pada DevKitC WROOM, GPIO6–11 dipakai untuk flash.
- **Rujukan resmi.** [ESP32 Series Datasheet](https://documentation.espressif.com/esp32_datasheet_en.html) · [Panduan dan susunan pin DevKitC V4](https://docs.espressif.com/projects/esp-idf/en/v4.4.7/esp32/hw-reference/esp32/get-started-devkitc.html)

## ESP8266 (NodeMCU 1.0)

ESP8266EX menyediakan Wi-Fi 2,4 GHz dan GPIO 3,3 V. NodeMCU memberi nama pin seperti D1 dan D2. D1 terhubung ke GPIO5 dan D2 ke GPIO4.

- **Analog.** Chip memiliki satu kanal ADC 10-bit. Masukan TOUT pada chip menggunakan rentang 0–1,0 V. NodeMCU 1.0 memiliki pembagi tegangan pada A0. Periksa skema board atau klon sebelum menghubungkan sensor.
- **Boot.** Untuk boot normal, GPIO0 dan GPIO2 harus tinggi, sedangkan GPIO15 harus rendah saat reset.
- **Rujukan resmi.** [ESP8266EX Datasheet](https://documentation.espressif.com/0a-esp8266ex_datasheet_en.html) · [Skema NodeMCU DevKit 1.0](https://github.com/nodemcu/nodemcu-devkit-v1.0)

## Arduino Uno R3

Arduino Uno R3 memakai ATmega328P 8-bit pada 16 MHz dengan logika 5 V. Board menyediakan 14 pin digital, enam keluaran PWM, dan enam masukan analog 10-bit.

- **Pin bersama.** D0/D1 dipakai UART USB, A4/A5 dipakai I²C, dan D10–D13 umum dipakai untuk SPI. Header SDA/SCL tersambung ke A4/A5, sehingga kedua label berbagi jalur fisik.
- **Level logika.** Saat menghubungkan perangkat 3,3 V, periksa toleransi kedua sisi dan gunakan penyesuai level bila perlu.
- **Rujukan resmi.** [Datasheet Uno R3](https://docs.arduino.cc/resources/datasheets/A000066-datasheet.pdf) · [Pinout resmi Uno R3](https://docs.arduino.cc/resources/pinouts/A000066-full-pinout.pdf) · [Datasheet ATmega328P](https://www.microchip.com/content/dam/mchp/documents/MCU08/ProductDocuments/DataSheets/ATmega48A-PA-88A-PA-168A-PA-328-P-DS-DS40002061B.pdf)

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-activity:</span> **Baca suhu dari sensor** <span class="ai-practice-description">Kenali pin data dan satuan pembacaan DHT11 sebelum mencoba rangkaian.</span>](sensors.md#sensor-dht11){ .ai-practice-start }

</div>
