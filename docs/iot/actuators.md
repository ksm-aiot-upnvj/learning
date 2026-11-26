# Aktuator

!!! note "AI Generated"

    Kartu navigasi di akhir halaman ini disusun dengan bantuan AI.

Pada latihan IoT, GPIO mengirim perintah, misalnya menghidupkan buzzer atau meminta pompa menyala. Tentukan lebih dulu bagian yang menerima perintah dan bagian yang menyuplai daya ke beban.

## Buzzer

![Buzzer](../images/buzzer.png)

Buzzer aktif menghasilkan bunyi dengan catu DC sesuai spesifikasinya. Buzzer pasif memerlukan sinyal bolak-balik, misalnya gelombang kotak dengan frekuensi yang ingin didengar. Modul tiga pin umumnya punya VCC, GND, dan pin sinyal. Periksa tegangan, arus, serta level aktif modul sebelum menghubungkannya ke GPIO.

## Relay Module

![Relay](../images/relay.png)

Gunakan pompa DC tegangan rendah untuk latihan ini. Sisi kendali relay punya catu dan pin IN. Pada modul *active-low*, IN rendah mengaktifkan relay. Pada modul *active-high*, IN tinggi yang mengaktifkannya. Cek label, tegangan catu, dan level yang diterima IN pada modul.

Sisi beban punya tiga terminal. Dalam keadaan relay tidak aktif, COM tersambung ke NC dan terputus dari NO. Jika pompa harus mati saat relay tidak aktif, gunakan jalur COM–NO pada rangkaian pompa. Uji terlebih dahulu dengan beban dilepas dan amati apakah relay sempat aktif saat board dihidupkan atau direset. Periksa skema modul jika mengandalkan optocoupler untuk isolasi.

## Pompa DC (Mini Submersible Water Pump)

![Pompa DC](../images/pompa_dc.png)

Baca tegangan kerja dan arus pompa pada label atau lembar spesifikasinya. Pompa mengambil daya dari catu yang sesuai melalui relay atau driver. GPIO mengendalikan IN relay atau driver. Sertakan penanganan lonjakan tegangan untuk beban induktif menurut rangkaian driver yang dipakai.

Pada [latihan kendali pompa](../hands-on/iot-hands-on.md#rangkaian-kontrol-aktuator-dengan-relay), periksa perilaku relay tanpa pompa sebelum memasang beban. Spesifikasi arus dan debit pompa generik bergantung pada model.

## Motor Servo (Micro Servo SG90)

![Motor Servo](../images/servo.png)

Servo posisi menerima pulsa berulang. Lebar pulsa menentukan posisi yang diminta. Cocokkan kabel catu, ground, dan sinyal dengan lembar spesifikasi varian servo. Uji di sekitar posisi tengah lebih dahulu dan sesuaikan batas perangkat lunak dengan gerakan servo yang dipakai. Gunakan catu yang mampu menangani arus saat motor bergerak.

## Motor DC & Motor Driver (L298N)

![Motor DC](../images/motor-dc.png)

![Module L298N](../images/module-l298n.png)

L298 punya dua rangkaian H-bridge untuk mengubah arah arus pada motor. Pada modul yang umum, OUT1/OUT2 menuju motor pertama dan OUT3/OUT4 menuju motor kedua. IN1–IN4 menentukan arah dan ENA/ENB mengaktifkan kanal. Jika modul mendukungnya, pulsa pada ENA atau ENB dapat dipakai untuk mengatur kecepatan.

Angka 2 A per kanal pada datasheet chip adalah batas arus DC dengan kondisi termal yang perlu diperhatikan. Kapasitas modul bergantung pada pendinginan, tegangan jatuh pada driver, dan arus motor, termasuk saat motor tertahan. Periksa skema modul untuk menentukan fungsi pin 5 V dan jumper regulator sebelum memasang catu.

Rujukan [datasheet L298 dari STMicroelectronics](https://www.st.com/resource/en/datasheet/l298.pdf).

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Praktik kendali pompa DC** <span class="ai-practice-description">Periksa perubahan status relay sebelum memasang beban pompa.</span>](../hands-on/iot-hands-on.md#rangkaian-kontrol-aktuator-dengan-relay){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-network:</span> **Pilih protokol komunikasi** <span class="ai-practice-description">Jika data perlu keluar dari board, pilih cara mengirim pembacaan ke API atau broker.</span>](../protocol/overview.md)

</div>
