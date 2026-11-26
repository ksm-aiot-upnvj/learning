# Python Fundamental untuk AI

Saat menyiapkan data sensor untuk model, kita perlu membaca nilai, memeriksa tipenya, lalu mengolah beberapa pembacaan sekaligus. Python membantu menyusun langkah itu, dan banyak alat untuk analisis data, machine learning, serta deep learning menyediakan antarmuka Python.

Jalur ini bergerak dari script sederhana ke kode yang dipisah dalam beberapa file. Setiap konsep memakai contoh pembacaan sensor agar kita tahu kapan variabel, fungsi, modul, atau object berguna.

## Kelola proyek Python dengan uv

`uv` membantu menyiapkan versi Python, proyek, environment, dan dependensinya. Perintah `uv add` mencatat paket proyek, sedangkan `uv run` menjalankan program menggunakan environment proyek yang sesuai. [Membuat proyek dengan uv](https://docs.astral.sh/uv/concepts/projects/init/) · [Mengelola dependensi](https://docs.astral.sh/uv/concepts/dependencies/) · [Menjalankan program](https://docs.astral.sh/uv/concepts/projects/run/)

Pada contoh slide, `uv python install 3.13` memasang interpreter yang dikelola uv. Proyek dapat memakai versi itu tanpa mengganti Python yang sudah terpasang dari sistem operasi. [Mengelola versi Python](https://docs.astral.sh/uv/concepts/python-versions/)

Buat proyek latihan dengan Python 3.13, lalu jalankan contoh awalnya. Versi yang sama akan dipakai saat uv membuat environment proyek.

```console
uv python install 3.13
uv init aiot-python --no-package --python 3.13
cd aiot-python
uv run main.py
```

`uv init --no-package` membuat proyek berupa kumpulan script biasa. Kita dapat belajar menjalankan `main.py` tanpa perlu mengemas proyek sebagai paket. Saat `uv run` pertama kali dipanggil, uv menyiapkan `.venv` dan `uv.lock` jika keduanya belum ada.

Jalankan perintah paket dari folder `aiot-python`. Jika perlu library untuk eksperimen data, tambahkan dari folder proyek; uv akan mencatat kebutuhannya pada konfigurasi dan lockfile.

```console
uv add numpy
uv run main.py
```

`pyproject.toml` menyimpan metadata proyek dan daftar dependensi. `uv.lock` mencatat versi hasil resolusi agar environment proyek dapat disiapkan dengan versi paket yang konsisten.

## Kenali berkas proyek

Setelah proyek dijalankan, struktur foldernya dapat terlihat seperti ini. Sebagian berkas dibuat saat inisialisasi, sedangkan `.venv` dan `uv.lock` muncul saat environment pertama kali disiapkan.

```text
aiot-python/
├── .venv/
├── .gitignore
├── .python-version
├── main.py
├── pyproject.toml
├── README.md
└── uv.lock
```

| Berkas atau folder | Kegunaan |
| --- | --- |
| `.venv/` | Menyimpan paket untuk environment proyek. |
| `.gitignore` | Menentukan berkas lokal, seperti `.venv/`, yang tidak perlu dilacak Git. |
| `.python-version` | Menyatakan versi Python yang dipakai proyek. |
| `main.py` | Menjadi tempat menjalankan contoh utama. |
| `pyproject.toml` | Menyimpan metadata dan kebutuhan dependensi proyek. |
| `README.md` | Mencatat tujuan dan cara menjalankan proyek. |
| `uv.lock` | Mencatat versi paket terpilih dan informasi distribusi yang dipakai uv. |

VS Code dapat memakai interpreter dari `.venv`. Jalankan **Python: Select Interpreter** dari Command Palette, lalu pilih environment proyek agar fitur run dan debug memakai Python yang sama. [Memilih environment Python di VS Code](https://code.visualstudio.com/docs/python/environments)

Jika ingin menjalankan `python` langsung dari terminal, aktifkan environment lebih dulu. Perintahnya mengikuti shell yang dipakai.

=== "Windows"

    ```powershell
    .venv\Scripts\Activate.ps1
    ```

=== "macOS"

    ```sh
    source .venv/bin/activate
    ```

=== "Linux"

    ```sh
    source .venv/bin/activate
    ```

Setelah aktif, `python main.py` memakai interpreter dari `.venv`. `uv run main.py` menjalankan program pada environment proyek tanpa langkah aktivasi manual.

## Bandingkan pip dan uv

`pip` memasang paket Python dalam environment yang aktif. `requirements.txt` lazim dipakai untuk mencatat kebutuhan paket, sedangkan perintah `pip lock` saat ini berstatus eksperimental. [Dokumentasi pip lock](https://pip.pypa.io/en/stable/cli/pip_lock/)

uv menggabungkan alur proyek, environment, dependensi, dan lockfile dalam satu alat. Dokumentasi uv menyebut peningkatan kecepatan pada antarmuka `uv pip`, sedangkan hasil aktual bergantung pada paket, jaringan, dan cache. `uv.lock` mencatat versi yang terpilih untuk berbagai platform dan dapat memuat hash distribusi. [Lockfile uv](https://docs.astral.sh/uv/concepts/projects/layout/#the-lockfile) · [Klaim performa uv](https://docs.astral.sh/uv/)

| Kebutuhan | Alur pip | Alur uv |
| --- | --- | --- |
| Menambah paket | `pip install numpy` | `uv add numpy` |
| Menyimpan daftar kebutuhan | `requirements.txt` | `pyproject.toml` |
| Mengunci versi paket | `pip lock` masih eksperimental | `uv.lock` dikelola bersama proyek |
| Menjalankan program | Aktifkan environment, lalu panggil Python | `uv run main.py` |

Perbandingan ini melihat alur kerja proyek, bukan hanya kecepatan instalasi. `pip` tetap cocok untuk memasang paket; uv memberi satu alur yang mencakup kebutuhan proyek latihan ini.

## Simpan nilai dalam variabel

Variabel memberi nama pada nilai yang akan dipakai lagi. Pada Python, tanda `=` mengikat nama ke nilai, dan tipe nilai menentukan operasi yang sesuai.

```python
device_id = "esp32-01"
temperature = 28.5
is_online = True

print(f"{device_id}: {temperature} °C")
```

`device_id` berisi teks, `temperature` berisi angka desimal, dan `is_online` berisi nilai benar atau salah. Tipe data membantu Python mengetahui operasi apa yang dapat dilakukan pada setiap nilai.

## Pilih tindakan dan ulangi data

Kondisi menjalankan cabang kode yang sesuai dengan nilai. Perulangan membantu mengerjakan langkah yang sama untuk beberapa pembacaan sensor.

```python
threshold = 30

if temperature >= threshold:
    print("Periksa suhu perangkat")
else:
    print("Suhu masih di bawah ambang")
```

List menyimpan urutan nilai, sedangkan dictionary memasangkan nama field dengan nilainya. Bentuk dictionary memudahkan kita membaca satu pembacaan seperti `device_id`, `sensor_type`, `value`, dan `unit`.

```python
readings = [
    {"device_id": "esp32-01", "value": 28.5, "unit": "celsius"},
    {"device_id": "esp32-02", "value": 31.2, "unit": "celsius"},
]

for reading in readings:
    print(reading["device_id"], reading["value"])
```

## Bungkus langkah dalam fungsi

Fungsi memberi nama pada satu tugas, menerima nilai melalui parameter, lalu dapat mengembalikan hasil. Fungsi yang terpisah membuat validasi pembacaan dapat dipakai ulang di beberapa bagian program.

```python
def is_valid_reading(reading):
    return isinstance(reading["value"], (int, float))

for reading in readings:
    if is_valid_reading(reading):
        print("Data angka siap diolah")
```

## Baca berkas dan tangani error

Data sensor juga dapat disimpan sebagai JSON agar program lain bisa membacanya. `json.load()` mengubah isi berkas menjadi nilai Python, sedangkan `try` dan `except` memberi jalur yang jelas saat berkas belum tersedia.

```python
import json

try:
    with open("readings.json", encoding="utf-8") as source:
        readings = json.load(source)
except FileNotFoundError:
    readings = []
    print("Berkas pembacaan belum tersedia")
```

Untuk menulis data, gunakan `json.dump()` pada berkas yang dibuka dalam mode tulis. Parameter `indent` membuat hasilnya lebih mudah dibaca saat diperiksa.

```python
with open("readings.json", "w", encoding="utf-8") as target:
    json.dump(readings, target, indent=2)
```

## Pisahkan kode menjadi modul

Satu berkas Python dapat dipakai sebagai modul oleh berkas lain. Pisahkan fungsi yang mengolah pembacaan ke `sensor_utils.py`, lalu impor fungsi itu ke `main.py` saat dibutuhkan.

```python
# sensor_utils.py
def format_reading(reading):
    return f"{reading['device_id']}: {reading['value']} {reading['unit']}"
```

```python
# main.py
from sensor_utils import format_reading

print(format_reading(readings[0]))
```

Class juga bisa disimpan di modul tersendiri. Setelah class `SensorReading` dibuat di `sensor_reading.py`, impor class itu dari `main.py` dengan nama modulnya.

```python
from sensor_reading import SensorReading
```

Python juga menyediakan modul standar, misalnya `json` untuk membaca dan menulis data JSON. Gunakan `import json` sebelum memanggil fungsi seperti `json.load()` atau `json.dump()`.

## Buat class dan object

Class mengelompokkan data dan fungsi yang berkaitan dalam satu bentuk. Object adalah nilai yang dibuat dari class, sehingga satu class dapat dipakai untuk mewakili banyak pembacaan sensor.

```python
class SensorReading:
    def __init__(self, device_id, sensor_type, value, unit):
        self.device_id = device_id
        self.sensor_type = sensor_type
        self.value = value
        self.unit = unit

    def summary(self):
        return f"{self.device_id}: {self.value} {self.unit}"

reading = SensorReading("esp32-01", "temperature", 28.5, "celsius")
print(reading.summary())
```

`__init__` mengisi atribut ketika object dibuat, sedangkan `self` merujuk pada object yang sedang dipakai. Method seperti `summary()` mengerjakan sesuatu dengan data milik object itu.

## Pahami empat pilar OOP

Empat pilar ini menjelaskan cara mengatur data dan perilaku saat program mulai memiliki banyak jenis object. Contoh sensor menunjukkan fungsi tiap pilar tanpa perlu membangun hierarki yang rumit.

| Pilar | Contoh pada perangkat sensor |
| --- | --- |
| Enkapsulasi | Class `SensorReading` menyimpan atribut pembacaan dan method yang mengolahnya dalam satu object. |
| Abstraksi | Kode lain memanggil `summary()` tanpa perlu tahu bagaimana teks ringkasan disusun. |
| Pewarisan | Class `TemperatureSensor` dapat mewarisi atribut dan perilaku umum dari class `Sensor`. |
| Polimorfisme | Class sensor berbeda dapat menyediakan method `read()` yang sama dengan cara kerja sesuai jenis sensornya. |

Gunakan class ketika data dan perilakunya perlu dikelola bersama. Fungsi dan dictionary tetap cukup untuk tugas kecil, sehingga tidak semua nilai perlu dijadikan object.

## Latihan: olah pembacaan sensor

1. Pasang Python 3.13 terkelola dengan `uv python install 3.13`.
2. Buat folder proyek dengan `uv init aiot-python --no-package --python 3.13`.
3. Masuk ke folder proyek dengan `cd aiot-python`.
4. Simpan dua pembacaan sensor dalam list of dictionaries.
5. Buat fungsi yang memeriksa tipe nilai pembacaan.
6. Pindahkan fungsi format ke `sensor_utils.py`.
7. Buat class `SensorReading` dengan atribut dan method `summary()`.
8. Impor fungsi atau class dari `main.py`.
9. Jalankan program dengan `uv run main.py`.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-table-2:</span> **Machine Learning** <span class="ai-practice-description">Gunakan dasar Python untuk menyiapkan data, mempelajari algoritma, dan mengevaluasi prediksi.</span>](machine-learning/overview.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-brain:</span> **Deep Learning** <span class="ai-practice-description">Pelajari jaringan saraf setelah memahami masalah, preprocessing, dan evaluasi model.</span>](deep-learning/overview.md)

</div>
