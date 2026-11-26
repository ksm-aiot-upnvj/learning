# NGINX untuk Reverse Proxy

!!! note "AI Generated"

    Penjelasan jalur request dan uji deployment dari browser disusun dengan bantuan AI.

NGINX dapat menyajikan berkas web dan bertindak sebagai *reverse proxy*. Saat menerima permintaan, NGINX mencocokkan path dengan konfigurasi. Permintaan dapat dijawab dengan berkas atau diteruskan ke layanan lain.

Pada situs katalog, alamat yang sama bisa menyajikan halaman web dan meneruskan `/api/products` ke backend. Browser cukup mengenal alamat situs, sementara NGINX menentukan layanan yang menangani setiap path.

Paket AIoT memakai pola itu untuk Vue dan Express. NGINX menyajikan hasil build Vue pada `/` dan meneruskan `/api/sensors` menjadi `/sensors` di Express. Dashboard membaca data lewat alamat web yang sama.

## Alur sederhana reverse proxy

```mermaid
flowchart LR
    Browser["Browser laptop"] --> Tunnel["SSH tunnel :8080"]
    Tunnel --> Web["NGINX pada layanan web"]
    Web --> Vue["Berkas hasil build Vue"]
    Web -->|" /api/sensors → /sensors "| API["Express pada api:8000"]
    API --> DB[("PostgreSQL pada db:5432")]
```

## Uji path yang diterima backend

Buka [nginx.conf pada paket](../assets/demos/sensor-deployment/nginx.conf) untuk menemukan blok `location /api/`. Pada `proxy_pass http://api:8000/;`, URI `/` di akhir mengganti awalan `/api/`. Karena itu request `/api/health` tiba di Express sebagai `/health`. [Aturan URI pada proxy_pass](https://nginx.org/en/docs/http/ngx_http_proxy_module.html#proxy_pass)

Jalankan `docker compose exec web nginx -t` dari folder deployment di server untuk memeriksa sintaks. Jika hasil curl memberi 404, periksa path yang diteruskan. Jika mendapat 502, jalankan `docker compose logs web api` untuk memeriksa apakah NGINX dapat menghubungi API.

## Uji dashboard dari browser

1. Jalankan [SSH tunnel](ssh-basics.md#buka-akses-browser-lewat-ssh-tunnel) dari terminal laptop.
2. Buka `http://127.0.0.1:8080/` di browser.
3. Kirim [payload sensor](../hands-on/backend-mini.md#kirim-post-dengan-json) lewat Postman ke `http://127.0.0.1:8080/api/sensors`.
4. Catat `data.id` dari respons 201.
5. Klik **Muat ulang** di dashboard.
6. Cocokkan ID, nilai, dan satuan dengan isi respons POST.

Jika browser berada di mesin Linux yang sama, buka alamat latihan langsung. Pada server jarak jauh, biarkan tunnel aktif selama pengujian karena koneksi browser bergantung pada sesi itu.

Jika ingin mengakhiri latihan di sini, jalankan `docker compose down` dari folder deployment di server. Perintah itu menghentikan container, sementara volume database tetap tersedia saat stack dijalankan lagi. Jika ingin lanjut memeriksa stack di Portainer atau Beszel, biarkan container latihan berjalan. [Dokumentasi compose down](https://docs.docker.com/reference/cli/docker/compose/down/)

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-panels-top-left:</span> **Portainer** <span class="ai-practice-description">Kelola stack dan baca log Docker lewat antarmuka web.</span>](portainer.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-activity:</span> **Beszel** <span class="ai-practice-description">Amati riwayat CPU dan memori server serta container.</span>](beszel.md)

[<span class="ai-practice-icon" aria-hidden="true">:lucide-chart-line:</span> **Prometheus + Grafana** <span class="ai-practice-description">Ikuti perjalanan metrik CPU dan memori sampai tampil sebagai grafik.</span>](prometheus-grafana.md)

</div>
