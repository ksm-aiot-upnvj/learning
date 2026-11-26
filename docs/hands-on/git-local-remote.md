# Git Lokal dan Repositori Sendiri

!!! note "AI Generated"

    Langkah latihan dan contoh perintah pada halaman ini disusun dengan bantuan AI.

Satu perubahan README bisa dipakai untuk melihat kapan pekerjaan tercatat dan kapan commit dikirim ke GitHub. Mulai dari folder kosong di laptop, lalu hubungkan repositori itu ke akun pribadi setelah riwayat lokal siap.

Siapkan VS Code dan [pasang Git](../version-control/git-installation.md) sebelum memulai. Gunakan editor untuk mengubah README dan terminal pilihanmu untuk menjalankan perintah Git. Siapkan akun GitHub saat masuk ke bagian push.

## Siapkan folder di VS Code

1. Buat folder kosong bernama `git-lokal-aiot` melalui pengelola berkas.
2. Buka folder tersebut melalui **File > Open Folder** di VS Code.
3. Buka panel terminal melalui **Terminal > New Terminal**.
4. Jalankan perintah Git dari terminal yang terbuka.

Terminal terintegrasi biasanya dimulai dari folder yang dibuka di VS Code. Jika prompt menampilkan lokasi lain, pindah ke folder `git-lokal-aiot` sebelum menjalankan perintah Git. [Terminal VS Code](https://code.visualstudio.com/docs/terminal/basics)

## Buat repositori dan commit pertama

Ganti contoh nama dan email sebelum menjalankan perintah konfigurasi. Jika akan mengirim commit ke GitHub, pakai email yang terhubung dengan akun atau alamat `noreply` dari pengaturan GitHub. Pengaturan ini hanya berlaku pada repositori latihan. [Mengatur email commit di GitHub](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address)

1. Mulai repositori dengan cabang `main`.

    ```console
    git init -b main
    ```

2. Atur nama penulis commit untuk repo latihan.

    ```console
    git config --local user.name "Nama Lengkap"
    ```

3. Atur email penulis commit untuk repo latihan.

    ```console
    git config --local user.email "nama@example.com"
    ```

4. Buat berkas `README.md` melalui **New File** di panel **Explorer**.
5. Ketik `# Panduan AIoT` pada baris pertama.
6. Simpan berkas dengan `Ctrl+S`.

7. Periksa status README baru.

    ```console
    git status --short
    ```

8. Siapkan README untuk commit.

    ```console
    git add README.md
    ```

9. Periksa isi yang akan dicatat.

    ```console
    git diff --staged
    ```

Sebelum `git add`, `git status --short` menampilkan `?? README.md` karena Git belum melacak berkasnya. Setelah ditambahkan, `git diff --staged` menampilkan judul yang akan masuk ke commit. Jika keluaran Git terbuka di penampil teks terminal, tekan `q` untuk kembali ke prompt.

1. Simpan commit pertama.

    ```console
    git commit -m "docs: tambah README latihan"
    ```

2. Periksa riwayat lokal.

    ```console
    git log --oneline
    ```

## Buat dua perubahan yang bertabrakan

Gunakan dua judul yang berbeda pada baris pertama README. Karena kedua cabang berawal dari judul yang sama, Git akan menemukan dua perubahan untuk baris yang sama saat cabang digabungkan. Setelah mengedit README di VS Code, tekan `Ctrl+S` sebelum kembali ke terminal.

1. Buat cabang `petunjuk` dan aktifkan cabang itu.

    ```console
    git switch -c petunjuk
    ```

2. Ganti baris pertama `README.md` dengan `# Panduan sensor AIoT` di VS Code.

3. Periksa perubahan di folder kerja.

    ```console
    git diff
    ```

4. Siapkan perubahan pada cabang `petunjuk`.

    ```console
    git add README.md
    ```

5. Simpan commit pada cabang `petunjuk`.

    ```console
    git commit -m "docs: sebut sensor pada judul"
    ```

6. Pindah kembali ke `main`.

    ```console
    git switch main
    ```

7. Ganti baris pertama `README.md` dengan `# Panduan perangkat AIoT` di VS Code.

8. Siapkan perubahan pada `main`.

    ```console
    git add README.md
    ```

9. Simpan commit pada `main`.

    ```console
    git commit -m "docs: sebut perangkat pada judul"
    ```

## Gabungkan cabang dan selesaikan konflik

1. Mulai merge dari cabang `main`.

    ```console
    git merge petunjuk
    ```

2. Periksa berkas yang konflik.

    ```console
    git status
    ```

3. Buka `README.md` di VS Code untuk melihat kedua versi judul.
4. Ganti seluruh blok konflik, termasuk penandanya, dengan `# Panduan perangkat dan sensor AIoT`.
5. Simpan hasilnya dengan `Ctrl+S`.
6. Siapkan README yang sudah diperbaiki.

    ```console
    git add README.md
    ```

7. Periksa isi yang disiapkan.

    ```console
    git diff --staged
    ```

8. Simpan commit hasil merge.

    ```console
    git commit -m "merge: satukan judul README"
    ```

9. Periksa grafik riwayat.

    ```console
    git log --all --graph --decorate --oneline
    ```

Merge pertama berhenti dengan pesan konflik dan `git status` menunjukkan README sebagai `both modified`. Setelah commit merge dibuat, grafik memperlihatkan dua jalur dari commit awal yang bertemu kembali. Judul gabungan sekarang ada di `main`. [Cara membaca penanda konflik](../version-control/git-conflict.md)

## Push ke repositori GitHub sendiri

GitHub perlu menerima commit yang sudah ada di laptop. Buat repositori kosong agar cabang di GitHub bisa dimulai dari riwayat lokal. Jika repositori dibuat dengan README bawaan, GitHub akan punya riwayat awal tersendiri.

1. Buat repositori kosong bernama `git-lokal-aiot` di akun sendiri.

2. Ganti `NAMA-AKUN` pada perintah berikut dengan nama akun GitHub.

3. Hubungkan URL sebagai `origin`.

    ```console
    git remote add origin https://github.com/NAMA-AKUN/git-lokal-aiot.git
    ```

4. Periksa tujuan push.

    ```console
    git remote -v
    ```

5. Kirim cabang `main` ke repo pribadi.

    ```console
    git push -u origin main
    ```

6. Buka cabang `main` pada halaman repo pribadi.

7. Cocokkan judul README dengan hasil merge.

8. Cocokkan commit terbaru dengan `git log --oneline -1`.

Jika Git membuka jendela masuk, gunakan akun pemilik repositori. Push yang berhasil membuat GitHub menampilkan judul “Panduan perangkat dan sensor AIoT” dan commit merge. Opsi `-u` mengatur `main` lokal untuk melacak `origin/main`. [Mengirim repositori lokal ke GitHub](https://docs.github.com/en/migrations/importing-source-code/using-the-command-line-to-import-source-code/adding-locally-hosted-code-to-github)

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-git-pull-request:</span> **Fork dan Pull Request di GitHub** <span class="ai-practice-description">Gunakan alur kontribusi saat repo tujuan dikelola organisasi.</span>](git-fork-pull-request.md){ .ai-practice-start }

</div>
