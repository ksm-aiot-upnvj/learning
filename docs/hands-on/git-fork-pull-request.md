# Fork dan Pull Request di GitHub

!!! note "AI Generated"

    Penjelasan izin, langkah latihan, dan pemeriksaan pull request pada halaman ini disusun dengan bantuan AI.

Saat ingin mengusulkan perubahan ke repo yang dikelola tim lain, kita bisa membuat *fork*, yaitu salinan repositori di akun sendiri yang masih terhubung dengan repo asli di GitHub. Simpan commit pada cabang fork, lalu buat *pull request* (PR) untuk meminta pengelola meninjau perubahan sebelum menggabungkannya. [Pull request dari fork](https://docs.github.com/en/pull-requests/how-tos/create-pull-requests/creating-a-pull-request-from-a-fork)

Siapkan akun GitHub, Git, PowerShell, dan VS Code. Jika ini push pertama, ikuti [Git Lokal dan Repositori Sendiri](git-local-remote.md) dahulu agar cara autentikasi dan pemeriksaan `origin` sudah dikenal. Latihan ini memakai folder baru untuk menyimpan salinan fork.

## Buat fork dan periksa kedua remote

1. Buka [repositori latihan KSM AIoT](https://github.com/ksm-aiot-upnvj/latihan-git-aiot).

2. Buat fork di akun pribadi.

3. Masukkan nama pengguna pemilik fork pada prompt.

    ```powershell
    $namaAkun = Read-Host "Nama pengguna GitHub"
    ```

4. Clone fork ke folder baru.

    ```powershell
    git clone "https://github.com/$namaAkun/latihan-git-aiot.git" kontribusi-git-aiot
    ```

5. Masuk ke folder hasil clone.

    ```powershell
    Set-Location kontribusi-git-aiot
    ```

6. Tambahkan repositori organisasi sebagai `upstream`.

    ```powershell
    git remote add upstream https://github.com/ksm-aiot-upnvj/latihan-git-aiot.git
    ```

7. Periksa kedua URL remote.

    ```powershell
    git remote -v
    ```

8. Ambil riwayat terbaru dari repo organisasi.

    ```powershell
    git fetch upstream
    ```

Hasil `git remote -v` menampilkan `origin` dengan URL akun sendiri dan `upstream` dengan URL organisasi. Kita mengambil riwayat terbaru dari `upstream` untuk memulai cabang. Saat mengirimnya, gunakan `origin` agar commit tersedia pada fork.

## Siapkan dan push usulan

Atur `user.name` dan `user.email` pada repo ini jika Git belum mengenali identitas penulis. Opsi `--local` membatasi pengaturan pada clone ini, sehingga identitas repositori latihan lain tetap terpisah. [Konfigurasi awal Git](../version-control/basic-git-commands.md#konfigurasi-awal-git)

Nama berkas mengikuti nama pengguna agar setiap peserta bisa membuat satu perubahan yang mudah dikenali. Jika berkas sudah ada, buka berkas itu pada langkah pembuatan berkas dan perbarui isinya. Gunakan nama akun tanpa tanda kurung sudut untuk nama berkas.

1. Buat cabang latihan dari `upstream/main`.

    ```powershell
    git switch --no-track -c "latihan/$namaAkun" upstream/main
    ```

2. Buka `kontribusi-git-aiot` lewat **File > Open Folder** di VS Code.
3. Jika belum ada, buat folder `peserta` melalui **New Folder** di panel **Explorer**.
4. Buat berkas `<nama-akun>.md` di folder `peserta` lewat **New File**.
5. Ketik `# Latihan Git @<nama-akun>` dengan mengganti `<nama-akun>` memakai nama pengguna GitHub.
6. Simpan berkas dengan `Ctrl+S`.

Kembali ke PowerShell yang dipakai untuk clone. Sesi itu sudah berada di folder repositori dan masih menyimpan nilai `$namaAkun`.

1. Periksa berkas yang berubah.

    ```powershell
    git status --short
    ```

2. Siapkan berkas latihan.

    ```powershell
    git add "peserta/$namaAkun.md"
    ```

3. Periksa usulan sebelum commit.

    ```powershell
    git diff --staged
    ```

4. Simpan commit usulan.

    ```powershell
    git commit -m "docs: tambah catatan latihan Git"
    ```

5. Kirim cabang latihan ke fork.

    ```powershell
    git push -u origin "latihan/$namaAkun"
    ```

## Kenapa push ke repo organisasi dapat ditolak?

GitHub menolak push jika akun yang sedang digunakan tidak memiliki izin tulis ke repositori tujuan. Pesan yang muncul dapat berupa `Permission denied` atau HTTP 403, tergantung cara masuk dan konfigurasi remote. Pada latihan ini, lakukan push ke fork sendiri, lalu ajukan perubahannya melalui PR. [Model kolaborasi GitHub](https://docs.github.com/en/pull-requests/reference/pull-requests)

Aturan cabang dapat mewajibkan PR meskipun anggota punya izin tulis. Karena itu, periksa tujuan push dan aturan proyek saat mengerjakan repo bersama. [Cabang yang dilindungi](https://docs.github.com/en/repositories/configuring-branches-and-merges-in-your-repository/managing-protected-branches/about-protected-branches)

## Buka pull request

1. Buka repositori organisasi di GitHub.

2. Buka formulir **New pull request**.

3. Pilih **compare across forks**.

4. Pilih repo organisasi sebagai **base repository**.

5. Pilih `main` sebagai **base**.

6. Pilih repo fork sendiri sebagai **head repository**.

7. Pilih cabang `latihan/<nama-akun>` sebagai **compare**.

8. Periksa berkas usulan pada tampilan perubahan.

Di formulir tersebut, **base** adalah cabang tujuan dan **compare** adalah cabang yang membawa commit usulan. Tampilan perubahan seharusnya menunjukkan satu berkas `peserta/<nama-akun>.md`. Jika ada perubahan lain, periksa pilihan repo dan cabang sebelum melanjutkan.

1. Tulis judul yang menjelaskan usulan.

2. Isi deskripsi dengan tujuan perubahan.

3. Klik **Create pull request**.

4. Periksa berkas usulan pada tab **Files changed**.

PR kini bisa diperiksa oleh pengelola repositori. Jika pengelola meminta revisi, buat commit baru pada cabang yang sama, lalu push lagi ke fork. GitHub menambahkan commit itu ke PR yang sudah terbuka. [Panduan pull request GitHub](https://docs.github.com/en/pull-requests/reference/pull-requests)

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-book-open:</span> **Contribute** <span class="ai-practice-description">Ikuti aturan kontribusi saat menyunting dokumentasi AIoT Learning Hub.</span>](../guide.md){ .ai-practice-start }

</div>
