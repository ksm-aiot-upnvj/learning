# Frontend Development

Halaman frontend berisi jalur belajar untuk membangun antarmuka dashboard AIoT yang membaca data dari backend dan menampilkan informasi secara real-time.

Frontend adalah bagian yang membuat data terasa bisa dibaca manusia. Dalam AIoT, frontend biasanya menampilkan status device, tabel data sensor, grafik, tombol refresh, dan pesan error.

## Alur Besar

```mermaid
flowchart LR
    A["Backend API"] --> B["Frontend mengambil JSON"]
    B --> C["State: loading, success, error"]
    C --> D["Component Vue"]
    D --> E["Dashboard"]
```

## Urutan Belajar yang Disarankan

1. [Web Basics](web-basics.md)
2. [JavaScript untuk Frontend](javascript.md)
3. [TypeScript untuk Frontend](typescript.md)
4. [Vue Basics](vue-basics.md)
5. [Integrasi Frontend dengan API](api-integration.md)
6. [Jalur Praktik Frontend](fundamental.md)
7. [Frontend Mini](../hands-on/frontend-mini.md)

## Capaian Belajar

- Memahami peran HTML, CSS, dan JavaScript.
- Memahami alasan TypeScript dipakai di proyek yang butuh tipe data lebih jelas.
- Memahami component, props, event, dan state di Vue.
- Mengambil data dari API.
- Menampilkan loading, error, dan empty state.
- Membaca struktur folder frontend tanpa tersesat.

[Kembali ke Home](../index.md)
