# MQTT (Message Queuing Telemetry Transport)

!!! note "AI Generated"

    Revisi pembuka, sejarah, penjelasan struktur pesan, diagram, dan jalur belajar pada halaman ini disusun dengan bantuan AI.

MQTT adalah protokol pengiriman pesan dengan pola *publish–subscribe*. Aplikasi pengirim (*publisher*) menerbitkan pesan ke sebuah topik melalui broker, yaitu layanan perantara. Broker membaca topiknya dan meneruskan pesan ke aplikasi yang berlangganan (*subscriber*), sehingga satu kiriman dapat sampai ke beberapa penerima.

Pola ini berguna dalam sistem pemantauan karena aplikasi pengirim cukup mengetahui topik yang dipakai. Misalnya, layanan yang memproses antrean pekerjaan menerbitkan status pekerjaan ke broker, lalu panel operator dan layanan pencatatan menerima pembaruan dari langganan masing-masing.

Pada contoh AIoT di bab ini, ESP32 menerbitkan pembacaan suhu ke topik sensor. Panel pemantauan berlangganan topik itu, sehingga pembacaan baru dapat langsung ditampilkan saat pesan tiba.

## Sejarah singkat

OASIS menetapkan MQTT 3.1.1 sebagai standar pada 2014 dan menerbitkan MQTT 5.0 pada 2019. Model publish–subscribe tetap dipakai, sementara versi 5.0 menambah properti pada paket untuk membawa informasi seperti masa berlaku pesan. Diagram paket di bawah memakai MQTT 5.0. [OASIS MQTT 3.1.1](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html) · [OASIS MQTT 5.0](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html)

## Siklus publish-subscribe dalam proyek AIoT

1. Device terkoneksi ke broker MQTT.
2. Device publish data sensor ke topik tertentu.
3. Broker meneruskan pesan ke semua subscriber yang cocok.
4. Dashboard menampilkan data terbaru secara real-time.
5. Sistem kontrol dapat publish command ke topik aktuator.

### Diagram alur publish-subscribe MQTT

[![Dashboard berlangganan topik di broker, lalu menerima pembacaan yang diterbitkan ESP32.](../assets/images/mqtt-sensor-flow.svg)](../assets/images/mqtt-sensor-flow.svg)

## Struktur dasar pesan MQTT

Secara umum, saat publish pesan kita memperhatikan:

- Topic: jalur/logical channel pesan.
- Payload: isi data, biasanya JSON atau string sederhana.
- QoS: tingkat jaminan pengiriman pesan.
- Retain flag: apakah broker menyimpan pesan terakhir pada topik.

Contoh payload JSON yang dipublish:

```json
{
  "device_id": "esp32-01",
  "suhu": 26.7,
  "kelembapan": 56.3,
  "timestamp": "2026-04-17T08:30:00Z"
}
```

Contoh topik:

```text
hydroponic/sensor/esp32-01
```

Pada paket `PUBLISH`, *fixed header* menyebut tipe paket dan flag, termasuk QoS dan RETAIN. *Variable header* memuat nama topik pada contoh ini. Payload membawa pembacaan suhu, sehingga broker dapat merutekan pesan berdasarkan topik tanpa perlu membaca nilai suhu.

[![Paket MQTT PUBLISH berisi fixed header, variable header dengan nama topik dan panjang properti, lalu payload JSON.](../assets/images/mqtt-publish-structure.svg)](../assets/images/mqtt-publish-structure.svg)

Contoh memakai QoS 0 sehingga paket `PUBLISH` tidak memuat Packet Identifier. `Remaining Length` menyatakan panjang bagian setelah field itu, termasuk *variable header* dan payload. [Struktur paket MQTT 5.0 §2](https://docs.oasis-open.org/mqtt/mqtt/v5.0/os/mqtt-v5.0-os.html)

## Tipe data pada MQTT

MQTT tidak membedakan query, path param, dan body seperti HTTP. Semua data utama dikirim sebagai payload, lalu konteks channel ditentukan lewat topik.

### Topic

Topik adalah alamat pesan. Struktur topik sebaiknya konsisten dan hierarkis.

Contoh pola topik:

```text
hydroponic/<kategori>/<device_id>
```

Contoh implementasi:

```text
hydroponic/sensor/esp32-01
hydroponic/actuator/pump-01
hydroponic/alert/water-level
```

### Payload

Payload adalah isi pesan yang dikirim ke topik. Bisa berupa:

- JSON (paling umum di backend dan dashboard)
- String sederhana (contoh: ON, OFF)
- Angka mentah (contoh: 674)

Contoh payload kontrol aktuator:

```json
{
  "command": "ON",
  "duration_sec": 10
}
```

### Wildcard subscription

Subscriber bisa berlangganan banyak topik sekaligus dengan wildcard:

- `+` untuk satu level topik.
- `#` untuk semua level di bawahnya.

Contoh:

```text
hydroponic/sensor/+      -> semua sensor satu level
hydroponic/sensor/#      -> semua turunan topik sensor
```

## Fitur MQTT yang paling sering dipakai

### QoS (Quality of Service)

Menentukan jaminan pengiriman pesan:

- QoS 0: at most once (cepat, tanpa jaminan sampai).
- QoS 1: at least once (minimal sampai sekali, bisa duplikat).
- QoS 2: exactly once (paling aman, overhead paling tinggi).

### Retained Message

Jika retain aktif, broker menyimpan pesan terakhir pada topik. Subscriber baru akan langsung menerima state terbaru tanpa menunggu publish berikutnya.

### Last Will and Testament (LWT)

Pesan otomatis dari broker saat client terputus mendadak. Umumnya dipakai untuk status online/offline perangkat.

Contoh topik status:

```text
hydroponic/device/esp32-01/status
```

## Tips praktik

- Gunakan struktur topik yang konsisten sejak awal proyek.
- Simpan kredensial broker di konfigurasi, jangan hardcode.
- Mulai dari QoS 0 atau QoS 1, naik ke QoS 2 hanya saat benar-benar perlu.
- Gunakan retained message untuk state terakhir (misal status pompa).
- Tambahkan LWT agar sistem cepat mendeteksi device offline.

## Apa yang diterima subscriber yang baru terhubung?

Bayangkan perangkat menerbitkan status terbaru ke `sensor/status` ketika dashboard belum terhubung. Jika status dikirim dengan QoS 1 dan penanda retained, broker menyimpannya dan mengirimkannya saat dashboard membuat langganan yang cocok. Tanpa status yang tersimpan, dashboard menunggu terbitan berikutnya.

Periksa perbedaannya dengan satu topik baru dalam latihan, supaya pesan retained dari percobaan lain tidak ikut terbaca. Rujukan [spesifikasi MQTT 3.1.1 §3.3.1.3](https://docs.oasis-open.org/mqtt/mqtt/v3.1.1/os/mqtt-v3.1.1-os.html).

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-flask-conical:</span> **Praktik MQTT dengan ESP32** <span class="ai-practice-description">Berlangganan topik sensor dan status. Cocokkan data jarak yang diterima klien MQTT dengan Serial Monitor.</span>](../hands-on/mqtt-hands-on.md){ .ai-practice-start }

</div>
