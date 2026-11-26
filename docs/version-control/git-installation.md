# Instalasi Git

!!! note "AI Generated"

    Langkah instalasi dan pemeriksaan Git pada halaman ini disusun dengan bantuan AI.

Git tersedia melalui pemasang atau pengelola paket yang berbeda pada tiap sistem operasi. Pilih tab sesuai komputer yang dipakai.

=== "Windows"

    Unduh dan pasang [Git for Windows](https://git-scm.com/install/windows). Saat pemasang menanyakan PATH, pilih opsi yang membuat perintah Git dapat dijalankan dari terminal.

=== "macOS"

    Jalankan perintah berikut untuk memasang command line tools Apple. Jika Git sudah tersedia, macOS akan memberi tahu; jika belum, ikuti dialog pemasang.

    ```sh
    xcode-select --install
    ```

=== "Linux"

    Pada Debian atau Ubuntu, jalankan:

    ```sh
    sudo apt install git
    ```

    Untuk distribusi lain, pilih pengelola paket pada [panduan resmi Git untuk Linux](https://git-scm.com/install/linux.html).

Buka terminal baru dan periksa instalasi dengan perintah yang sama pada ketiga sistem:

```console
git --version
```

Jika terminal menampilkan versi seperti `git version 2.x`, perintah sudah dikenali. Jika `git` tidak ditemukan, buka terminal baru agar pengaturan PATH terbaru terbaca.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-terminal:</span> **Perintah Dasar Git** <span class="ai-practice-description">Atur identitas commit dan periksa perubahan sebelum mencatatnya.</span>](basic-git-commands.md){ .ai-practice-start }

</div>
