# Perintah Dasar Git

!!! note "AI Generated"

    Contoh perintah, penjelasan, dan jalur praktik pada halaman ini disusun dengan bantuan AI.

Saat beberapa berkas berubah, kita perlu memilih perubahan mana yang dicatat bersama. `git status` menunjukkan berkas yang berubah, lalu `git diff` membantu membaca perbedaannya. Siapkan Git melalui [panduan instalasi](git-installation.md) sebelum mencoba perintah.

## Konfigurasi Awal Git

Git menyimpan nama dan email penulis sebagai bagian dari setiap commit. Untuk latihan, jalankan perintah berikut dari dalam repositori. Opsi `--local` berlaku pada repositori itu, sedangkan `--global` menentukan setelan bawaan akun komputer untuk berbagai repositori.

```console
git config --local user.name "Nama Lengkap"
git config --local user.email "nama@example.com"
```

Untuk commit yang akan dikirim ke GitHub, gunakan alamat yang terhubung dengan akun. Alamat `noreply` dari pengaturan GitHub bisa dipakai agar alamat pribadi tidak tercantum pada commit baru. [Mengatur alamat email commit](https://docs.github.com/en/account-and-profile/how-tos/email-preferences/setting-your-commit-email-address)

## Perintah Dasar Git

Jalankan `git init -b main` dalam folder latihan baru untuk memulai repositori. Setelah commit awal README dibuat, ubah satu baris di README agar perintah pembanding memiliki versi sebelumnya. Gunakan [latihan Git Lokal](../hands-on/git-local-remote.md) untuk mengikuti langkah sejak folder masih kosong.

| Perintah | Yang dilihat atau dilakukan |
| --- | --- |
| `git status` | Menunjukkan cabang aktif dan berkas baru, berubah, atau siap masuk commit. |
| `git diff` | Membandingkan berkas yang sudah dilacak di folder kerja dengan staging area. |
| `git add README.md` | Menyiapkan isi README untuk commit berikutnya. |
| `git diff --staged` | Membandingkan isi staging area dengan commit terakhir. |
| `git commit -m "docs: perbarui petunjuk latihan"` | Membuat commit dari isi yang sudah disiapkan. |

Jika README baru pertama kali dibuat, Git menampilkannya sebagai *untracked* sampai berkas ditambahkan. `git status` sudah memperlihatkan berkas baru itu. Gunakan `git diff --staged` setelah `git add README.md` untuk membaca isinya sebelum commit.

## Berpindah riwayat commit

Gunakan `git show <hash-commit>` untuk membaca satu commit tanpa berganti cabang. Jika ingin melihat pohon berkas pada commit lama, `git switch --detach <hash-commit>` memindahkan posisi kerja langsung ke commit itu. Jalankan `git switch main` untuk kembali ke cabang latihan. [Dokumentasi git switch](https://git-scm.com/docs/git-switch)

## Bekerja dengan Repository remote

`git clone` mengambil salinan repositori yang sudah ada, sedangkan `git remote add origin <url>` menghubungkan repositori lokal dengan suatu tujuan. Setelah ada commit lokal, `git push -u origin main` mengirim cabang `main` dan mengatur pelacakannya. Baca [Remote Repositories](remote-repositories.md) untuk memeriksa tujuan sebelum push.

## Mengatur `git log`

Tampilkan commit secara ringkas dengan `git log --oneline`. Jika sudah ada beberapa cabang, tambahkan `--all --graph --decorate` agar label cabang dan hubungan antarcommit terlihat.

```console
git log --oneline --all --graph --decorate
```

## Alur Penggunaan Git

Sebelum commit, periksa daftar perubahan dengan `git status`, lalu baca isi yang sudah disiapkan melalui `git diff --staged`. Setelah commit tercatat, gunakan `git log --oneline` untuk menemukan pesan dan identitas commit.

## What's next

<div class="ai-resource-grid ai-practice-grid" markdown="1">

[<span class="ai-practice-icon" aria-hidden="true">:lucide-git-branch:</span> **Konsep Branching** <span class="ai-practice-description">Mulai pekerjaan baru dari satu commit dan lihat cabang berkembang.</span>](branching-concepts.md){ .ai-practice-start }

[<span class="ai-practice-icon" aria-hidden="true">:lucide-terminal:</span> **Git Lokal dan Repositori Sendiri** <span class="ai-practice-description">Coba alur dari folder kosong sampai push pertama.</span>](../hands-on/git-local-remote.md)

</div>
