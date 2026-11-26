# Express.js dan FastAPI

!!! note "AI Generated"

    Kartu What's next pada halaman ini disusun dengan bantuan AI.

Pada dokumentasi ini lebih dikenalkan dengan Express.js yang menggunakan JavaScript. Lalu adakah framework lain yang bisa dipakai untuk membangun backend? Tentu ada, salah satu contohnya adalah FastAPI yang menggunakan Python. Secara umum, penggunaan FastAPI mirip dengan Express.js yang dapat dilihat pada tabel berikut.

## Pola yang sama

| Tugas | Express.js | FastAPI |
| --- | --- | --- |
| Menjalankan server | `app.listen(...)` | `uvicorn main:app` |
| Mendaftarkan GET | `app.get("/health", handler)` | `@app.get("/health")` |
| Mendaftarkan POST | `app.post("/sensors", handler)` | `@app.post("/sensors")` |
| Membaca JSON | `req.body` setelah `express.json()` | parameter model Pydantic |
| Mengirim JSON | `res.status(201).json(data)` | `return data` atau `JSONResponse` |
| Validasi | kode atau library validasi | Pydantic model |

## Contoh endpoint yang setara

Express.js:

```js
app.post("/sensors", (req, res) => {
  res.status(201).json({ data: req.body });
});
```

FastAPI:

```python
from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI()

class SensorIn(BaseModel):
    device_id: str
    sensor_type: str
    value: float
    unit: str

@app.post("/sensors", status_code=201)
def receive_sensor(data: SensorIn):
    return {"data": data}
```

FastAPI memvalidasi bentuk data melalui model Pydantic. Express memberi kebebasan memilih cara validasi, sehingga middleware atau library perlu ditambahkan.

## Apa kelebihan FastAPI dibanding Express.js?

FastAPI secara bawaan mengintegrasikan pengembangan API dengan Pydantic dan OpenAPI. Kedua fitur ini memberikan kemudahan dalam pengembangan backend, yaitu:

- Pydantic: Digunakan untuk memvalidasi data yang masuk dan keluar. Model Pydantic dapat digunakan sebagai parameter fungsi endpoint, sehingga data yang diterima akan otomatis divalidasi dan server backend menjadi lebih aman. Jika terdapat data yang tidak sesuai, FastAPI akan mengembalikan respons error 422 Unprocessable Entity yang membawa informasi error yang lebih detail.
- OpenAPI: Membantu dalam dokumentasi dan pengujian API secara otomatis.

## Lebih baik menggunakan apa?

Sebenarnya tidak ada aturan baku dalam memilih framework backend. Express.js dan FastAPI sama-sama dapat digunakan untuk membangun backend yang baik. Pilihan framework tergantung pada bahasa pemrograman yang dikuasai, kebutuhan proyek, dan preferensi tim pengembang.

Pada pengembangan proyek di KSM AIoT, hampir semua backend menggunakan FastAPI. Hal ini dikarenakan poin-poin kelebihan FastAPI yang telah disebutkan sebelumnya. Apakah Express.js bisa menawarkan hal yang sama? Bisa saja, tetapi perlu menambahkan library tambahan untuk validasi dan dokumentasi API. FastAPI sudah menyediakan fitur tersebut secara bawaan, sehingga lebih efisien dalam pengembangan backend.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-database:</span> **Database** <span class="ai-practice-description">Lanjutkan dari route dan validasi ke penyimpanan data.</span>](../database/overview.md){ .ai-practice-start }

</div>
