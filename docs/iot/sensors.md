# Sensor IoT

!!! note "AI Generated"

    Kartu navigasi di akhir halaman ini disusun dengan bantuan AI.

Sebelum memilih pin, lihat sinyal yang keluar dari sensor. DHT11 mengirim pesan digital, sensor kelembapan tanah bisa mengeluarkan tegangan, dan sensor aliran mengirim pulsa. Ketiganya memerlukan cara baca yang berbeda.

## Sensor DHT11

![Sensor DHT11](../images/dht11.png)

DHT11 mengirim suhu dalam °C dan kelembapan udara dalam persen kelembapan relatif (% RH) melalui pin DATA. Pustaka DHT membaca pesan itu. Buka Serial Monitor saat menjalankan [latihan DHT11](../hands-on/iot-hands-on.md#rangkaian-pemantau-suhu-dan-kelembapan) dan periksa kedua angka beserta satuannya.

Modul tiga pin biasanya bertanda VCC, DATA, dan GND. Sensor tanpa papan tambahan memiliki pin NC (tidak tersambung). Ikuti label pada modul dan periksa rangkaian pull-up pada DATA sebelum menyambungkannya ke board. Rentang ukur dan ketelitian mengikuti revisi sensor.

Rujukan [manual DHT11 terbitan Aosong](https://akizukidenshi.com/goodsaffix/DHT11_20180119.pdf).

## Soil Moisture Sensor

![Soil Moisture Sensor](../images/soil_moisture_sensor.png)

Pada modul probe dengan komparator LM393 yang memiliki dua keluaran, **A0** mengeluarkan tegangan dan **D0** mengeluarkan HIGH atau LOW berdasarkan ambang yang diatur pada modul. Periksa label dan spesifikasi modul yang kamu pegang. Arah perubahan tegangan dan level aktif D0 dapat berbeda.

1. Cek tegangan maksimum A0 terhadap rentang input ADC board. Pada ESP32 klasik yang memakai Wi-Fi, pilih pin ADC1.
2. Baca A0 dengan `analogRead()`. Arduino Uno R3 mengembalikan angka 0–1023 pada 10 bit. Pada Arduino-ESP32, pengaturan 12 bit menghasilkan 0–4095. Angka ini adalah hasil ADC, dengan setelan rentang tegangan yang ditentukan board.
3. Catat hasil baca untuk dua kondisi yang kamu tetapkan, misalnya tanah kering dan tanah lembap. Gunakan tanah dan kedalaman probe yang sama. Jika hasil kering 3000 dan lembap 1500, pembacaan 2250 berada di tengah kedua titik tersebut. Angka 50% dari skala ini berarti separuh rentang kalibrasi. Untuk mengukur kadar air tanah secara fisik, gunakan metode kalibrasi yang sesuai.

Rujukan [ADC Arduino Uno](https://docs.arduino.cc/learn/microcontrollers/analog-input), [ADC Arduino-ESP32](https://docs.espressif.com/projects/arduino-esp32/en/latest/api/adc.html), dan [ESP32 Series Datasheet](https://documentation.espressif.com/esp32_datasheet_en.html).

## Ultrasonic Sensor (HC-SR04)

![Ultrasonic Sensor](../images/ultrasonic_sensor.png)

HC-SR04 varian 5 V mengukur waktu tempuh suara. Pin TRIG menerima pulsa HIGH minimal 10 µs. Modul mengirim gelombang, lalu durasi HIGH pada ECHO menunjukkan waktu pergi-pulang gelombang.

`jarak_cm ≈ durasi_ECHO_µs × 0,034 ÷ 2`

Jika ECHO bertahan 1.000 µs, jarak perkiraannya 17 cm. Ketika tidak ada pulsa sebelum batas waktu, catat hasil sebagai tidak terbaca.

HC-SR04 5 V punya VCC, GND, TRIG, dan ECHO. Sebelum menghubungkan ECHO ke ESP32 yang berlogika 3,3 V, periksa level keluaran modul dan gunakan penyesuai level bila keluaran melebihi batas GPIO. Cocokkan juga level TRIG yang diterima modul.

Rujukan [datasheet HC-SR04 dari ElecFreaks](https://cdn.sparkfun.com/datasheets/Sensors/Proximity/HCSR04.pdf) dan [karakteristik listrik ESP32](https://documentation.espressif.com/esp32_datasheet_en.html).

## Sensor pH Air

![pH Sensor](../images/ph-sensor.png)

Probe mengukur keasaman larutan melalui modul pengondisi sinyal. Gunakan prosedur kalibrasi modul. Sebagai contoh, DFRobot SEN0161-V2 menggunakan dua larutan buffer untuk menghubungkan tegangan dengan nilai pH. Untuk modul lain, cek label keluaran dan panduan kalibrasinya sebelum memakai rumus dari contoh kode.

Rentang ukur pH pada spesifikasi memberi tahu nilai yang bisa dibaca. Tentukan pH target hidroponik berdasarkan tanaman dan kebutuhan larutan nutrisi.

Rujukan [panduan pH DFRobot SEN0161-V2](https://wiki.dfrobot.com/sen0161-v2).

## Sensor TDS (Total Dissolved Solids)

![TDS Sensor](../images/tds-sensor.png)

Modul TDS memperkirakan jumlah zat terlarut dari konduktivitas larutan dan menampilkan taksiran dalam ppm. Pada DFRobot SEN0244, program membaca tegangan keluaran, memperhitungkan suhu larutan, lalu mengubahnya menjadi taksiran TDS. Konversi dan kalibrasi mengikuti model modul. Angka TDS saja tidak menunjukkan jenis zat yang larut.

Rujukan [panduan TDS DFRobot SEN0244](https://wiki.dfrobot.com/sen0244).

## Sensor Water Flow

![Water Flow Sensor](../images/waterflow-sensor.png)

Sensor aliran jenis turbin mengeluarkan pulsa saat rotor berputar. Hitung pulsa dalam selang waktu tertentu untuk memperoleh frekuensi, kemudian gunakan faktor konversi varian sensor.

Pada contoh [sensor G1/2 inci dari Seeed Studio](https://wiki.seeedstudio.com/G1_and_2_inch_Water_Flow_Sensor/), hubungan hasil uji horizontal adalah `f = 7,5 × Q` dengan frekuensi dalam Hz dan laju `Q` dalam L/menit. Jika terhitung 30 pulsa selama 2 detik, frekuensinya 15 Hz dan lajunya diperkirakan 2 L/menit.

Untuk mengukur volume, hitung jumlah pulsa selama cairan mengalir dan gunakan faktor pulsa per liter. Bandingkan dengan volume yang ditampung untuk memeriksa kalibrasi. Periksa juga tegangan kabel sinyal sebelum memasangnya ke GPIO.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Praktik baca sensor** <span class="ai-practice-description">Cocokkan suhu dan kelembapan DHT11 dengan angka di Serial Monitor.</span>](../hands-on/iot-hands-on.md#rangkaian-pemantau-suhu-dan-kelembapan){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-zap:</span> **Kenali aktuator** <span class="ai-practice-description">Jika pembacaan perlu memicu tindakan, lihat cara mikrokontroler mengendalikan buzzer atau pompa DC.</span>](actuators.md)

</div>
