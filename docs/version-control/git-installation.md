# Instalasi Git

!!! note "AI Generated"

    Langkah instalasi dan pemeriksaan Git pada halaman ini disusun dengan bantuan AI.

Git dijalankan dari terminal, jadi pemasangan perlu menghasilkan perintah `git` yang dikenali di terminal baru. Panduan ini memakai PowerShell di Windows. Untuk macOS dan Linux, pilih petunjuk pemasangan sesuai sistem pada [halaman unduhan resmi Git](https://git-scm.com/downloads).

## Memasang Git di Windows

1. Buka [halaman unduhan Git untuk Windows](https://git-scm.com/download/win).
2. Unduh pemasang yang sesuai dengan arsitektur Windows.
3. Buka berkas pemasang.
4. Pilih pengaturan yang mengizinkan Git dipakai dari command line saat pemasang menanyakan PATH.
5. Selesaikan pemasangan.
6. Buka jendela PowerShell baru.
7. Periksa versi Git.

    ```powershell
    git --version
    ```

Jika terminal menampilkan versi seperti `git version 2.x`, perintah sudah dikenali. Jika `git` tidak ditemukan, buka terminal baru untuk mengambil pengaturan PATH terbaru. Jika pesan tetap muncul, periksa opsi PATH pada pemasang.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-terminal:</span> **Perintah Dasar Git** <span class="ai-practice-description">Atur identitas commit dan periksa perubahan sebelum mencatatnya.</span>](basic-git-commands.md){ .ai-practice-start }

</div>
